import { redirect } from "next/navigation";
import { isLoggedIn } from "../../../utils/auth";
import AddPost from "../../../components/AddPost";

export default async function CreatePost() {
  //authorisation
  const loggedIn = await isLoggedIn();
  if (!loggedIn) {
    redirect("/");
  }

  return (
    <AddPost />
  );
}