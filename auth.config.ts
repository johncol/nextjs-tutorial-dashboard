import type { Session } from '@auth/core/types';
import type { NextAuthConfig } from 'next-auth';
import { NextRequest } from 'next/server';

export const authConfig = {
  pages: {
    signIn: '/login',
  },

  providers: [],

  callbacks: {
    authorized: (params: { request: NextRequest; auth: Session | null }) => {
      const { nextUrl } = params.request;
      const isLoggedIn = !!params.auth?.user;

      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) {
          return true;
        }
        return false;
      }

      if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
