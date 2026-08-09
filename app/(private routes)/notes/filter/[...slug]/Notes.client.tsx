"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import NoteList from "../../../../../components/NoteList/NoteList";
import css from "./NotesPage.module.css";
import {
  fetchNotes,
  type FetchNotesResponse,
} from "../../../../../lib/api/clientApi";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Pagination from "../../../../../components/Pagination/Pagination";
// import Modal from "../../../../components/Modal/Modal";
import SearchBox from "../../../../../components/SearchBox/SearchBox";
import { useDebouncedCallback } from "use-debounce";
import toast, { Toaster } from "react-hot-toast";
// import NoteForm from "../../../../components/NoteForm/NoteForm";

// type NotesClientProps = {
//   res: FetchNotesResponse;
// };
interface NotesClientProps {
  tag: string;
}
export default function NotesClient({ tag }: NotesClientProps) {
  const [page, setPage] = useState(1);
  // const [isOpenModal, setIsOpenModal] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [keyWord, setKeyWord] = useState("");
  // const [searchRequest, setSearchRequest] = useState("");
  // const [debouncedSearchRequest] = useDebounce(keyWord, 500);
  const handleChange = useDebouncedCallback((value: string) => {
    setKeyWord(value);
    setPage(1);
  }, 500);

  // const handleChange = useDebouncedCallback(setKeyWord, 500);
  // setPage(1);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    handleChange(value);
  };

  const { data, isLoading, isFetching, isError, isFetched } =
    useQuery<FetchNotesResponse>({
      queryKey: ["notes", keyWord, page, tag],
      queryFn: () =>
        fetchNotes(
          keyWord,
          page,
          tag.toLowerCase() === "all" ? undefined : tag,
        ),
      // enabled: keyWord !== "",
      placeholderData: keepPreviousData,
    });

  // const resetSearch = () => {
  //   setKeyWord("");
  //   setInputValue("");
  //   setPage(1);
  // };

  useEffect(() => {
    if (isFetched && data?.notes?.length === 0 && keyWord) {
      toast.error("No notes found for your request.", {
        duration: 1500,
      });
    }
  }, [data, keyWord, isFetched]);

  return (
    <div className={css.app}>
      <Toaster position="top-center" reverseOrder={false} />
      <header className={css.toolbar}>
        {<SearchBox onChange={handleInputChange} value={inputValue} />}
        {isFetching || isLoading ? <p>Loading...</p> : null}
        {isError && <p>There was an error, please try again.</p>}
        {data && data.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}
        {/* {
          <button className={css.button} onClick={() => setIsOpenModal(true)}>
            Create note +
          </button>
        } */}
        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>
      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}
      {/* {isOpenModal && (
        <Modal onClose={() => setIsOpenModal(false)}>
          <NoteForm
            onClose={() => setIsOpenModal(false)}
            // resetSearch={resetSearch}
          />
        </Modal>
      )} */}
    </div>
  );
}
