import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET() {
	try {
		const session = await getServerSession(authOptions);

		if (!session || session.user.role !== 'ADMIN') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
		}

		const inventoryItems = await prisma.inventoryItem.findMany({
			include: {
				additive: true,
				packaging: true
			},
			orderBy: {
				name: 'asc'
			}
		});

		return NextResponse.json(inventoryItems);
	} catch (error) {
		console.error('Failed to fetch inventory items:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch inventory items' },
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

		const data = await request.json();
		const {
			name,
			type,
			quantity,
			unit,
			location,
			supplier,
			reorderLevel,
			expiryDate,
			additiveId,
			packagingId
		} = data;

		if (!name || !type || quantity === undefined || !unit) {
			return NextResponse.json(
				{ error: 'Missing required fields' },
				{ status: 400 }
			);
		}

		// Validate based on type
		if (type === 'additive' && !additiveId) {
			return NextResponse.json(
				{ error: 'Additive ID is required for additive type' },
				{ status: 400 }
			);
		}

		if (type === 'packaging' && !packagingId) {
			return NextResponse.json(
				{ error: 'Packaging ID is required for packaging type' },
				{ status: 400 }
			);
		}

		// Create inventory item
		const inventoryItem = await prisma.inventoryItem.create({
			data: {
				name,
				type,
				quantity: parseFloat(quantity.toString()),
				unit,
				location: location || null,
				supplier: supplier || null,
				reorderLevel: reorderLevel ? parseFloat(reorderLevel.toString()) : null,
				expiryDate: expiryDate ? new Date(expiryDate) : null,
				additiveId: type === 'additive' ? additiveId : null,
				packagingId: type === 'packaging' ? packagingId : null
			},
			include: {
				additive: true,
				packaging: true
			}
		});

		return NextResponse.json(inventoryItem, { status: 201 });
	} catch (error) {
		console.error('Failed to create inventory item:', error);
		return NextResponse.json(
			{ error: 'Failed to create inventory item' },
			{ status: 500 }
		);
	} finally {
		await prisma.$disconnect();
	}
}
