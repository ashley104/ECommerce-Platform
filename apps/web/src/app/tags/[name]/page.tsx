import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import styles from "@/app/page.module.css";
import { getPostsByTag } from "@repo/db/posts";

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const filteredPosts = await getPostsByTag(name);

  return (
    <AppLayout selectedTag={name}>
      <Main posts={filteredPosts} className={styles.main} />
    </AppLayout>
  );
}
