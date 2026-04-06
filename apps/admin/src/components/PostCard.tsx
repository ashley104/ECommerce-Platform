'use client';

import type { Post } from "@repo/db/data";
import Link from "next/link";
import { useState } from "react";

export default function PostCard({ post }: { post: Post }) {
  const [showMessage, setShowMessage] = useState(false);

  function handleClick() {
    setShowMessage((prev) => !prev);
  }

  function displayTags(tag: string) {
    return tag
      .split(",")
      .map((t) => `#${t.trim()}`)
      .join(", ");
  }

  // Format date as "month dd, yyyy"
  function formatDate(date: Date) {
    const month = date.toLocaleString("en-US", { month: "short" });
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`; 
  }

  return (
    <article className="overflow-hidden hover:shadow-lg transition-shadow bg-white rounded-xl mb-4 max-w-sm">
      <img className="w-full h-48 object-cover" src={post.imageUrl} alt={post.title} />
      <div className="p-9 gap-2">
        <h3 
          className="text-lg mb-2 cursor-pointer hover:underline font-bold"
          style={{ color: "#1A5134" }}>
          <Link href={`/post/${post.urlId}`}>{post.title}</Link>
        </h3>
        <p className="text-gray-500 text-sm">{post.description}</p>
        <div className="flex mt-3 mb-2">
          <p className="text-sm">Category: </p>
          <p className="text-sm rounded bg-gray-200 ml-1 px-1">{post.category}</p>
        </div>
        <p className="text-blue-900 text-sm">{displayTags(post.tags)}</p>
        <div className="flex items-center justify-between pt-2">
          <button
          style={{
            backgroundColor: post.active
              ? "#1A5134"
              : "#ccc",
            color: "white",
          }}
          className="hover:opacity-90 rounded px-3 py-1 mt-2"
          type="button" 
          onClick={handleClick}
        >
          {post.active ? "Active" : "Inactive"}
        </button>
          <p className="text-gray-500 text-sm">Posted on {formatDate(post.date)}</p>
        </div>
        {showMessage ? 
        <p className="text-sm font-medium">
          Post "{post.title}" is currently {post.active ? "Active" : "Inactive"}
        </p> : null}
      </div>
    </article>
  );
}