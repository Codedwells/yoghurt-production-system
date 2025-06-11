import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);

		if (!session || session.user.role !== 'ADMIN') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
		}

		const id = request.url.split('/').pop();

		// Get the batch with all relevant information
		const batch = await db.batch.findUnique({
			where: { id },
			include: {
				recipe: {
					include: {
						recipeAdditives: {
							include: {
								additive: true
							}
						}
					}
				},
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
			return NextResponse.json(
				{ error: 'Production data not found' },
				{ status: 404 }
			);
		}

		// Determine if this is an active or completed production
		const isCompleted = batch.status === 'completed';

		if (isCompleted) {
			// Format for completed production
			const qualityScore =
				batch.qualityData?.length > 0
					? batch.qualityData.reduce((acc, item) => acc + item.value, 0) /
						batch.qualityData.length
					: 0;

			const quality =
				qualityScore > 8 ? 'High' : qualityScore > 6 ? 'Medium' : 'Low';

			const productionData = {
				id: batch.id,
				batchNumber: batch.batchNumber,
				productName: batch.recipe?.name || 'Unknown',
				recipeId: batch.recipeId, // Add the recipe ID to the response
				completionDate: new Date(batch.productionDate).toLocaleDateString(),
				status: 'completed',
				outputQuality: quality,
				qualityMetrics: batch.qualityData || [],
				recipeAdditives: batch.recipe?.recipeAdditives || [],
				additives: batch.batchAdditives || [],
				milkQuantity: `${batch.milkQuantity} ${batch.milkUnit}`,
				notes: batch.notes || 'No additional notes',
				createdBy: batch.creator?.name,
				creationDate: new Date(batch.productionDate).toLocaleDateString(),
				expiryDate: new Date(batch.expiryDate).toLocaleDateString()
			};

			return NextResponse.json(productionData);
		} else {
			// Format for active production
			// Calculate progress based on status
			const progress =
				batch.status === 'in-production'
					? 50
					: batch.status === 'processing'
						? 75
						: 25;

			const startTime = new Date(batch.productionDate);
			// Calculate estimated completion (5 hours from production date)
			const estimatedCompletion = new Date(
				startTime.getTime() + 5 * 60 * 60 * 1000
			);

			const productionData = {
				id: batch.id,
				batchNumber: batch.batchNumber,
				productName: batch.recipe?.name || 'Unknown',
				recipeId: batch.recipeId, // Add the recipe ID to the response
				progress: progress,
				stage: batch.status,
				startTime: startTime.toLocaleString(),
				estimatedCompletion: estimatedCompletion.toLocaleString(),
				status: progress > 70 ? 'on-track' : 'delayed',
				assigned: batch.creator?.name || 'Unassigned',
				milkQuantity: `${batch.milkQuantity} ${batch.milkUnit}`,
				recipeAdditives: batch.recipe?.recipeAdditives || [],
				additives: batch.batchAdditives || [],
				notes: batch.notes || 'No additional notes',
				schedule: batch.productionSchedule || null
			};

			return NextResponse.json(productionData);
		}
	} catch (error) {
		console.error('Error fetching production details:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
