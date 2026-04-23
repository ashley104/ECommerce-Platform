import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import styles from "@/app/page.module.css";
import { getPostsBySearch } from "@repo/db/posts";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  const q = (await searchParams)?.q || "";
  const filteredPosts = await getPostsBySearch(q);

  return (
    <AppLayout query={q}>
      <Main posts={filteredPosts} className={styles.main} />
    </AppLayout>
  );
}
