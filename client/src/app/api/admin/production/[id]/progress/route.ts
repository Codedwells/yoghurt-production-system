import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PATCH(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const session = await getServerSession(authOptions);

		if (!session || session.user.role !== 'ADMIN') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
		}

		// Ensure id is available
		const id = params.id;
		if (!id) {
			return NextResponse.json(
				{ error: 'Production ID is required' },
				{ status: 400 }
			);
		}

		const body = await request.json();
		const { status, progress, notes, isCompleted } = body;

		// Validate input based on what's being updated
		if (isCompleted === true) {
			// If marking as complete, we don't need the other fields
		} else if (status) {
			// Validate status values
			const validStatuses = [
				'on-track',
				'delayed',
				'critical',
				'completed',
				'cancelled'
			];
			if (!validStatuses.includes(status)) {
				return NextResponse.json(
					{
						error: 'Invalid status value',
						validValues: validStatuses
					},
					{ status: 400 }
				);
			}
		} else if (progress !== undefined) {
			// Validate progress if provided
			if (typeof progress !== 'number' || progress < 0 || progress > 100) {
				return NextResponse.json(
					{ error: 'Progress must be a number between 0 and 100' },
					{ status: 400 }
				);
			}
		} else {
			// If neither isCompleted, status, nor progress is provided
			return NextResponse.json(
				{ error: 'Either status, progress, or isCompleted is required' },
				{ status: 400 }
			);
		}

		// Prepare update data
		const updateData: any = {};

		if (isCompleted === true) {
			// If marking as complete
			updateData.status = 'completed';
			if (notes) updateData.notes = notes;
		} else {
			// Normal update
			if (status) updateData.status = status;
			if (progress !== undefined) updateData.progress = progress;
			if (notes !== undefined) updateData.notes = notes;
		}

		// Update the batch
		const updatedBatch = await db.batch.update({
			where: { id },
			data: updateData
		});

		return NextResponse.json({
			success: true,
			message: 'Production progress updated successfully',
			data: updatedBatch
		});
	} catch (error) {
		console.error('Error updating production progress:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
