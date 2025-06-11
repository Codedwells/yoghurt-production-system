import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';

// Initialize Gemini AI with the appropriate environment variable
const apiKey =
	process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const id = (await params).id;
	try {
		// Verify authorization
		const session = await getServerSession(authOptions);

		if (!session || session.user.role !== 'ADMIN') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
		}

		// Check if the API key is configured
		if (!apiKey) {
			console.error('No Gemini API key provided');
			return NextResponse.json(
				{ error: 'API key not configured' },
				{ status: 500 }
			);
		}

		if (!id) {
			return NextResponse.json(
				{ error: 'Production ID is required' },
				{ status: 400 }
			);
		}

		// Fetch production details with related data
		const batch = await db.batch.findUnique({
			where: { id },
			include: {
				recipe: {
					include: {
						recipeAdditives: {
							include: {
								additive: true
							}
						}
					}
				},
				creator: {
					select: {
						name: true,
						email: true
					}
				},
				batchAdditives: {
					include: {
						additive: true
					}
				},
				qualityData: true,
				productionSchedule: true
			}
		});

		if (!batch) {
			return NextResponse.json(
				{ error: 'Production data not found' },
				{ status: 404 }
			);
		}

		// Prepare the data for the AI model
		const productionData = {
			batchNumber: batch.batchNumber,
			recipeName: batch.recipe.name,
			recipeInstructions: batch.recipe.instructions,
			productionDate: batch.productionDate,
			expiryDate: batch.expiryDate,
			status: batch.status,
			additives: (
				batch.batchAdditives as Array<{
					additive: { name: string };
					quantity: number;
					unit: string;
				}>
			).map((ba) => ({
				name: ba.additive.name,
				quantity: ba.quantity,
				unit: ba.unit
			})),
			qualityData: batch.qualityData || {},
			schedule: batch.productionSchedule
				? {
						startTime: batch.productionSchedule.startDate,
						endTime: batch.productionSchedule.endDate,
						status: batch.productionSchedule.status,
						notes: batch.productionSchedule.notes
					}
				: null
		};

		// Generate the prompt for the AI
		const prompt = `
You are a yoghurt production expert AI assistant analyzing production for batch ${productionData.batchNumber}.
Recipe: ${productionData.recipeName}
Production date: ${new Date(productionData.productionDate).toLocaleDateString()}
Status: ${productionData.status}
Production Progress: Not available

Based on the following production data, provide 3-5 valuable insights and recommendations:
${JSON.stringify(productionData, null, 2)}

Format your response in markdown with bullet points and include:
- Production timeline optimization suggestions
- Resource allocation recommendations
- Quality control checkpoints
- Efficiency improvement opportunities
- Potential production bottlenecks to address
		`;

		// Generate content with Gemini AI
		const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
		const result = await model.generateContent(prompt);
		const response = await result.response;
		const suggestions = response.text();

		return NextResponse.json({ suggestions });
	} catch (error) {
		console.error('Error generating AI production suggestions:', error);
		return NextResponse.json(
			{ error: 'Failed to generate AI production suggestions' },
			{ status: 500 }
		);
	}
}
