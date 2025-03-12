import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
	try {
		const session = await getServerSession(authOptions);

		if (!session || session.user.role !== 'ADMIN') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const settings = await prisma.setting.findMany({
			orderBy: {
				key: 'asc'
			}
		});

		return NextResponse.json(settings);
	} catch (error) {
		console.error('Error fetching settings:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch settings' },
			{ status: 500 }
		);
	} finally {
		await prisma.$disconnect();
	}
}

export async function PUT(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);

		if (!session || session.user.role !== 'ADMIN') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
		}

		const updates = await request.json();

		// Validate the updates
		if (!updates || typeof updates !== 'object') {
			return NextResponse.json(
				{ error: 'Invalid update format' },
				{ status: 400 }
			);
		}

		// Get all current settings
		const currentSettings = await prisma.setting.findMany({
			select: {
				key: true
			}
		});

		const settingKeys = currentSettings.map((setting) => setting.key);

		// Process updates in a transaction
		const updatePromises = Object.entries(updates).map(([key, value]) => {
			// Skip unknown settings
			if (!settingKeys.includes(key)) return null;

			return prisma.setting.update({
				where: { key },
				data: { value: String(value) }
			});
		});

		// Filter out null promises and execute all updates
		const validPromises = updatePromises.filter((p) => p !== null);
		await Promise.all(validPromises);

		return NextResponse.json({ message: 'Settings updated successfully' });
	} catch (error) {
		console.error('Failed to update settings:', error);
		return NextResponse.json(
			{ error: 'Failed to update settings' },
			{ status: 500 }
		);
	} finally {
		await prisma.$disconnect();
	}
}

export async function POST(request: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session || session.user.role !== 'ADMIN') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { key, value, description } = await request.json();

		// Validate input
		if (!key || !value) {
			return NextResponse.json(
				{ error: 'Key and value are required' },
				{ status: 400 }
			);
		}

		// Check for existing key
		const existingSetting = await prisma.setting.findUnique({
			where: { key }
		});

		if (existingSetting) {
			return NextResponse.json(
				{ error: 'Setting with this key already exists' },
				{ status: 400 }
			);
		}

		const setting = await prisma.setting.create({
			data: {
				key,
				value,
				description
			}
		});

		return NextResponse.json(setting);
	} catch (error) {
		console.error('Error creating setting:', error);
		return NextResponse.json(
			{ error: 'Failed to create setting' },
			{ status: 500 }
		);
	} finally {
		await prisma.$disconnect();
	}
}
