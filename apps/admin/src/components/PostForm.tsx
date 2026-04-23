"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { marked } from "marked";
import { redirect } from "next/navigation";

import { savePost } from "../app/actions/postAction";
import { validatePost } from "../utils/post";
import PostHeader from "./PostHeader";

type PostFormFields = {
  title: string;
  description: string;
  content: string;
  tags: string;
  image: string;
};

type PostFormProps = {
  initialFields: PostFormFields;
  headerAction: "Create" | "Edit";
  backgroundColor: string;
};

export default function PostForm({
  initialFields,
  headerAction,
  backgroundColor,
}: PostFormProps) {
  //useActionState: custom hook manages state of an action
  //It takes an action function and an initial state
  const [serverState, formAction] = useActionState(savePost, {
    errors: {},
  });
  const [fields, setFields] = useState<PostFormFields>(initialFields);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showErrorBanner, setShowErrorBanner] = useState(false);

  const [preview, setPreview] = useState(false);
  //persist values across renders without causing re-renders when the value changes (cursor position)
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  //restore cursor position
  const cursorRef = useRef(0);
  //keep track of previous preview state to restore cursor position when closing preview
  const previousPreviewRef = useRef(preview);

  //restore cursor position when closing preview
  useEffect(() => {
    //if we were previously in preview mode and now we're not, restore cursor position
    if (previousPreviewRef.current && !preview && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(cursorRef.current, cursorRef.current);
    }

    //update previous preview state
    previousPreviewRef.current = preview;
  }, [preview]); //run this effect whenever preview state changes

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    const updated = { ...fields, [name]: value };
    setFields(updated);

    setErrors(validatePost(updated));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const errs = validatePost(fields);
    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      e.preventDefault();
      setShowErrorBanner(true);
    } else {
      setShowErrorBanner(false);
    }
  }

  const renderedContent = marked.parse(fields.content);

  return (
    <div className="min-h-screen" style={{ backgroundColor }}>
      <PostHeader action={headerAction} />

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-white p-6 rounded-xl shadow">
          <form action={formAction} onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-sm" htmlFor="title">
                Title
              </label>
              <input
                className="bg-gray-100 rounded-xl px-2 py-2 focus:outline focus:ring-5 focus:ring-gray-200"
                id="title"
                name="title"
                value={fields.title}
                onChange={handleChange}
              />
              <p className="text-red-500 text-sm">{errors.title}</p>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-sm" htmlFor="description">
                Description ({fields.description.length}/200 characters)
              </label>
              <textarea
                id="description"
                name="description"
                value={fields.description}
                onChange={handleChange}
                rows={4}
                className="bg-gray-100 rounded-xl px-2 py-2 focus:outline focus:ring-5 focus:ring-gray-200"
              />
              <p className="text-red-500 text-sm">{errors.description}</p>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-sm" htmlFor="content">
                  Content (Markdown)
                </label>
                <button
                  type="button"
                  data-testid="preview-button"
                  style={{ borderColor: "#1A5134", color: "#1A5134" }}
                  className="border rounded-lg px-3 py-1 text-sm font-semibold"
                  //capture cursor position before textarea loses focus when clicking preview button
                  onPointerDownCapture={() => {
                    if (!preview && textareaRef.current) {
                      cursorRef.current = textareaRef.current.selectionStart || 0;
                    }
                  }}
                  onClick={() => {
                    setPreview(!preview);
                  }}
                >
                  {preview ? "Close Preview" : "Preview"}
                </button>
              </div>
              {!preview ? (
                <textarea
                  id="content"
                  name="content"
                  ref={textareaRef} //attach ref to textarea to manage focus and cursor position
                  value={fields.content}
                  onChange={handleChange}
                  rows={15}
                  className="bg-gray-100 rounded-xl px-2 py-2 focus:outline focus:ring-5 focus:ring-gray-200"
                  onSelect={(e) => {
                    //update cursor position in ref whenever user moves cursor in textarea
                    cursorRef.current = e.currentTarget.selectionStart;
                  }}
                />
              ) : (
                <div
                  className="border p-3 rounded"
                  data-test-id="content-preview"
                  dangerouslySetInnerHTML={{ __html: renderedContent }}
                />
              )}

              <p className="text-red-500 text-sm">{errors.content}</p>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-sm" htmlFor="image">
                Image URL
              </label>
              <input
                className="bg-gray-100 rounded-xl px-2 py-2 focus:outline focus:ring-5 focus:ring-gray-200"
                id="image"
                name="image"
                value={fields.image}
                onChange={handleChange}
              />
              <p className="text-red-500 text-sm">{errors.image}</p>
            </div>

            {fields.image && <img data-test-id="image-preview" src={fields.image} />}

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-sm" htmlFor="tags">
                Tags (separated by commas)
              </label>
              <input
                id="tags"
                name="tags"
                value={fields.tags}
                onChange={handleChange}
                className="bg-gray-100 rounded-xl px-2 py-2 focus:outline focus:ring-5 focus:ring-gray-200"
              />
              <p className="text-red-500 text-sm">{errors.tags}</p>
            </div>

            {showErrorBanner && (
              <p className="text-red-500 text-sm">Please fix the errors before saving</p>
            )}
            {serverState?.success && (
              <p className="text-green-500 text-sm">Post updated successfully</p>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => redirect("/")}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm font-semibold hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{ backgroundColor: "#1A5134", color: "white" }}
                className="hover:opacity-90 rounded-lg px-3 py-1 text-sm font-semibold"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}