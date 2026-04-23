import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import styles from "@/app/page.module.css";
import { getPostsByCategory } from "@repo/db/posts";

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const filteredPosts = await getPostsByCategory(name);

  if (filteredPosts.length === 0) {
    return (
      <AppLayout>
        <div>0 Posts</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Main posts={filteredPosts} className={styles.main} />
    </AppLayout>
  );
}
