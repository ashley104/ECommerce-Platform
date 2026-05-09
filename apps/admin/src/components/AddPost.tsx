"use client";

import PostForm from "./PostForm";

export default function AddPost() {
  return (
    <PostForm
      initialFields={{
        title: "",
        category: "",
        description: "",
        content: "",
        tags: "",
        image: "",
      }}
      headerAction="Create"
      backgroundColor="#F0DCF5"
    />
  );
}