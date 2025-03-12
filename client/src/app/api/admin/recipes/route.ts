import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
	try {
		const session = await getServerSession(authOptions);

		if (!session || session.user.role !== 'ADMIN') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
		}

		const recipes = await prisma.recipe.findMany({
			select: {
				id: true,
				name: true,
				description: true,
				instructions: true,
				createdAt: true,
				updatedAt: true,
				_count: {
					select: {
						recipeAdditives: true,
						batches: true
					}
				}
			},
			orderBy: {
				updatedAt: 'desc'
			}
		});

		// Transform the response to include counts directly
		const formattedRecipes = recipes.map((recipe) => ({
			id: recipe.id,
			name: recipe.name,
			description: recipe.description,
			instructions: recipe.instructions,
			createdAt: recipe.createdAt,
			updatedAt: recipe.updatedAt,
			recipeAdditiveCount: recipe._count.recipeAdditives,
			batchCount: recipe._count.batches
		}));

		return NextResponse.json(formattedRecipes);
	} catch (error) {
		console.error('Failed to fetch recipes:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch recipes' },
			{ status: 500 }
		);
	} finally {
		await prisma.$disconnect();
	}
}

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);

		if (!session || session.user.role !== 'ADMIN') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
		}

		const { name, description, instructions, additives } = await request.json();

		if (!name || !instructions) {
			return NextResponse.json(
				{ error: 'Name and instructions are required' },
				{ status: 400 }
			);
		}

		// Create the recipe in a transaction with its additives
		const newRecipe = await prisma.$transaction(async (tx) => {
			// Create recipe
			const recipe = await tx.recipe.create({
				data: {
					name,
					description,
					instructions
				}
			});

			// Add additives if provided
			if (additives && Array.isArray(additives) && additives.length > 0) {
				for (const additive of additives) {
					await tx.recipeAdditive.create({
						data: {
							recipeId: recipe.id,
							additiveId: additive.additiveId,
							quantity: additive.quantity,
							unit: additive.unit
						}
					});
				}
			}

			return recipe;
		});

		return NextResponse.json(newRecipe, { status: 201 });
	} catch (error) {
		console.error('Failed to create recipe:', error);
		return NextResponse.json(
			{ error: 'Failed to create recipe' },
			{ status: 500 }
		);
	} finally {
		await prisma.$disconnect();
	}
}
