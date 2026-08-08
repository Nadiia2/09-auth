"use client";

import css from "./NoteForm.module.css";
// import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import { useId } from "react";
// import * as Yup from "yup";
import { createNote } from "../../lib/api";
import type { NoteTag } from "../../types/note";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNoteStore } from "../../lib/store/noteStore";
import { useRouter } from "next/navigation";

// interface FormValues {
//   title: string;
//   content: string;
//   tag: NoteTag;
// }

// const initialValues: FormValues = {
//   title: "",
//   content: "",
//   tag: "Todo",
// };

interface NoteFormProps {
  onClose: () => void;
  // resetSearch: () => void;
}

// const OrderFormSchema = Yup.object().shape({
//   title: Yup.string()
//     .min(3, "Title must be at least 3 characters")
//     .max(50, "Title is too long")
//     .required("Title is required"),
//   content: Yup.string().max(500, "Content is too long"),
//   tag: Yup.mixed<NoteTag>()
//     .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
//     .required("Tag is required"),
// });

export default function NoteForm({ onClose }: NoteFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const fieldId = useId();

  const draft = useNoteStore((state) => state.draft);
  const setDraft = useNoteStore((state) => state.setDraft);
  const clearDraft = useNoteStore((state) => state.clearDraft);

  const mutation = useMutation({
    mutationFn: createNote,

    onSuccess: () => {
      clearDraft();

      queryClient.invalidateQueries({
        queryKey: ["notes"],
      });

      toast.success("Note created successfully!");

      router.push("/notes/filter/all");
    },

    onError: (error) => {
      console.error(error);

      toast.error("Failed to create note");
    },
  });

  const handleSubmit = async (
    formData: FormData,
    // values: FormValues,
    // actions: FormikHelpers<FormValues>,
  ) => {
    const values = {
      title: String(formData.get("title")),
      content: String(formData.get("content")),
      tag: String(formData.get("tag")) as NoteTag,
    };
    await mutation.mutateAsync(values);

    // actions.resetForm();
  };

  //   const handleSubmit = async (
  //     values: FormValues,
  //     actions: FormikHelpers<FormValues>,
  //   ) => {
  //     try {
  //       await createNote(values);

  //       actions.resetForm();

  //       resetSearch();
  //       queryClient.invalidateQueries({ queryKey: ["notes"] });
  //       toast.success("Note created successfully!");

  //       onClose();
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  return (
    <form className={css.form} action={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-title`}>Title</label>

        <input
          id={`${fieldId}-title`}
          name="title"
          type="text"
          className={css.input}
          defaultValue={draft.title}
          onChange={(event) =>
            setDraft({
              title: event.target.value,
            })
          }
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-content`}>Content</label>

        <textarea
          id={`${fieldId}-content`}
          name="content"
          rows={8}
          className={css.textarea}
          defaultValue={draft.content}
          onChange={(event) =>
            setDraft({
              content: event.target.value,
            })
          }
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-tag`}>Tag</label>

        <select
          id={`${fieldId}-tag`}
          name="tag"
          className={css.select}
          defaultValue={draft.tag}
          onChange={(event) =>
            setDraft({
              tag: event.target.value as NoteTag,
            })
          }
        >
          <option value="Todo">Todo</option>

          <option value="Work">Work</option>

          <option value="Personal">Personal</option>

          <option value="Meeting">Meeting</option>

          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button type="button" className={css.cancelButton} onClick={onClose}>
          Cancel
        </button>

        <button
          type="submit"
          className={css.submitButton}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Creating..." : "Create note"}
        </button>
      </div>
    </form>
    // <Formik
    //   initialValues={initialValues}
    //   validationSchema={OrderFormSchema}
    //   onSubmit={handleSubmit}
    // >
    //   <Form className={css.form}>
    //     <div className={css.formGroup}>
    //       <label htmlFor={`${fieldId}-title`}>Title</label>
    //       <Field
    //         id={`${fieldId}-title`}
    //         type="text"
    //         name="title"
    //         className={css.input}
    //       />
    //       <ErrorMessage name="title" component="span" className={css.error} />
    //     </div>

    //     <div className={css.formGroup}>
    //       <label htmlFor={`${fieldId}-content`}>Content</label>
    //       <Field
    //         as="textarea"
    //         id={`${fieldId}-content`}
    //         name="content"
    //         rows={8}
    //         className={css.textarea}
    //       />
    //       <ErrorMessage name="content" component="span" className={css.error} />
    //     </div>

    //     <div className={css.formGroup}>
    //       <label htmlFor={`${fieldId}-tag`}>Tag</label>
    //       <Field
    //         as="select"
    //         id={`${fieldId}-tag`}
    //         name="tag"
    //         className={css.select}
    //       >
    //         <option value="Todo">Todo</option>
    //         <option value="Work">Work</option>
    //         <option value="Personal">Personal</option>
    //         <option value="Meeting">Meeting</option>
    //         <option value="Shopping">Shopping</option>
    //       </Field>
    //       <ErrorMessage name="tag" component="span" className={css.error} />
    //     </div>

    //     <div className={css.actions}>
    //       <button
    //         type="button"
    //         onClick={() => onClose()}
    //         className={css.cancelButton}
    //       >
    //         Cancel
    //       </button>
    //       <button
    //         type="submit"
    //         className={css.submitButton}
    //         disabled={mutation.isPending}
    //       >
    //         {mutation.isPending ? "Creating..." : "Create note"}
    //       </button>
    //     </div>
    //   </Form>
    // </Formik>
  );
}
