import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const id = (await params).id;
	try {
		const session = await getServerSession(authOptions);

		if (!session || session.user.role !== 'ADMIN') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
		}

		const recipe = await db.recipe.findUnique({
			where: { id },
			include: {
				recipeAdditives: {
					include: {
						additive: true
					}
				},
				batches: {
					select: {
						id: true,
						batchNumber: true,
						productionDate: true,
						expiryDate: true,
						status: true
					},
					orderBy: {
						productionDate: 'desc'
					},
					take: 5 // Limit to most recent 5 batches
				}
			}
		});

		if (!recipe) {
			return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
		}

		return NextResponse.json(recipe);
	} catch (error) {
		console.error('Failed to fetch recipe:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch recipe' },
			{ status: 500 }
		);
	}
}

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

		if (!id) {
			return NextResponse.json(
				{ error: 'Recipe ID is required' },
				{ status: 400 }
			);
		}

		const { name, description, instructions, additives } = await request.json();

		// Check if recipe exists
		const existingRecipe = await db.recipe.findUnique({
			where: { id }
		});

		if (!existingRecipe) {
			return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
		}

		// Update the recipe and its additives in a transaction
		const updatedRecipe = await db.$transaction(async (tx: any) => {
			// Update recipe
			const recipe = await tx.recipe.update({
				where: { id },
				data: {
					name,
					description,
					instructions
				}
			});

			// If additives are provided, update them
			if (additives && Array.isArray(additives)) {
				// Delete existing recipe additives
				await tx.recipeAdditive.deleteMany({
					where: { recipeId: id }
				});

				// Create new recipe additives
				for (const additive of additives) {
					await tx.recipeAdditive.create({
						data: {
							recipeId: id,
							additiveId: additive.additiveId,
							quantity: additive.quantity,
							unit: additive.unit
						}
					});
				}
			}

			return recipe;
		});

		return NextResponse.json(updatedRecipe);
	} catch (error) {
		console.error('Failed to update recipe:', error);
		return NextResponse.json(
			{ error: 'Failed to update recipe' },
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

		// Check if recipe exists
		const existingRecipe = await db.recipe.findUnique({
			where: { id },
			include: {
				batches: { take: 1 } // Check if there are any batches
			}
		});

		if (!existingRecipe) {
			return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
		}

		// Prevent deletion if recipe has batches
		if (existingRecipe.batches.length > 0) {
			return NextResponse.json(
				{
					error: 'Cannot delete recipe with associated batches'
				},
				{ status: 400 }
			);
		}

		// Delete recipe additives first, then the recipe
		await db.$transaction([
			db.recipeAdditive.deleteMany({
				where: { recipeId: id }
			}),
			db.recipe.delete({
				where: { id }
			})
		]);

		return NextResponse.json({ message: 'Recipe deleted successfully' });
	} catch (error) {
		console.error('Failed to delete recipe:', error);
		return NextResponse.json(
			{ error: 'Failed to delete recipe' },
			{ status: 500 }
		);
	}
}
