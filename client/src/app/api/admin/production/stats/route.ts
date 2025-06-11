import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { NextRequest } from 'next/server';

interface ProductionStats {
	activeCount: number;
	avgCompletion: number;
	onTimeRate: number;
	qualityRating: number;
}

export async function GET(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);

		if (!session || session.user.role !== 'ADMIN') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
		}

		// Count active batches
		const activeCount = await db.batch.count({
			where: {
				status: {
					in: ['in-production', 'processing', 'planned']
				}
			}
		});

		// Calculate average completion rate
		// Assuming we can determine this from quality control data or batch status
		let avgCompletion = 0;
		const inProgressBatches = await db.batch.findMany({
			where: {
				status: {
					in: ['in-production', 'processing']
				}
			}
		});

		// Simplified calculation - in reality would be more complex
		if (inProgressBatches.length > 0) {
			const completionValues = inProgressBatches.map((batch) => {
				return batch.status === 'processing' ? 75 : 50;
			});
			avgCompletion =
				completionValues.reduce((sum, val) => sum + val, 0) /
				inProgressBatches.length;
		} else {
			avgCompletion = 0;
		}

		// Calculate on-time production rate
		// This would typically come from historical data tracking batch completion against estimates
		// Using mock data for now
		const onTimeRate = 92;

		// Get quality rating from QualityControlData
		let qualityRating = 0;
		const qualityData = await db.qualityControlData.findMany({
			where: {
				parameter: 'overall_quality',
				status: 'passed'
			},
			take: 20,
			orderBy: {
				timestamp: 'desc'
			}
		});

		if (qualityData.length > 0) {
			// Convert to a 5-point scale
			qualityRating =
				qualityData.reduce((sum, item) => sum + item.value, 0) /
				qualityData.length /
				2;
		} else {
			qualityRating = 4.8; // Default if no data
		}

		const productionStats: ProductionStats = {
			activeCount,
			avgCompletion: Math.round(avgCompletion),
			onTimeRate,
			qualityRating
		};

		return NextResponse.json(productionStats);
	} catch (error) {
		console.error('Failed to fetch production stats:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch production stats' },
			{ status: 500 }
		);
	}
}
