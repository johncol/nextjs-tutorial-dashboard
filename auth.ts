import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { User } from './app/lib/definitions';
import { authConfig } from './auth.config';

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,

  providers: [
    Credentials({
      authorize: async (credentials) => {
        const userInput = {
          email: z.string().email(),
          password: z.string().min(6),
        };
        const parsedCredentials = z.object(userInput).safeParse(credentials);
        if (!parsedCredentials.success) {
          return null;
        }

        const { email, password } = parsedCredentials.data;
        const user = await getUser(email);
        if (!user) {
          return null;
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) {
          return null;
        }

        return user;
      },
    }),
  ],
});

async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
