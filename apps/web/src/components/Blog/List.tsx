import type { Post } from "@repo/db/data";
import { BlogListItem } from "./ListItem";

export function BlogList({ posts }: { posts: Post[] }) {
  const activePosts = posts.filter((post) => {
    return post.active;
  })

  return (
    <div className="px-12 py-15">
      <div className="pb-15">
        <h1 className="font-bold text-5xl text-gray-900 pb-5">From the blog</h1>
        <p className="text-gray-600 text-lg">Learn how to grow your business with our expert advice.</p>
        <p className="text-gray-600 text-lg pt-3">{activePosts.length} Posts</p>
      </div>
      <div>
        {activePosts.map((activePost) => (
          <BlogListItem key={activePost.id} post={activePost} />
        ))}
      </div>
    </div>
  );
}

export default BlogList;
