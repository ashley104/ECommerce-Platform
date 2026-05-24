import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import LoginButton from '../../components/LoginButton';

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/");
  }

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 text-center bg-fuchsia-200">
      <h1 className='font-bold text-2xl'>Login to get started</h1>
      <LoginButton />
    </div>
  );
}