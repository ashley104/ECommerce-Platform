import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import styles from "@/app/page.module.css";
import { getPostsForWeb } from "@repo/db/posts";
import { toUrlPath } from "@repo/utils/url";

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const posts = await getPostsForWeb();

  //take category name from url params
  const { name } = await params;
  const filteredPosts = posts.filter((post) => {
    const category = toUrlPath(post.category);
    return category === name;
  });

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
