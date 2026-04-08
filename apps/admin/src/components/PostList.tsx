"use client";

import { useState } from "react";

import PostCard from "./PostCard";
import PostFilters from "./PostFilters";
import CreatePostBtn from "./CreatePostBtn";
import { posts } from "@repo/db/data";

export default function PostList() {
  const [filters, setFilters] = useState({ query: "", tags: "", date: "", visibility: "" });
  const [sort, setSort] = useState({ field: "date", order: "desc" });

  let filteredPosts = posts
    .filter((p) => {
      const searchableContent = [p.title, p.content].join(" ").toLowerCase();

      //if no query, show all posts. otherwise, only show posts that contain the query in title or content
      return !filters.query || searchableContent.includes(filters.query.toLowerCase());
    })
    .filter((p) => !filters.tags || p.tags.toLowerCase().includes(filters.tags.toLowerCase()))
    .filter((p) => {
      const input = Date.parse(filters.date);
      return !filters.date || p.date.getTime() >= input;
    })
    .filter((p) => !filters.visibility || (filters.visibility === "active" ? p.active : !p.active))
    .sort((a, b) => {
      //take the field as a key to compare objects a and b
      const field = sort.field as keyof typeof a;
      //return 1 if a should come after b, -1 if a should come before b, and 0 if they are equal
      if (sort.order === "asc") return a[field] > b[field] ? 1 : -1;
      return a[field] < b[field] ? 1 : -1;
    });
  return (
    <div className="container mx-auto px-4 py-8">
      <PostFilters filters={filters} setFilters={setFilters} sort={sort} setSort={setSort} />
      <CreatePostBtn />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.length === 0 ? (
          <p>No posts found.</p>
        ) : (
          filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}