import NextAuth from 'next-auth';

declare module 'next-auth' {
	interface User {
		id: string;
		name?: string | null;
		email: string;
		role: string;
	}

	interface Session {
		user: User;
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		id: string;
		name?: string | null;
		email: string;
		role: string;
	}
}
