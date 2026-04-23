import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { getPostsForWeb } from "@repo/db/posts";

export default async function Page({
  params,
}: {
  params: Promise<{ year: string; month: string }>;
}) {
  const posts = await getPostsForWeb();

  const { year, month } = await params;
  const historyPosts = posts.filter((post) => {
    const postDate = post.date;
    return (
      postDate.getFullYear().toString() === year && postDate.getMonth() + 1 === parseInt(month)
    );
  });

  if (historyPosts.length === 0) {
    return (
      <AppLayout selectedHistory={`${year}/${month}`}>
        <p>0 Posts</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout selectedHistory={`${year}/${month}`}>
      <Main posts={historyPosts} />
    </AppLayout>
  );
}
