import type { Post } from "@repo/db/data";
import Link from "next/link";

export function BlogListItem({ post }: { post: Post }) {
  return (
    <article
      key={post.id}
      className="flex flex-row gap-8 mb-15"
      data-test-id={`blog-post-${post.id}`}
    >
      <div className="w-[590px] h-[300px]">
        <img src={post.imageUrl} alt={post.title} className="rounded-lg w-full h-full object-cover"/>
      </div>
      <div>
        <div className="flex gap-15 text-sm text-gray-500">
          <p>{post.date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}</p>
          <p className="font-semibold">{post.category}</p>
        </div>
        <div>
          <Link href={`/post/${post.urlId}`} className="text-xl font-bold text-gray-900 py-3 block">
            {post.title.replace(/!+$/, "")}
          </Link>
          <p className="text-gray-500 pb-3">{post.description}</p>
          <p className="text-gray-500 pb-3">#{post.tags.split(",").join(" #")}</p>
          <hr className="border-gray-300 pb-3" />
          <div className="flex gap-x-50">
            <p className="text-gray-500">{post.views} views</p>
            <p className="text-gray-500">{post.likes} likes</p>
          </div>
        </div>
      </div>
    </article>
  );
}
