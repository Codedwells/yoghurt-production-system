import { db } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	request: NextRequest,
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
		const batch = await db.batch.findUnique({
			where: { id },
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
				},
				qualityData: true,
				productionSchedule: true
			}
		});

		if (!batch) {
			return new NextResponse(JSON.stringify({ error: 'Batch not found' }), {
				status: 404
			});
		}

		return NextResponse.json(batch);
	} catch (error) {
		console.error('Error fetching batch details:', error);
		return new NextResponse(
			JSON.stringify({ error: 'Error fetching batch details' }),
			{ status: 500 }
		);
	}
}
