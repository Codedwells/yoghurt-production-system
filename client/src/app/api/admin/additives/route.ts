import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
	try {
		const session = await getServerSession(authOptions);

		if (!session || session.user.role !== 'ADMIN') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
		}

		const additives = await prisma.additive.findMany({
			orderBy: {
				name: 'asc'
			}
		});

		return NextResponse.json(additives);
	} catch (error) {
		console.error('Failed to fetch additives:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch additives' },
			{ status: 500 }
		);
	} finally {
		await prisma.$disconnect();
	}
}
