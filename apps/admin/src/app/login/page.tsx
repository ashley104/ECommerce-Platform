import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import LoginButton from '../../components/LoginButton';
import { getUserRoleFromSession } from "@repo/db/users";

export default async function Login() {
  const session = await getServerSession(authOptions);
  const userRole = await getUserRoleFromSession(session);

  if (session && userRole !== "ADMIN") {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 text-center bg-fuchsia-200">
        <h1 className='font-bold text-2xl'>You do not have permission to access this page.</h1>
      </div>
    );
  } else if (session && userRole === "ADMIN") {
    redirect("/");
  }

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 text-center bg-fuchsia-200">
      <h1 className='font-bold text-2xl'>Login to get started</h1>
      <LoginButton />
    </div>
  );
}