"use client";

import { Post } from "@repo/db/data";
import PostForm from "./PostForm";

export default function EditPost({ post }: { post: Post }) {
  return (
    <PostForm
      initialFields={{
        title: post.title,
        description: post.description,
        content: post.content,
        tags: post.tags,
        image: post.imageUrl,
      }}
      headerAction="Edit"
      backgroundColor="#FEFCCA"
    />
  );
}