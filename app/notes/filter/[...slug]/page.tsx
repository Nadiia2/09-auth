import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";

import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

type FilteredNotesProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({
  params,
}: FilteredNotesProps): Promise<Metadata> {
  const { slug } = await params;

  const tag = slug?.[0] === "All" ? "All notes" : slug?.[0];

  return {
    title: `Notes - ${tag} `,
    description: `Browsed notes tagged with "${tag}". Notehub allows you to filter and view notes based on specific tags for better organization.`,
    openGraph: {
      title: `Notes - ${tag} `,
      description: `Browsed notes tagged with "${tag}". Notehub allows you to filter and view notes based on specific tags for better organization.`,
      url: `https://08-zustand-olive-gamma.vercel.app/notes/filter/${slug.join("/")}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub",
        },
      ],
    },
  };
}

interface FilterPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export default async function FilterPage({ params }: FilterPageProps) {
  const { slug } = await params;

  const tag = slug?.[0] ?? "all";

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", "", 1, tag],
    queryFn: () =>
      fetchNotes("", 1, tag.toLowerCase() === "all" ? undefined : tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}

// import { fetchNotes } from "../../lib/api";
// import NotePage from "./Notes.client";

// const Notes = async () => {
//   const notes = await fetchNotes("", 1);

//   return <NotePage res={notes} />;
// };

// export default Notes;
