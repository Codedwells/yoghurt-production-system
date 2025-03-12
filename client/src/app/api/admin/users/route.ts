import bcrypt from 'bcryptjs';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
	try {
		const session = await getServerSession(authOptions);

		if (!session || session.user.role !== 'ADMIN') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
		}

		const users = await prisma.user.findMany({
			select: {
				id: true,
				email: true,
				name: true,
				role: true
			}
		});

		return NextResponse.json(users);
	} catch (error) {
		console.error('Failed to fetch users:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch users' },
			{ status: 500 }
		);
	} finally {
		await prisma.$disconnect();
	}
}

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);

		if (!session || session.user.role !== 'ADMIN') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
		}

		const { email, name, password, role } = await request.json();

		if (!email || !password) {
			return NextResponse.json(
				{ error: 'Email and password are required' },
				{ status: 400 }
			);
		}

		// Check if user with this email already exists
		const existingUser = await prisma.user.findUnique({
			where: { email }
		});

		if (existingUser) {
			return NextResponse.json(
				{ error: 'User with this email already exists' },
				{ status: 409 }
			);
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create the new user
		const newUser = await prisma.user.create({
			data: {
				email,
				name: name || '',
				password: hashedPassword,
				role
			}
		});

		// Remove password from response
		const { password: _, ...userWithoutPassword } = newUser;

		return NextResponse.json(userWithoutPassword, { status: 201 });
	} catch (error) {
		console.error('Failed to create user:', error);
		return NextResponse.json(
			{ error: 'Failed to create user' },
			{ status: 500 }
		);
	} finally {
		await prisma.$disconnect();
	}
}
