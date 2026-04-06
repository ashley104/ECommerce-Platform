"use client";

import { useEffect, useRef, useState, useActionState } from "react";
import { Post } from "@repo/db/data";
import { savePost } from "../app/actions/postAction";
import { marked } from "marked";
import { validatePost } from "../utils/post";
import PostHeader from "./PostHeader";
import { redirect } from "next/navigation";

export default function EditPost({ post }: { post: Post }) {
  const [serverState, formAction] = useActionState(savePost, {
    errors: {},
  });
  const [fields, setFields] = useState({
    title: post.title,
    description: post.description,
    content: post.content,
    tags: post.tags,
    image: post.imageUrl,
  });

  const [errors, setErrors] = useState<any>({});
  const [showErrorBanner, setShowErrorBanner] = useState(false);

  const [preview, setPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const cursorRef = useRef(0);
  const previousPreviewRef = useRef(preview);

  useEffect(() => {
    if (previousPreviewRef.current && !preview && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(cursorRef.current, cursorRef.current);
    }

    previousPreviewRef.current = preview;
  }, [preview]);

  function handleChange(e: any) {
    const { name, value } = e.target;
    const updated = { ...fields, [name]: value };
    setFields(updated);

    setErrors(validatePost(updated));
  }

  function handleSubmit(e: any) {
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
    <div className="min-h-screen" style={{ backgroundColor: "#FEFCCA" }}>
      <PostHeader action="Edit" />
      
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-white p-6 rounded-xl shadow">
          <form action={formAction} onSubmit={handleSubmit} className="space-y-6">
            
            {/* TITLE */}
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-sm" htmlFor="title">Title</label>
              <input 
                className="bg-gray-100 rounded-xl px-2 py-2 focus:outline focus:ring-5 focus:ring-gray-200"
                id="title"
                name="title" value={fields.title} onChange={handleChange} 
              />
              <p className="text-red-500 text-sm">{errors.title}</p>
            </div>

            {/* DESCRIPTION */}
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-sm" htmlFor="description">Description ({fields.description.length}/200 characters)</label>
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

            {/* CONTENT + PREVIEW */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-sm" htmlFor="content">Content (Markdown)</label>
                <button
                  type="button"
                  data-testid="preview-button"
                  style={{ borderColor: "#1A5134", color: "#1A5134" }}
                  className="border rounded-lg px-3 py-1 text-sm font-semibold"
                  onPointerDownCapture={() => {
                    if (!preview && textareaRef.current) {
                      cursorRef.current = textareaRef.current.selectionStart ?? 0;
                    }
                  }}
                  onClick={(e) => {
                    e.preventDefault();
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
                    ref={textareaRef}
                    value={fields.content}
                    onChange={handleChange}
                    rows={15}
                    className="bg-gray-100 rounded-xl px-2 py-2 focus:outline focus:ring-5 focus:ring-gray-200"
                    onSelect={(e) =>
                      (cursorRef.current = e.currentTarget.selectionStart)
                    }
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

            {/* IMAGE */}
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-sm" htmlFor="image">Image URL</label>
              <input
                className="bg-gray-100 rounded-xl px-2 py-2 focus:outline focus:ring-5 focus:ring-gray-200"
                id="image"
                name="image"
                value={fields.image}
                onChange={handleChange}
              />
              <p className="text-red-500 text-sm">{errors.image}</p>
            </div>

            {/* IMAGE PREVIEW */}
            {fields.image && (
              <img data-test-id="image-preview" src={fields.image} />
            )}

            {/* TAGS */}
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-sm" htmlFor="tags">Tags (separated by commas)</label>
              <input 
                id="tags"
                name="tags" 
                value={fields.tags} 
                onChange={handleChange} 
                className="bg-gray-100 rounded-xl px-2 py-2 focus:outline focus:ring-5 focus:ring-gray-200" 
              />
              <p className="text-red-500 text-sm">{errors.tags}</p>
            </div>

            {/* SAVE ERROR */}
            {showErrorBanner && (
              <p className="text-red-500 text-sm">Please fix the errors before saving</p>
            )}
            {serverState?.success && (
              <p className="text-green-500 text-sm">Post updated successfully</p>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <button 
                type="button" 
                onClick={()=>redirect("/")}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm font-semibold hover:bg-gray-100"
              > Cancel
              </button>
              <button 
                type="submit"
                style={{ backgroundColor: "#1A5134", color: "white" }}
                className="hover:opacity-90 rounded-lg px-3 py-1 text-sm font-semibold"
              > Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}