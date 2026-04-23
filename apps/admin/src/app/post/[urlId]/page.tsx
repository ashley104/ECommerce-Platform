import { redirect } from "next/navigation";
import { isLoggedIn } from "../../../utils/auth";
import { posts } from "@repo/db/data";
import EditPost from "../../../components/EditPost";

export default async function UpdatePost({
  params,
}: {
  params: Promise<{ urlId: string }>;
}) {
  //authorisation
  const loggedIn = await isLoggedIn();
  if (!loggedIn) {
    redirect("/");
  }

  // get post data
  const { urlId } = await params;
  const post = posts.find((p) => p.urlId === urlId);

  if (!post) {
    return <>0 Posts</>;
  }

  return (
    <EditPost post={post} />
  );
}