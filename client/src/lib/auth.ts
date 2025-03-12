import { db } from './db';
import bcrypt from 'bcryptjs';
import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(db),
	secret: process.env.NEXTAUTH_SECRET,
	session: {
		strategy: 'jwt'
	},
	pages: {
		signIn: '/login'
	},
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: {
					label: 'Email',
					type: 'email',
					placeholder: 'email@example.com'
				},
				password: { label: 'Password', type: 'password' }
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					return null;
				}

				const user = await db.user.findUnique({
					where: { email: credentials.email }
				});

				if (!user) {
					return null;
				}

				const passwordMatch = await bcrypt.compare(
					credentials.password,
					user.password
				);

				if (!passwordMatch) {
					return null;
				}

				return {
					id: user.id,
					email: user.email,
					name: user.name,
					role: user.role
				};
			}
		})
	],
	callbacks: {
		async session({ token, session }) {
			if (token) {
				session.user.id = token.id;
				session.user.name = token.name;
				session.user.email = token.email;
				session.user.role = token.role;
			}
			return session;
		},
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.name = user.name;
				token.email = user.email;
				token.role = user.role;
			}
			return token;
		}
	}
};
