import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "@/lib/mongoDB";
import { MongoDBAdapter } from "@auth/mongodb-adapter";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("signing in user", user);
      // Ensure email is verified for Google users
      if (account.provider === "google" && !profile.email_verified) {
        console.log("Email not verified");
        return false; // Deny sign-in if email is not verified
      }
      return true; // Allow sign-in
    },
    async session({ session, token, user }) {
      session.user.id = token.sub; // Add user ID to session
      return session;
    },
    async jwt({ token, user }) {
      if (user) token.sub = user.id; // Attach user ID to JWT token
      return token;
    },
  },

  secret: process.env.NEXTAUTH_SECRET, // Ensure this is set
};

export default NextAuth(authOptions);
