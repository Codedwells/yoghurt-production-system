import bcrypt from 'bcryptjs';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const id = (await params).id;
	try {
		const session = await getServerSession(authOptions);

		if (!session || session.user.role !== 'ADMIN') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
		}

		const { email, name, password, role } = await request.json();

		// Check if user exists
		const existingUser = await db.user.findUnique({
			where: { id }
		});

		if (!existingUser) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 });
		}

		// Check if email is being changed and if it's already in use
		if (email && email !== existingUser.email) {
			const emailCheck = await db.user.findUnique({
				where: { email }
			});

			if (emailCheck) {
				return NextResponse.json(
					{ error: 'Email already in use' },
					{ status: 409 }
				);
			}
		}

		// Prepare update data
		const updateData: any = {};
		if (email) updateData.email = email;
		if (name) updateData.name = name;
		if (role) updateData.role = role;

		// If password is provided, hash it
		if (password) {
			updateData.password = await bcrypt.hash(password, 10);
		}

		// Update user
		const updatedUser = await db.user.update({
			where: { id },
			data: updateData
		});

		// Remove password from response
		const { password: _, ...userWithoutPassword } = updatedUser;

		return NextResponse.json(userWithoutPassword);
	} catch (error) {
		console.error('Failed to update user:', error);
		return NextResponse.json(
			{ error: 'Failed to update user' },
			{ status: 500 }
		);
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const id = (await params).id;
	try {
		const session = await getServerSession(authOptions);

		if (!session || session.user.role !== 'ADMIN') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
		}

		// Prevent admin from deleting themselves
		if (session.user.id === id) {
			return NextResponse.json(
				{ error: 'Cannot delete your own account' },
				{ status: 400 }
			);
		}

		// Check if user exists
		const existingUser = await db.user.findUnique({
			where: { id }
		});

		if (!existingUser) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 });
		}

		// Delete user
		await db.user.delete({
			where: { id }
		});

		return NextResponse.json({ message: 'User deleted successfully' });
	} catch (error) {
		console.error('Failed to delete user:', error);
		return NextResponse.json(
			{ error: 'Failed to delete user' },
			{ status: 500 }
		);
	}
}
