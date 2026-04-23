import { AppLayout } from "@/components/Layout/AppLayout";
import { LikeButton } from "@/components/Blog/LikeButton";
import {
  getPostForWebByUrlId,
  incrementPostViewsById,
} from "@repo/db/posts";
import { marked } from "marked";
import Link from "next/link";

export default async function Page({
  params,
}: {
  params: Promise<{ urlId: string }>;
}) {
  const { urlId } = await params;
  const post = await getPostForWebByUrlId(urlId);

  if (!post) {
    return <>0 Posts</>;
  }

  await incrementPostViewsById(post.id);

  const renderedContent = marked.parse(post.content);
  // Format date as "DD MMM YYYY"
  const formattedDate = post.date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const formattedTags = `#${post.tags.split(",").join(" #")}`;

  return (
    <AppLayout>
      <article className="pt-8 pl-15 pr-39 pb-15" data-test-id={`blog-post-${post.id}`}>
        <div className="flex gap-15 text-sm text-gray-500">
          <p>{formattedDate}</p>
          <p className="font-semibold">{post.category}</p>
        </div>
        <Link href={`/post/${post.urlId}`} className="text-xl font-bold text-gray-900 py-3 block">
          {post.title}
        </Link>
        <div className="w-full h-[450px] pb-3">
          <img src={post.imageUrl} alt={post.title} className="rounded-lg w-full h-full object-cover"/>
        </div>
        <p className="text-gray-500 pb-3">{formattedTags}</p>
        <div
          className="text-gray-500 pb-3"
          data-test-id="content-markdown"
          dangerouslySetInnerHTML={{ __html: renderedContent }}
        />
        <hr className="border-gray-300 pb-3" />
        <div className="flex gap-x-180 items-center">
          <p className="text-gray-500">{post.views + 1} views</p>
          <LikeButton postId={post.id} initialLikes={post.likes} />
        </div>
      </article>
    </AppLayout>
  );
}