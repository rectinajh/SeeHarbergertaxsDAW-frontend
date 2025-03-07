import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    /** The user's public Ethereum address. */
    address?: string;
    user: {
      address: string;
      message?: string;
      signature?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    address: string;
    message?: string;
    signature?: string;
  }
}
