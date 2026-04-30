import { redirect } from "next/navigation";
import { isLoggedIn } from "../../../utils/auth";
import { getPostByUrlIdForAdmin } from "@repo/db/posts";
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

  // get post data from database
  const { urlId } = await params;
  const post = await getPostByUrlIdForAdmin(urlId);

  if (!post) {
    return <>Post not found</>;
  }

  return (
    <EditPost post={post} />
  );
}