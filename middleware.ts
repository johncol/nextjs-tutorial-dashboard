import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export default NextAuth(authConfig).auth;

export const config = {
  /**
    This regular expression will match any path or filename that does not contain the strings "api", "_next/static", "_next/image", or end with ".png". Here are examples for each case:

    Paths that do not contain "api":

    Match: "/home/user/documents"
    No Match: "/home/user/api/documents"
    Paths that do not contain "_next/static":

    Match: "/home/user/images"
    No Match: "/home/user/_next/static/images"
    Paths that do not contain "_next/image":

    Match: "/home/user/photos"
    No Match: "/home/user/_next/image/photos"
    Paths that do not end with ".png":

    Match: "/home/user/image.jpg"
    No Match: "/home/user/image.png"
   */
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
