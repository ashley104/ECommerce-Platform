import { client } from "./client.js";

type SessionUserLike = {
  id?: string | null;
  email?: string | null;
} | null | undefined;

type SessionLike = {
  user?: SessionUserLike;
} | null | undefined;

export async function getUserRoleFromSession(session: SessionLike) {
  const userId = session?.user?.id;

  if (userId) {
    const user = await client.db.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    return user?.role ?? null;
  }

  const email = session?.user?.email;

  if (email) {
    const user = await client.db.user.findUnique({
      where: { email },
      select: { role: true },
    });

    return user?.role ?? null;
  }

  return null;
}