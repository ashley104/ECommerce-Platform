"use client";

import { useState } from "react";
import LogoutButton from "./LogoutButton";
import PostList from "./PostList";
import type { Post } from "@repo/db/data";

export default function AdminHome({ initialPosts }: { initialPosts: Post[] }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#F1D7DA" }}
    >
      <header 
        className="border-b"
        style={{
          backgroundColor: "#1A5134",
          borderColor: "#1A5134",
        }}>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl text-white font-semibold">Admin of Full Stack Blog</h1>
          <LogoutButton onLogoutStart={() => setIsLoggingOut(true)} />
        </div>
      </header>
      {isLoggingOut ? (
        <div className="container mx-auto px-4 py-8">
          <p className="text-base text-gray-700">Logging out...</p>
        </div>
      ) : (
        <PostList initialPosts={initialPosts} />
      )}
    </div>
  );
}