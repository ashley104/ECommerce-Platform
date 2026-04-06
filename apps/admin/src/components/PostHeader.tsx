import { redirect } from "next/navigation";

export default function PostHeader({ action }: { action: string }) {
  return (
    <div className="border-b" style={{ backgroundColor: "#1A5134", borderColor: "#1A5134" }}>
      <div className="container mx-auto px-4 py-4 font-semibold">
        <button
          onClick={() => redirect("/")}
          className="text-sm text-white hover:bg-white/10 mb-2 px-2 py-1 rounded hover:text-black"
        >
          Back to Posts
        </button>
        <h1 className="text-2xl text-white">
          {action === "Create" ? "Create Post" : "Edit Post"}
        </h1>
      </div>
    </div>
  )
}