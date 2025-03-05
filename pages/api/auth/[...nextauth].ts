import { IncomingMessage } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCsrfToken } from "next-auth/react";
import { SiweMessage } from "siwe";
import { ethers } from "ethers";

interface AuthCredentials {
  message: string;
  signature: string;
}

export function getAuthOptions(req: IncomingMessage): NextAuthOptions {
  const providers = [
    CredentialsProvider({
      async authorize(credentials) {
        try {
          const siwe = new SiweMessage(
            JSON.parse(credentials?.message || "{}")
          );
          let message = siwe.prepareMessage();

          const nextAuthUrl =
            process.env.NEXTAUTH_URL ||
            (process.env.VERCEL_URL
              ? `https://${process.env.VERCEL_URL}`
              : null);
          if (!nextAuthUrl) {
            console.error("NEXTAUTH_URL is not set");
            return null;
          }

          const nextAuthHost = new URL(nextAuthUrl).host;
          if (siwe.domain !== nextAuthHost) {
            console.error(`Invalid domain: ${siwe.domain} !== ${nextAuthHost}`);
            return null;
          }

          const csrfToken = await getCsrfToken({
            req: { headers: req.headers },
          });
          if (siwe.nonce !== csrfToken) {
            console.error(`Invalid nonce: ${siwe.nonce} !== ${csrfToken}`);
            return null;
          }

          // 使用 ethers.js 验证签名
          const messageHash = ethers.utils.hashMessage(message);
          const addressFromSignature = ethers.utils.recoverAddress(
            messageHash,
            credentials?.signature || ""
          );

          if (
            addressFromSignature.toLowerCase() !== siwe.address.toLowerCase()
          ) {
            console.error(
              `Signature verification failed: ${addressFromSignature} !== ${siwe.address}`
            );
            return null;
          }

          return {
            id: siwe.address,
            message: message,
            signature: credentials?.signature,
          };
        } catch (e) {
          console.error("Error during authorization:", e);
          return null;
        }
      },
      credentials: {
        message: { label: "Message", placeholder: "0x0", type: "text" },
        signature: { label: "Signature", placeholder: "0x0", type: "text" },
      },
      name: "Ethereum",
    }),
  ];

  return {
    callbacks: {
      async session({ session, token }) {
        // session.user.address = token.sub as string;
        session.address = token.sub;
        session.user = {
          address: token.sub as string,
          message: token.message,
          signature: token.signature,
        };

        return session;
      },
      async jwt({ token, user }) {
        if (user) {
          token.sub = user.id;

          // 将签名和信息存储到 token 中
          token.message = (user as any).message;
          token.signature = (user as any).signature;
        }

        return token;
      },
      async redirect({ url, baseUrl }) {
        if (url.startsWith(baseUrl)) return url;
        return baseUrl;
      },
    },
    // cookies: {
    //   sessionToken: {
    //     name: `sessionid`,
    //     options: {
    //       httpOnly: true,
    //       sameSite: "lax",
    //       path: "/",
    //       secure: process.env.NODE_ENV === "production",
    //     },
    //   },
    //   csrfToken: {
    //     name: `csrftoken`,
    //     options: {
    //       httpOnly: false,
    //       sameSite: "lax",
    //       path: "/",
    //       secure: process.env.NODE_ENV === "production",
    //     },
    //   },
    // },
    providers,
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: "jwt" },
  };
}

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  const authOptions = getAuthOptions(req);

  if (!Array.isArray(req.query.nextauth)) {
    res.status(400).send("Bad request");
    return;
  }

  const isDefaultSigninPage =
    req.method === "GET" &&
    req.query.nextauth.find((value) => value === "signin");

  if (isDefaultSigninPage) {
    authOptions.providers.pop();
  }

  return await NextAuth(req, res, authOptions);
}
