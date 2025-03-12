import { db } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	const session = await getServerSession(authOptions);

	if (!session) {
		return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
			status: 401
		});
	}

	try {
		const inventory = await db.inventoryItem.findMany({
			include: {
				additive: true,
				packaging: true
			}
		});

		return NextResponse.json(inventory);
	} catch (error) {
		return new NextResponse(
			JSON.stringify({ error: 'Error fetching inventory' }),
			{ status: 500 }
		);
	}
}

export async function POST(req: NextRequest) {
	const session = await getServerSession(authOptions);

	if (!session) {
		return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
			status: 401
		});
	}

	if (
		session.user.role !== 'ADMIN' &&
		session.user.role !== 'PRODUCTION_MANAGER'
	) {
		return new NextResponse(
			JSON.stringify({ error: 'Insufficient permissions' }),
			{ status: 403 }
		);
	}

	try {
		const body = await req.json();
		const {
			name,
			type,
			quantity,
			unit,
			location,
			supplier,
			reorderLevel,
			expiryDate
		} = body;

		const inventoryItem = await db.inventoryItem.create({
			data: {
				name,
				type,
				quantity,
				unit,
				location,
				supplier,
				reorderLevel,
				expiryDate
			}
		});

		return NextResponse.json(inventoryItem);
	} catch (error) {
		return new NextResponse(
			JSON.stringify({ error: 'Error creating inventory item' }),
			{ status: 500 }
		);
	}
}
