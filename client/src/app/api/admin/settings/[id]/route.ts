import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/lib/db';
import { NextRequest } from 'next/server';

export async function PATCH(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);

		if (!session || session.user.role !== 'ADMIN') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const id = request.url.split('/').pop();
		const { value, description } = await request.json();

		if (!value) {
			return NextResponse.json({ error: 'Value is required' }, { status: 400 });
		}

		const setting = await db.setting.update({
			where: { id },
			data: {
				value,
				description,
				updatedAt: new Date()
			}
		});

		return NextResponse.json(setting);
	} catch (error) {
		console.error('Error updating setting:', error);
		return NextResponse.json(
			{ error: 'Failed to update setting' },
			{ status: 500 }
		);
	}
}

export async function DELETE(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);

		if (!session || session.user.role !== 'ADMIN') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const id = request.url.split('/').pop();
		await db.setting.delete({
			where: { id }
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error deleting setting:', error);
		return NextResponse.json(
			{ error: 'Failed to delete setting' },
			{ status: 500 }
		);
	}
}
