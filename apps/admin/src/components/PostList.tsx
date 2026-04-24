"use client";

import { useState } from "react";
import type { Post } from "@repo/db/data";

import PostCard from "./PostCard";
import PostFilters from "./PostFilters";
import CreatePostBtn from "./CreatePostBtn";

export default function PostList({ initialPosts }: { initialPosts: Post[] }) {
  const [posts, setPosts] = useState(initialPosts);
  const [filters, setFilters] = useState({ query: "", tags: "", date: "", visibility: "" });
  const [sort, setSort] = useState({ field: "date", order: "desc" });

  async function handleToggleActive(postId: number, active: boolean) {
    const response = await fetch(`/api/posts/${postId}/active`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ active }),
    });

    if (!response.ok) {
      return;
    }

    const data = (await response.json()) as { id?: number; active?: boolean };
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              active: typeof data.active === "boolean" ? data.active : active,
            }
          : post,
      ),
    );
  }

  let filteredPosts = posts
    .filter((p) => {
      const searchableContent = [p.title, p.content].join(" ").toLowerCase();

      //if no query, show all posts. otherwise, only show posts that contain the query in title or content
      return !filters.query || searchableContent.includes(filters.query.toLowerCase());
    })
    .filter((p) => !filters.tags || p.tags.toLowerCase().includes(filters.tags.toLowerCase()))
    .filter((p) => {
      const input = Date.parse(filters.date);
      return !filters.date || new Date(p.date).getTime() >= input;
    })
    .filter((p) => !filters.visibility || (filters.visibility === "active" ? p.active : !p.active))
    .sort((a, b) => {
      if (sort.field === "date") {
        const aDate = new Date(a.date).getTime();
        const bDate = new Date(b.date).getTime();
        return sort.order === "asc" ? aDate - bDate : bDate - aDate;
      }

      const compareResult = a.title.localeCompare(b.title);
      return sort.order === "asc" ? compareResult : -compareResult;
    });
  return (
    <div className="container mx-auto px-4 py-8">
      <PostFilters filters={filters} setFilters={setFilters} sort={sort} setSort={setSort} />
      <CreatePostBtn />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.length === 0 ? (
          <p>No posts found.</p>
        ) : (
          filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onToggleActive={handleToggleActive}
            />
          ))
        )}
      </div>
    </div>
  );
}