import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import styles from "@/app/page.module.css";
import { getPostsForWeb } from "@repo/db/posts";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  const posts = await getPostsForWeb();

  const q = (await searchParams)?.q || "";
  const query = q.trim().toLowerCase();

  const filteredPosts = posts.filter((post) => {
    const searchableText = [
      post.title,
      post.description,
      post.content,
      post.category,
      post.tags,
    ]
    .join(" ")
    .toLowerCase();
    return searchableText.includes(query);
  });

  return (
    <AppLayout query={q}>
      <Main posts={filteredPosts} className={styles.main} />
    </AppLayout>
  );
}
