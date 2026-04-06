"use client";

import { useRef, useState, useActionState } from "react";
import { savePost } from "../app/actions/postAction";
import { marked } from "marked";
import { validatePost } from "../utils/post";
import { redirect } from "next/navigation";
import PostHeader from "./PostHeader";

export default function AddPost() {
  const [serverState, formAction] = useActionState(savePost, {
    errors: {},
  });
  const [fields, setFields] = useState({
    title: "",
    description: "",
    content: "",
    tags: "",
    image: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [showErrorBanner, setShowErrorBanner] = useState(false);

  const [preview, setPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [cursor, setCursor] = useState(0);

  function handleChange(e: any) {
    const { name, value } = e.target;
    const updated = { ...fields, [name]: value };
    setFields(updated);

    setErrors(validatePost(updated)); // instant validation
  }

  function handleSubmit(e: any) {
    const errs = validatePost(fields);
    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      e.preventDefault();
      setShowErrorBanner(true);
    }
  }

  const renderedContent = marked.parse(fields.content);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F0DCF5" }}>
      <PostHeader action="Create" />
      
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-white p-6 rounded-xl shadow">
          <form action={formAction} onSubmit={handleSubmit} className="space-y-6">
            
            {/* TITLE */}
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-sm">Title</label>
              <input 
                className="bg-gray-100 rounded-xl px-2 py-2 focus:outline focus:ring-5 focus:ring-gray-200"
                name="title" value={fields.title} onChange={handleChange} 
              />
              <p className="text-red-500 text-sm">{errors.title}</p>
            </div>

            {/* DESCRIPTION */}
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-sm">Description ({fields.description.length}/200 characters)</label>
              <textarea
                name="description"
                value={fields.description}
                onChange={handleChange}
                maxLength={200}
                rows={4}
                className="bg-gray-100 rounded-xl px-2 py-2 focus:outline focus:ring-5 focus:ring-gray-200"
              />
              <p className="text-red-500 text-sm">{errors.description}</p>
            </div>

            {/* CONTENT + PREVIEW */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-sm">Content (Markdown)</label>
                <button
                  type="button"
                  style={{ borderColor: "#1A5134", color: "#1A5134" }}
                  className="border rounded-lg px-3 py-1 text-sm font-semibold"
                  onClick={() => {
                    if (preview && textareaRef.current) {
                      setTimeout(() => {
                        textareaRef.current?.focus();
                        textareaRef.current?.setSelectionRange(cursor, cursor);
                      }, 0);
                    }
                    setPreview(!preview);
                  }}
                >
                  {preview ? "Close Preview" : "Preview"}
                </button>
              </div>
                {!preview ? (
                  <textarea
                    name="content"
                    ref={textareaRef}
                    value={fields.content}
                    onChange={handleChange}
                    rows={15}
                    className="bg-gray-100 rounded-xl px-2 py-2 focus:outline focus:ring-5 focus:ring-gray-200"
                    onSelect={(e) =>
                      setCursor(e.currentTarget.selectionStart)
                    }
                  />
                ) : (
                  <div 
                    className="border p-3 rounded" 
                    data-testid="content-preview" 
                    dangerouslySetInnerHTML={{ __html: renderedContent }}
                  />
                )}

                <p className="text-red-500 text-sm">{errors.content}</p>
            </div>

            {/* IMAGE */}
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-sm">Image URL</label>
              <input
                className="bg-gray-100 rounded-xl px-2 py-2 focus:outline focus:ring-5 focus:ring-gray-200"
                name="image"
                value={fields.image}
                onChange={handleChange}
              />
              <p className="text-red-500 text-sm">{errors.image}</p>
            </div>

            {/* IMAGE PREVIEW */}
            {fields.image && (
              <img data-testid="image-preview" src={fields.image} />
            )}

            {/* TAGS */}
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-sm">Tags (separated by commas)</label>
              <input 
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
              <p className="text-green-500 text-sm">Post saved successfully!</p>
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