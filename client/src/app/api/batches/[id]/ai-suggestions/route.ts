import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI with the appropriate environment variable
const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export async function GET(request: NextRequest) {
	try {
		// Check if the API key is configured
		if (!apiKey) {
			console.error('No Gemini API key provided');
			return NextResponse.json(
				{ error: 'API key not configured' },
				{ status: 500 }
			);
		}

		const id = request.nextUrl.pathname.split('/').pop();
		if (!id) {
			return NextResponse.json(
				{ error: 'Batch ID is required' },
				{ status: 400 }
			);
		}

		// Try to fetch batch by ID first, then by batch number if that fails
		let batch = await db.batch.findUnique({
			where: { id },
			include: {
				recipe: true,
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
				qualityData: true
			}
		});

		// If batch not found by ID, try to find it by batch number
		if (!batch) {
			batch = await db.batch.findUnique({
				where: { batchNumber: id },
				include: {
					recipe: true,
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
					qualityData: true
				}
			});
		}

		if (!batch) {
			return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
		}

		// Prepare the data for the AI model
		const batchData = {
			batchNumber: batch.batchNumber,
			recipeName: batch.recipe.name,
			recipeInstructions: batch.recipe.instructions,
			productionDate: batch.productionDate,
			expiryDate: batch.expiryDate,
			status: batch.status,
			additives: batch.batchAdditives.map((ba) => ({
				name: ba.additive.name,
				quantity: ba.quantity,
				unit: ba.unit
			})),
			qualityData: batch.qualityData || {}
		};

		// Generate the prompt for the AI
		const prompt = `
You are a yoghurt production expert AI assistant analyzing batch ${batchData.batchNumber}.
Recipe: ${batchData.recipeName}
Production date: ${new Date(batchData.productionDate).toLocaleDateString()}
Status: ${batchData.status}

Based on the following data, provide 3-5 valuable insights and recommendations for this yoghurt production batch:
${JSON.stringify(batchData, null, 2)}

Format your response in markdown with bullet points and include:
- Production optimization suggestions
- Quality improvement recommendations
- Potential issues to watch for based on similar batches
- Shelf life optimization tips
		`;

		// Generate content with Gemini AI
		const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
		const result = await model.generateContent(prompt);
		const response = await result.response;
		const suggestions = response.text();

		return NextResponse.json({ suggestions });
	} catch (error) {
		console.error('Error generating AI suggestions:', error);
		return NextResponse.json(
			{ error: 'Failed to generate AI suggestions' },
			{ status: 500 }
		);
	}
}
