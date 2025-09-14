declare module "next-auth" {
  interface Session {
    user?: {
      id: string;
      username: string;
      email: string;
      role: string;
    } & {
      name?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    username: string;
    email: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    username: string;
  }
}
