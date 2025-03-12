import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
	try {
		const session = await getServerSession(authOptions);

		if (!session || session.user.role !== 'ADMIN') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Get counts for different entities
		const [userCount, batchCount, recipeCount, salesCount, settingsCount] =
			await Promise.all([
				prisma.user.count(),
				prisma.batch.count(),
				prisma.recipe.count(),
				prisma.salesOrder.count(),
				prisma.setting.count()
			]);

		return NextResponse.json({
			userCount,
			batchCount,
			recipeCount,
			salesCount,
			settingsCount
		});
	} catch (error) {
		console.error('Error fetching admin stats:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch admin statistics' },
			{ status: 500 }
		);
	} finally {
		await prisma.$disconnect();
	}
}
