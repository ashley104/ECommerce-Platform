import { isLoggedIn } from "../utils/auth";
import SignIn from "../components/SignIn";

export default async function Home() {
  // use the is logged in function to check if user is authorised
  // we will use the cookie based approach
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    return <SignIn />;
  }

  return <h1>Hello</h1>;
}