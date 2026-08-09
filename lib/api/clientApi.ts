import api from "./api";
import type { Note, NoteTag } from "@/types/note";
import type { User } from "@/types/user";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNoteRequest {
  title: string;
  content: string;
  tag: NoteTag;
}

interface AuthRequest {
  email: string;
  password: string;
}

interface UpdateUserRequest {
  username: string;
}

export const fetchNotes = async (
  keyWord: string,
  page: number = 1,
  tag?: string,
): Promise<FetchNotesResponse> => {
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
  });

  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await api.get<Note>(`/notes/${id}`);

  return response.data;
};

export const createNote = async (
  noteData: CreateNoteRequest,
): Promise<Note> => {
  const response = await api.post<Note>("/notes", noteData);

  return response.data;
};

export const deleteNote = async (noteId: string): Promise<Note> => {
  const response = await api.delete<Note>(`/notes/${noteId}`);

  return response.data;
};

export const registerUser = async (credentials: AuthRequest): Promise<User> => {
  const response = await api.post<User>("/auth/register", credentials);

  return response.data;
};

export const loginUser = async (credentials: AuthRequest): Promise<User> => {
  const response = await api.post<User>("/auth/login", credentials);

  return response.data;
};

export const logoutUser = async (): Promise<void> => {
  await api.post("/auth/logout");
};

export const checkSession = async (): Promise<User> => {
  const response = await api.get<User>("/auth/session");

  return response.data;
};

export const getUser = async (): Promise<User> => {
  const response = await api.get<User>("/users/me");

  return response.data;
};

export const updateUser = async (
  userData: UpdateUserRequest,
): Promise<User> => {
  const response = await api.patch<User>("/users/me", userData);

  return response.data;
};
