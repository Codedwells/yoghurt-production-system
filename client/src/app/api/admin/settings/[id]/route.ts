import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const session = await getServerSession(authOptions);

		if (!session || session.user.role !== 'ADMIN') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { value, description } = await request.json();

		if (!value) {
			return NextResponse.json({ error: 'Value is required' }, { status: 400 });
		}

		const setting = await prisma.setting.update({
			where: { id: params.id },
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
	} finally {
		await prisma.$disconnect();
	}
}

export async function DELETE(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const session = await getServerSession(authOptions);

		if (!session || session.user.role !== 'ADMIN') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		await prisma.setting.delete({
			where: { id: params.id }
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error deleting setting:', error);
		return NextResponse.json(
			{ error: 'Failed to delete setting' },
			{ status: 500 }
		);
	} finally {
		await prisma.$disconnect();
	}
}
