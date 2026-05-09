import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { getPostsByHistory } from "@repo/db/posts";

export default async function Page({
  params,
}: {
  params: Promise<{ year: string; month: string }>;
}) {
  const { year, month } = await params;
  const historyPosts = await getPostsByHistory(
    Number(year),
    Number(month),
  );

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
