import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { Main } from "../components/Main";
import styles from "./page.module.css";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <Main className={styles.main} />
  );
}