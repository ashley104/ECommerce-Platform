"use client";

import { useState } from "react";

export function LikeButton({
  postId,
  initialLikes,
}: {
  postId: number;
  initialLikes: number;
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function handleClick() {
    setIsPending(true);

    try {
      const response = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, //specify JSON body  
        body: JSON.stringify({ postId }), //send postId in request body as JSON
      });

      if (!response.ok) throw new Error("Failed to update likes");

      //expect response to contain updated likes count and whether the post is now liked by the user
      const data: { likes?: number; liked?: boolean } = await response.json();

      if (typeof data.likes === "number") {
        setLikes(data.likes);
      }

      if (typeof data.liked === "boolean") {
        setIsLiked(data.liked);
      }
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="flex items-center gap-3 text-gray-500">
      <p>{likes} likes</p>
      <button
        type="button"
        data-test-id="like-button"
        onClick={handleClick}
        disabled={isPending}
        className="rounded-full border border-gray-300 px-4 py-1 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLiked ? "Unlike" : "Like"}
      </button>
    </div>
  );
}