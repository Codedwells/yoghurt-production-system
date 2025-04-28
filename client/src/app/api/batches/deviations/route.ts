import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next'; // Import getServerSession
import { authOptions } from '@/lib/auth'; // Import authOptions
import { db } from '@/lib/db'; // Assuming Prisma client instance
import { z } from 'zod';

// Zod schema for validating the POST request body
const deviationSchema = z.object({
	batchId: z.string().min(1, 'Batch ID is required'),
	parameter: z.string().min(1, 'Parameter is required'),
	expectedValue: z.string().min(1, 'Expected value is required'),
	actualValue: z.string().min(1, 'Actual value is required'),
	reason: z.string().min(1, 'Reason is required')
});

// POST handler to create a new production deviation
export async function POST(request: Request) {
	try {
		// Use getServerSession with authOptions
		const session = await getServerSession(authOptions);
		if (
			!session?.user?.id ||
			!['OPERATOR', 'ADMIN'].includes(session.user.role ?? '')
		) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const operatorId = session.user.id;
		const body = await request.json();

		const validation = deviationSchema.safeParse(body);
		if (!validation.success) {
			return NextResponse.json(
				{ error: 'Invalid input', details: validation.error.errors },
				{ status: 400 }
			);
		}

		const { batchId, parameter, expectedValue, actualValue, reason } =
			validation.data;

		// Check if batch exists (optional, but good practice)
		const batchExists = await db.batch.findUnique({
			where: { id: batchId }
		});
		if (!batchExists) {
			return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
		}

		const newDeviation = await db.productionDeviation.create({
			data: {
				batchId,
				operatorId,
				parameter,
				expectedValue,
				actualValue,
				reason
				// timestamp is handled by default in Prisma schema (default: now())
			}
		});

		return NextResponse.json(newDeviation, { status: 201 });
	} catch (error) {
		console.error('Error creating production deviation:', error);
		// Type guard for error object
		const errorMessage =
			error instanceof Error ? error.message : 'Internal Server Error';
		return NextResponse.json(
			{ error: 'Failed to record deviation', details: errorMessage },
			{ status: 500 }
		);
	}
}

// GET handler to fetch deviations for a specific batch
export async function GET(request: Request) {
	try {
		// Use getServerSession with authOptions
		const session = await getServerSession(authOptions);
		// Allow any logged-in user (or specific roles like QC, MANAGER) to view deviations
		if (!session?.user?.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { searchParams } = new URL(request.url);
		const batchId = searchParams.get('batchId');

		if (!batchId) {
			return NextResponse.json(
				{ error: 'Batch ID query parameter is required' },
				{ status: 400 }
			);
		}

		const deviations = await db.productionDeviation.findMany({
			where: {
				batchId: batchId
			},
			orderBy: {
				timestamp: 'desc' // Show newest first
			},
			include: {
				// Optionally include related data if needed
				operator: {
					select: { name: true, email: true } // Select specific fields to avoid exposing sensitive data
				}
			}
		});

		return NextResponse.json(deviations);
	} catch (error) {
		console.error('Error fetching production deviations:', error);
		const errorMessage =
			error instanceof Error ? error.message : 'Internal Server Error';
		return NextResponse.json(
			{ error: 'Failed to fetch deviations', details: errorMessage },
			{ status: 500 }
		);
	}
}
