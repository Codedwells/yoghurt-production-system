// Description : Middleware to authenticate some routes

import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequestWithAuth } from 'next-auth/middleware';

export async function middleware(req: NextRequestWithAuth) {
	const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
	const isAuth = !!token;
	const isAuthPage = req.nextUrl.pathname.startsWith('/login');
	const isAdmin = token?.role === 'ADMIN';
	const isProductionManager = token?.role === 'PRODUCTION_MANAGER';

	if (isAuthPage) {
		if (isAuth) {
			return NextResponse.redirect(new URL('/dashboard', req.url));
		}
		return NextResponse.next();
	}

	if (!isAuth) {
		return NextResponse.redirect(new URL('/login', req.url));
	}

	if (req.nextUrl.pathname.startsWith('/admin') && !isAdmin) {
		return NextResponse.redirect(new URL('/dashboard', req.url));
	}

	if (
		req.nextUrl.pathname.startsWith('/production') &&
		!isProductionManager &&
		!isAdmin
	) {
		return NextResponse.redirect(new URL('/dashboard', req.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		'/dashboard/:path*',
		'/admin/:path*',
		'/production/:path*',
		'/login'
	]
};
