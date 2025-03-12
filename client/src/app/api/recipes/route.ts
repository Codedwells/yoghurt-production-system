import { db } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	const session = await getServerSession(authOptions);

	if (!session) {
		return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
			status: 401
		});
	}

	try {
		const recipes = await db.recipe.findMany({
			include: {
				recipeAdditives: {
					include: {
						additive: true
					}
				}
			}
		});

		return NextResponse.json(recipes);
	} catch (error) {
		return new NextResponse(
			JSON.stringify({ error: 'Error fetching recipes' }),
			{ status: 500 }
		);
	}
}

export async function POST(req: NextRequest) {
	const session = await getServerSession(authOptions);

	if (!session) {
		return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
			status: 401
		});
	}

	if (
		session.user.role !== 'ADMIN' &&
		session.user.role !== 'PRODUCTION_MANAGER'
	) {
		return new NextResponse(
			JSON.stringify({ error: 'Insufficient permissions' }),
			{ status: 403 }
		);
	}

	try {
		const body = await req.json();
		const { name, description, instructions, additives } = body;

		const recipe = await db.recipe.create({
			data: {
				name,
				description,
				instructions,
				recipeAdditives: {
					create: additives.map((additive: any) => ({
						quantity: additive.quantity,
						unit: additive.unit,
						additiveId: additive.id
					}))
				}
			},
			include: {
				recipeAdditives: {
					include: {
						additive: true
					}
				}
			}
		});

		return NextResponse.json(recipe);
	} catch (error) {
		return new NextResponse(
			JSON.stringify({ error: 'Error creating recipe' }),
			{ status: 500 }
		);
	}
}
