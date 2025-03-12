import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface ProductionMetrics {
	avgBatchTime: number;
	qualityPassRate: number;
	resourceUtilization: number;
	wastePercentage: number;
}

interface StockoutRiskItem {
	product: string;
	stock: number;
	dailyUsage: number;
	daysRemaining: number;
	risk: string;
}

interface SeasonalInsight {
	title: string;
	description: string;
	color: string;
}

interface AnalyticsData {
	production: {
		total: number;
		growth: number;
		metrics: ProductionMetrics;
	};
	revenue: {
		total: number;
		growth: number;
	};
	orders: {
		active: number;
		change: number;
	};
	growthRate: {
		current: number;
		change: number;
	};
	inventory: {
		stockoutRisk: StockoutRiskItem[];
	};
	seasonal: {
		insights: SeasonalInsight[];
	};
}

export async function GET(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);

		if (!session || session.user.role !== 'ADMIN') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
		}

		// Get timeRange parameter
		const searchParams = request.nextUrl.searchParams;
		const timeRange = searchParams.get('timeRange') || 'month';

		// Calculate date ranges
		const now = new Date();
		let startDate = new Date();
		let previousPeriodStart = new Date();
		let previousPeriodEnd = new Date(startDate);

		switch (timeRange) {
			case 'week':
				startDate.setDate(now.getDate() - 7);
				previousPeriodStart.setDate(startDate.getDate() - 7);
				break;
			case 'month':
				startDate.setMonth(now.getMonth() - 1);
				previousPeriodStart.setMonth(startDate.getMonth() - 1);
				break;
			case 'quarter':
				startDate.setMonth(now.getMonth() - 3);
				previousPeriodStart.setMonth(startDate.getMonth() - 3);
				break;
			case 'year':
				startDate.setFullYear(now.getFullYear() - 1);
				previousPeriodStart.setFullYear(startDate.getFullYear() - 1);
				break;
			default:
				startDate.setMonth(now.getMonth() - 1);
				previousPeriodStart.setMonth(startDate.getMonth() - 1);
		}

		// Get batches in the current period
		const batches = await db.batch.findMany({
			where: {
				productionDate: {
					gte: startDate
				}
			},
			include: {
				recipe: true,
				qualityData: true
			}
		});

		// Calculate total production volume
		const totalProduction = batches.reduce(
			(sum, batch) => sum + batch.milkQuantity,
			0
		);

		// Get batches from the previous period
		const previousBatches = await db.batch.findMany({
			where: {
				productionDate: {
					gte: previousPeriodStart,
					lt: startDate
				}
			}
		});

		// Calculate total production from previous period
		const previousTotalProduction = previousBatches.reduce(
			(sum, batch) => sum + batch.milkQuantity,
			0
		);

		// Calculate production growth
		const productionGrowth =
			previousTotalProduction > 0
				? ((totalProduction - previousTotalProduction) /
						previousTotalProduction) *
					100
				: 0;

		// Get sales orders for current period
		const salesOrders = await db.salesOrder.findMany({
			where: {
				orderDate: {
					gte: startDate
				}
			},
			include: {
				items: {
					include: {
						packageBatch: {
							include: {
								packaging: true
							}
						}
					}
				}
			}
		});

		// Calculate revenue
		const revenue = salesOrders.reduce((total, order) => {
			const orderTotal = order.items.reduce((sum, item) => {
				const itemPrice = item.packageBatch?.packaging?.size || 1 * 5; // Simple price calculation
				return sum + item.quantity * itemPrice;
			}, 0);
			return total + orderTotal;
		}, 0);

		// Get sales orders from previous period
		const previousSalesOrders = await db.salesOrder.findMany({
			where: {
				orderDate: {
					gte: previousPeriodStart,
					lt: startDate
				}
			},
			include: {
				items: {
					include: {
						packageBatch: {
							include: {
								packaging: true
							}
						}
					}
				}
			}
		});

		// Calculate previous revenue
		const previousRevenue = previousSalesOrders.reduce((total, order) => {
			const orderTotal = order.items.reduce((sum, item) => {
				const itemPrice = item.packageBatch?.packaging?.size || 1 * 5;
				return sum + item.quantity * itemPrice;
			}, 0);
			return total + orderTotal;
		}, 0);

		// Calculate revenue growth
		const revenueGrowth =
			previousRevenue > 0
				? ((revenue - previousRevenue) / previousRevenue) * 100
				: 0;

		// Count active orders
		const activeOrders = await db.salesOrder.count({
			where: {
				status: {
					in: ['new', 'processing']
				}
			}
		});

		// Count active orders from previous period end
		const previousActiveOrders = await db.salesOrder.count({
			where: {
				status: {
					in: ['new', 'processing']
				},
				orderDate: {
					lte: previousPeriodEnd
				}
			}
		});

		// Calculate order change
		const orderChange = activeOrders - previousActiveOrders;

		// Calculate overall growth rate
		const growthRate = {
			current: Number(revenueGrowth.toFixed(1)),
			change: Number(
				(revenueGrowth - (previousRevenue > 0 ? 10 : 0)).toFixed(1)
			) // Simple placeholder calculation
		};

		// Get production metrics
		const productionMetrics: ProductionMetrics = {
			avgBatchTime: 6.2, // placeholder, would be calculated from actual batch durations
			qualityPassRate:
				(batches.filter((batch) =>
					batch.qualityData.some((qd) => qd.status === 'passed')
				).length /
					(batches.length || 1)) *
				100,
			resourceUtilization: 94.2, // placeholder
			wastePercentage: 1.8 // placeholder
		};

		// Get inventory items to calculate stockout risk
		const inventoryItems = await db.inventoryItem.findMany({
			include: {
				additive: true,
				packaging: true
			},
			orderBy: {
				quantity: 'asc'
			},
			take: 5
		});

		// Calculate stockout risk
		const stockoutRisk: StockoutRiskItem[] = inventoryItems.map((item) => {
			// Daily usage estimation (would be calculated from actual usage data)
			const dailyUsage =
				item.type === 'additive'
					? item.quantity * 0.25 // 25% of current stock per day for additives
					: item.quantity * 0.12; // 12% of current stock per day for other items

			const daysRemaining = dailyUsage > 0 ? item.quantity / dailyUsage : 999;
			const risk =
				daysRemaining < 5 ? 'high' : daysRemaining < 10 ? 'medium' : 'low';

			return {
				product:
					item.name +
					(item.packaging
						? ` (${item.packaging.size}${item.packaging.unit})`
						: ''),
				stock: Math.round(item.quantity),
				dailyUsage: Math.round(dailyUsage),
				daysRemaining: Number(daysRemaining.toFixed(1)),
				risk
			};
		});

		// Seasonal insights
		const seasonalInsights: SeasonalInsight[] = [
			{
				title: 'Summer Peak',
				description:
					'Sales of fruit-flavored yogurts increase by 32% during summer months. Consider increasing production capacity for these flavors from May to August.',
				color: 'blue'
			},
			{
				title: 'Winter Trend',
				description:
					'Greek yogurt sales rise by 18% during winter months. Focus marketing efforts on nutritional benefits during these periods.',
				color: 'green'
			},
			{
				title: 'Holiday Season',
				description:
					'Special edition flavors perform 45% better during holiday seasons. Plan for limited edition releases in November and December.',
				color: 'yellow'
			},
			{
				title: 'Spring Opportunity',
				description:
					'Sales data shows potential for growth in spring if paired with seasonal fruit offerings. Consider developing new products for Q2.',
				color: 'purple'
			}
		];

		const analyticsData: AnalyticsData = {
			production: {
				total: Math.round(totalProduction),
				growth: Number(productionGrowth.toFixed(1)),
				metrics: productionMetrics
			},
			revenue: {
				total: revenue,
				growth: Number(revenueGrowth.toFixed(1))
			},
			orders: {
				active: activeOrders,
				change: orderChange
			},
			growthRate: growthRate,
			inventory: {
				stockoutRisk: stockoutRisk
			},
			seasonal: {
				insights: seasonalInsights
			}
		};

		return NextResponse.json(analyticsData);
	} catch (error) {
		console.error('Failed to fetch analytics data:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch analytics data' },
			{ status: 500 }
		);
	}
}
