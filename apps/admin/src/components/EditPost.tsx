"use client";

import { Post } from "@repo/db/data";
import PostForm from "./PostForm";

export default function EditPost({ post }: { post: Post }) {
  return (
    <PostForm
      postId={post.id}
      initialFields={{
        title: post.title,
        category: post.category,
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