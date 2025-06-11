import { db } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const id = (await params).id;
	const session = await getServerSession(authOptions);

	if (!session) {
		return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
			status: 401
		});
	}

	try {
		const { status } = await req.json();

		if (!status) {
			return new NextResponse(JSON.stringify({ error: 'Status is required' }), {
				status: 400
			});
		}

		// Validate status values
		const validStatuses = [
			'pending',
			'in-production',
			'processing',
			'completed',
			'cancelled'
		];
		if (!validStatuses.includes(status)) {
			return new NextResponse(
				JSON.stringify({
					error: 'Invalid status value',
					validValues: validStatuses
				}),
				{ status: 400 }
			);
		}

		const batch = await db.batch.update({
			where: { id },
			data: { status },
			include: {
				recipe: true,
				creator: {
					select: {
						name: true,
						email: true
					}
				}
			}
		});

		return NextResponse.json(batch);
	} catch (error) {
		console.error('Error updating batch status:', error);
		return new NextResponse(
			JSON.stringify({ error: 'Error updating batch status' }),
			{ status: 500 }
		);
	}
}
