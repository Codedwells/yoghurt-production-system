const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
	// Seed users with different roles
	const adminPassword = await bcrypt.hash('admin123', 10);
	const managerPassword = await bcrypt.hash('manager123', 10);
	const userPassword = await bcrypt.hash('user123', 10);

	const admin = await prisma.user.upsert({
		where: { email: 'admin@yoghurt.com' },
		update: {},
		create: {
			email: 'admin@yoghurt.com',
			name: 'Admin User',
			password: adminPassword,
			role: 'ADMIN'
		}
	});

	const manager = await prisma.user.upsert({
		where: { email: 'manager@yoghurt.com' },
		update: {},
		create: {
			email: 'manager@yoghurt.com',
			name: 'Production Manager',
			password: managerPassword,
			role: 'PRODUCTION_MANAGER'
		}
	});

	const user = await prisma.user.upsert({
		where: { email: 'user@yoghurt.com' },
		update: {},
		create: {
			email: 'user@yoghurt.com',
			name: 'Regular User',
			password: userPassword,
			role: 'USER'
		}
	});

	// Seed initial site settings
	const settings = [
		{
			key: 'COMPANY_NAME',
			value: 'Yoghurt AI Production',
			description: 'Company name displayed across the application'
		},
		{
			key: 'CONTACT_EMAIL',
			value: 'contact@yoghurt.com',
			description: 'Primary contact email for support'
		},
		{
			key: 'PRODUCTION_UNITS',
			value: 'liters',
			description: 'Default units used for milk measurement'
		},
		{
			key: 'QUALITY_CHECK_REMINDER',
			value: '24',
			description: 'Hours before batch expiry to remind for quality check'
		},
		{
			key: 'ENABLE_AI_OPTIMIZATION',
			value: 'true',
			description: 'Toggle for AI-powered schedule optimization'
		}
	];

	for (const setting of settings) {
		await prisma.setting.upsert({
			where: { key: setting.key },
			update: { value: setting.value },
			create: setting
		});
	}

	// Seed additive types
	const additives = [
		{
			name: 'Strawberry',
			type: 'fruit',
			description: 'Fresh strawberry flavor'
		},
		{ name: 'Blueberry', type: 'fruit', description: 'Wild blueberry flavor' },
		{ name: 'Vanilla', type: 'flavor', description: 'Natural vanilla extract' },
		{
			name: 'Probiotic Culture A',
			type: 'probiotic',
			description: 'Live active cultures'
		},
		{
			name: 'Probiotic Culture B',
			type: 'probiotic',
			description: 'Special digestive health blend'
		}
	];

	for (const additive of additives) {
		await prisma.additive.upsert({
			where: { id: additive.name },
			update: {},
			create: {
				id: additive.name,
				name: additive.name,
				type: additive.type,
				description: additive.description,
				inventoryItem: {
					create: {
						name: additive.name,
						type: 'additive',
						quantity: 100,
						unit: additive.type === 'fruit' ? 'kg' : 'g',
						reorderLevel: 20
					}
				}
			}
		});
	}

	// Seed packaging types
	const packagingTypes = [
		{ name: 'Small Cup', size: 125, unit: 'ml', material: 'Plastic' },
		{ name: 'Medium Cup', size: 250, unit: 'ml', material: 'Plastic' },
		{ name: 'Large Cup', size: 500, unit: 'ml', material: 'Plastic' },
		{ name: 'Family Pack', size: 1000, unit: 'ml', material: 'Plastic' }
	];

	for (const packaging of packagingTypes) {
		await prisma.packaging.upsert({
			where: { id: packaging.name },
			update: {},
			create: {
				id: packaging.name,
				name: packaging.name,
				size: packaging.size,
				unit: packaging.unit,
				material: packaging.material,
				inventoryItem: {
					create: {
						name: packaging.name,
						type: 'packaging',
						quantity: 1000,
						unit: 'pieces',
						reorderLevel: 200
					}
				}
			}
		});
	}

	// Seed sample recipes
	const recipes = [
		{
			name: 'Plain Yoghurt',
			instructions:
				'Heat milk to 85°C, cool to 45°C, add culture, ferment for 8 hours.',
			additives: [{ name: 'Probiotic Culture A', quantity: 5, unit: 'g' }]
		},
		{
			name: 'Strawberry Yoghurt',
			instructions:
				'Prepare plain yoghurt, add strawberry puree before packaging.',
			additives: [
				{ name: 'Probiotic Culture A', quantity: 5, unit: 'g' },
				{ name: 'Strawberry', quantity: 100, unit: 'g' }
			]
		},
		{
			name: 'Blueberry Yoghurt',
			instructions:
				'Prepare plain yoghurt, add blueberry puree before packaging.',
			additives: [
				{ name: 'Probiotic Culture A', quantity: 5, unit: 'g' },
				{ name: 'Blueberry', quantity: 80, unit: 'g' }
			]
		}
	];

	for (const recipe of recipes) {
		const createdRecipe = await prisma.recipe.upsert({
			where: { id: recipe.name },
			update: {},
			create: {
				id: recipe.name,
				name: recipe.name,
				instructions: recipe.instructions
			}
		});

		for (const additive of recipe.additives) {
			await prisma.recipeAdditive.create({
				data: {
					recipe: { connect: { id: createdRecipe.id } },
					additive: { connect: { id: additive.name } },
					quantity: additive.quantity,
					unit: additive.unit
				}
			});
		}
	}

	console.log('Database seeded successfully!');
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
