import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Dashboard',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const expected = process.env.DASHBOARD_PASSWORD;
        if (!expected) return null;
        if (!credentials?.username || !credentials?.password) return null;
        if (credentials.username !== 'padie') return null;
        if (credentials.password !== expected) return null;
        return {
          id: 'padie',
          name: 'Padie',
          dashboardToken: credentials.password,
        };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/dashboard/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user && 'dashboardToken' in user) {
        token.dashboardToken = (user as { dashboardToken?: string }).dashboardToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.dashboardToken) {
        session.dashboardToken = token.dashboardToken;
      }
      return session;
    },
  },
};
