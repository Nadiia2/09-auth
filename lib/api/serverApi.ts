import { cookies } from "next/headers";

import api from "./api";

import type { Note } from "@/types/note";
import type { User } from "@/types/user";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  keyWord: string,
  page: number = 1,
  tag?: string,
): Promise<FetchNotesResponse> => {
  const cookieStore = await cookies();

  const params: {
    page: number;
    perPage: number;
    search?: string;
    tag?: string;
  } = {
    page,
    perPage: 12,
  };

  if (keyWord.trim()) {
    params.search = keyWord;
  }

  if (tag && tag.toLowerCase() !== "all") {
    params.tag = tag;
  }

  const response = await api.get<FetchNotesResponse>("/notes", {
    params,
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const cookieStore = await cookies();

  const response = await api.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return response.data;
};

export const getUser = async (): Promise<User> => {
  const cookieStore = await cookies();

  const response = await api.get<User>("/users/me", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return response.data;
};

export const checkServerSession = async () => {
  const cookieStore = await cookies();

  const response = await api.get("/auth/session", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return response;
};
