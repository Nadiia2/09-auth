import type { Metadata } from "next";

import CreateNote from "./CreateNote.client";

export const metadata: Metadata = {
  title: "Create note | NoteHub",
  description:
    "Quickly create a new note in NoteHub - the efficient note-taking app for organizing your thoughts and ideas.",

  openGraph: {
    title: "Create note | NoteHub",
    description:
      "Create a new note in NoteHub - the efficient note-taking app for organizing your thoughts and ideas.",
    url: "https://08-zustand-olive-gamma.vercel.app/notes/action/create",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub application",
      },
    ],
  },
};

export default function PageForNoteCreation() {
  return <CreateNote />;
}
