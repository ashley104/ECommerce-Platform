import { isLoggedIn } from "../utils/auth";
import SignIn from "../components/SignIn";
import AdminHome from "../components/AdminHome";
import { getPostsForAdmin } from "@repo/db/posts";

export default async function Home() {
  // use the is logged in function to check if user is authorised
  // we will use the cookie based approach
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    return <SignIn />;
  }

  const posts = await getPostsForAdmin();

  return <AdminHome initialPosts={posts} />;
}