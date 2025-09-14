import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          const { db } = await connectToDatabase();
          const user = await db.collection("users").findOne({
            username: credentials.username
          });

          if (!user) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            role: user.role || "user"
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt" as const
  },
  pages: {
    signIn: "/auth/signin"
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.role = user.role;
        token.username = user.username;
      }
      return token;
    },
    async session(params: { session: Session; token: JWT }) {
      const { session, token } = params;
      if (token) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tokenAny = token as any;
        session.user = {
          id: tokenAny.sub || "",
          role: tokenAny.role || "",
          username: tokenAny.username || "",
          email: tokenAny.email || "",
        };
      }
      return session;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // Handle redirects after sign in
      if (url.startsWith(baseUrl)) {
        return url;
      }
      // Allows relative callback URLs
      else if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      return baseUrl;
    }
  }
};
