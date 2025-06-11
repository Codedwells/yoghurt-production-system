import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	const session = await getServerSession(authOptions);

	if (!session) {
		return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
			status: 401
		});
	}

	if (session.user.role !== 'ADMIN') {
		return new NextResponse(
			JSON.stringify({ error: 'Insufficient permissions' }),
			{ status: 403 }
		);
	}

	try {
		const users = await db.user.findMany({
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				_count: {
					select: {
						createdBatches: true,
						salesOrders: true
					}
				}
			}
		});

		return NextResponse.json(users);
	} catch (error) {
		return new NextResponse(JSON.stringify({ error: 'Error fetching users' }), {
			status: 500
		});
	}
}

export async function POST(req: NextRequest) {
	const session = await getServerSession(authOptions);

	if (!session) {
		return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
			status: 401
		});
	}

	if (session.user.role !== 'ADMIN') {
		return new NextResponse(
			JSON.stringify({ error: 'Insufficient permissions' }),
			{ status: 403 }
		);
	}

	try {
		const body = await req.json();
		const { name, email, password, role } = body;

		const existingUser = await db.user.findUnique({
			where: { email }
		});

		if (existingUser) {
			return new NextResponse(
				JSON.stringify({ error: 'User with this email already exists' }),
				{ status: 400 }
			);
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await db.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
				role
			},
			select: {
				id: true,
				name: true,
				email: true,
				role: true
			}
		});

		return NextResponse.json(user);
	} catch (error) {
		return new NextResponse(JSON.stringify({ error: 'Error creating user' }), {
			status: 500
		});
	}
}
