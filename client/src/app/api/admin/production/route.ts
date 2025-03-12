import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Batch, ProductionSchedule } from '@prisma/client';

export async function GET(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);

		if (!session || session.user.role !== 'ADMIN') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
		}

		// Get query parameters
		const searchParams = request.nextUrl.searchParams;
		const status = searchParams.get('status');

		// If status parameter is provided, filter by that status
		if (status === 'active') {
			// Query active batches with in-production status
			const activeBatches = await db.batch.findMany({
				where: {
					status: {
						in: ['in-production', 'processing', 'planned']
					}
				},
				include: {
					recipe: true,
					creator: {
						select: {
							name: true
						}
					},
					productionSchedule: true
				},
				orderBy: {
					productionDate: 'desc'
				}
			});

			// Transform to expected format
			const productionData = activeBatches.map((batch) => {
				// Calculate progress based on status or other factors
				const progress =
					batch.status === 'in-production'
						? 50
						: batch.status === 'processing'
							? 75
							: 25;

				return {
					id: batch.id,
					name: `${batch.recipe?.name || 'Unknown'} - Batch ${batch.batchNumber}`,
					progress: progress,
					stage: batch.status,
					startTime: new Date(batch.productionDate).toLocaleTimeString(),
					estimatedCompletion: new Date(
						new Date(batch.productionDate).getTime() + 5 * 60 * 60 * 1000 // Add 5 hours
					).toLocaleTimeString(),
					status: progress > 70 ? 'on-track' : 'delayed',
					assigned: batch.creator?.name || 'Unassigned'
				};
			});

			return NextResponse.json(productionData);
		} else if (status === 'completed') {
			// Query completed batches
			const completedBatches = await db.batch.findMany({
				where: {
					status: 'completed'
				},
				include: {
					recipe: true,
					qualityData: true
				},
				orderBy: {
					productionDate: 'desc'
				},
				take: 10
			});

			// Transform to expected format
			const completedData = completedBatches.map((batch) => {
				// Get overall quality assessment
				const qualityScore =
					batch.qualityData.length > 0
						? batch.qualityData.reduce((acc, item) => acc + item.value, 0) /
							batch.qualityData.length
						: 0;

				const quality =
					qualityScore > 8 ? 'High' : qualityScore > 6 ? 'Medium' : 'Low';

				return {
					id: batch.id,
					name: `${batch.recipe?.name || 'Unknown'} - Batch ${batch.batchNumber}`,
					completionDate: new Date(batch.productionDate).toLocaleDateString(),
					status: 'completed',
					outputQuality: quality,
					notes: batch.notes || 'No additional notes'
				};
			});

			return NextResponse.json(completedData);
		} else {
			// Return all production data if no status filter is provided
			const allBatches = await db.batch.findMany({
				include: {
					recipe: true,
					creator: {
						select: {
							name: true
						}
					}
				},
				orderBy: {
					productionDate: 'desc'
				}
			});

			return NextResponse.json(allBatches);
		}
	} catch (error) {
		console.error('Failed to fetch production data:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch production data' },
			{ status: 500 }
		);
	}
}
