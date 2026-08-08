import axios from "axios";
import { type Note, type NoteTag } from "../types/note";

axios.defaults.baseURL = "https://notehub-public.goit.study/api";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
  // currentPage: number;
}

export const fetchNotes = async (
  keyWord: string,
  page: number = 1,
  tag?: string,
): Promise<FetchNotesResponse> => {
  try {
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

    const response = await axios.get<FetchNotesResponse>("/notes", {
      params,
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
      },
    });
    // const url = keyWord.trim()
    //   ? `/notes?search=${keyWord}&page=${page}&perPage=12`
    //   : `/notes?page=${page}&perPage=12`;

    // const response = await axios.get<FetchNotesResponse>(url, {
    //   headers: {
    //     Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
    //   },
    // });

    return response.data;
  } catch (error) {
    console.error("Error fetching notes:", error);
    throw error;
  }
};

export interface CreateNoteRequest {
  title: string;
  content: string;
  tag: NoteTag;
}
export const createNote = async (
  noteData: CreateNoteRequest,
): Promise<Note> => {
  try {
    // console.log(noteData);
    const response = await axios.post<Note>(`/notes`, noteData, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating note:", error);
    throw error;
  }
};

export const deleteNote = async (noteId: string): Promise<Note> => {
  try {
    console.log("Deleting:", noteId);
    const response = await axios.delete<Note>(`/notes/${noteId}`, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting note:", error);
    throw error;
  }
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await axios.get<Note>(`/notes/${id}`, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
    },
  });

  return response.data;
};
