import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import styles from "@/app/page.module.css";
import { posts } from "@repo/db/data";
import { toUrlPath } from "@repo/utils/url";

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const filteredPosts = posts.filter((post) => {
    const tags = post.tags.split(",").map((t) => toUrlPath(t.trim()));

    if (tags.includes(name)) {
      return true;
    }
    return false;
  });

  return (
    <AppLayout selectedTag={name}>
      <Main posts={filteredPosts} className={styles.main} />
    </AppLayout>
  );
}
