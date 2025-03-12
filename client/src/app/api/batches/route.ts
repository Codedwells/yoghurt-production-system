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
		const batches = await db.batch.findMany({
			include: {
				recipe: true,
				creator: {
					select: {
						name: true,
						email: true
					}
				},
				batchAdditives: {
					include: {
						additive: true
					}
				}
			},
			orderBy: {
				productionDate: 'desc'
			}
		});

		return NextResponse.json(batches);
	} catch (error) {
		return new NextResponse(
			JSON.stringify({ error: 'Error fetching batches' }),
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

	try {
		const body = await req.json();
		const {
			batchNumber,
			recipeId,
			expiryDate,
			status,
			milkQuantity,
			milkUnit,
			notes,
			additives
		} = body;

		const batch = await db.batch.create({
			data: {
				batchNumber,
				recipeId,
				expiryDate,
				status,
				milkQuantity,
				milkUnit,
				notes,
				creatorId: session.user.id,
				batchAdditives: {
					create: additives.map((additive: any) => ({
						quantity: additive.quantity,
						unit: additive.unit,
						additiveId: additive.id
					}))
				}
			},
			include: {
				recipe: true,
				creator: {
					select: {
						name: true,
						email: true
					}
				},
				batchAdditives: {
					include: {
						additive: true
					}
				}
			}
		});

		return NextResponse.json(batch);
	} catch (error) {
		return new NextResponse(JSON.stringify({ error: 'Error creating batch' }), {
			status: 500
		});
	}
}
