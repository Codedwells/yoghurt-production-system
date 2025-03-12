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

		// Fetch counts for dashboard stats
		const [
			usersCount,
			recipesCount,
			batchesCount,
			inventoryCount,
			ordersCount
		] = await Promise.all([
			prisma.user.count(),
			prisma.recipe.count(),
			prisma.batch.count(),
			prisma.inventoryItem.count(),
			prisma.salesOrder.count()
		]);

		return NextResponse.json({
			users: usersCount,
			recipes: recipesCount,
			batches: batchesCount,
			inventory: inventoryCount,
			orders: ordersCount
		});
	} catch (error) {
		console.error('Failed to fetch dashboard stats:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch dashboard stats' },
			{ status: 500 }
		);
	} finally {
		await prisma.$disconnect();
	}
}
