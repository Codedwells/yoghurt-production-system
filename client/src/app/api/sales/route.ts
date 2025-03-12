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
		const salesOrders = await db.salesOrder.findMany({
			include: {
				items: {
					include: {
						packageBatch: {
							include: {
								packaging: true,
								batch: {
									include: {
										recipe: true
									}
								}
							}
						}
					}
				},
				user: {
					select: {
						name: true,
						email: true
					}
				}
			},
			orderBy: {
				orderDate: 'desc'
			}
		});

		return NextResponse.json(salesOrders);
	} catch (error) {
		return new NextResponse(
			JSON.stringify({ error: 'Error fetching sales orders' }),
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
			orderNumber,
			customerName,
			customerEmail,
			customerPhone,
			deliveryDate,
			status,
			items
		} = body;

		const salesOrder = await db.salesOrder.create({
			data: {
				orderNumber,
				customerName,
				customerEmail,
				customerPhone,
				deliveryDate,
				status,
				userId: session.user.id,
				items: {
					create: items.map((item: any) => ({
						quantity: item.quantity,
						packageBatchId: item.packageBatchId
					}))
				}
			},
			include: {
				items: {
					include: {
						packageBatch: {
							include: {
								packaging: true
							}
						}
					}
				}
			}
		});

		return NextResponse.json(salesOrder);
	} catch (error) {
		return new NextResponse(
			JSON.stringify({ error: 'Error creating sales order' }),
			{ status: 500 }
		);
	}
}
