import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { client } from "@repo/db/client";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(client.db),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  session: {
    strategy: "jwt",
    updateAge: 30 * 60, // 30 minutes
    maxAge: 7 * 24 * 60 * 60, // 7 days
  }
};
