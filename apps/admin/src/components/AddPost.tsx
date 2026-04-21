"use client";

import PostForm from "./PostForm";

export default function AddPost() {
  return (
    <PostForm
      initialFields={{
        title: "",
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