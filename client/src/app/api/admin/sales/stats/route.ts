import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface TopCustomer {
	name: string;
	orders: number;
	totalSpent: number;
	lastOrder: string;
}

interface SalesStats {
	revenue: number;
	newOrders: number;
	salesGrowth: number;
	activeCustomers: number;
	topCustomers: TopCustomer[];
}

export async function GET(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);

		if (!session || session.user.role !== 'ADMIN') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
		}

		// Get timeRange parameter
		const searchParams = request.nextUrl.searchParams;
		const timeRange = searchParams.get('timeRange') || 'week';

		// Calculate date range based on timeRange
		const now = new Date();
		let startDate = new Date();

		switch (timeRange) {
			case 'week':
				startDate.setDate(now.getDate() - 7);
				break;
			case 'month':
				startDate.setMonth(now.getMonth() - 1);
				break;
			case 'year':
				startDate.setFullYear(now.getFullYear() - 1);
				break;
			default:
				startDate.setDate(now.getDate() - 7);
		}

		// Get orders in the time period
		const recentOrders = await db.salesOrder.findMany({
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

		// Calculate total revenue
		// This is simplified; in a real app you would calculate based on actual prices
		const revenue = recentOrders.reduce((total, order) => {
			// Sum up item quantities * notional price
			const orderTotal = order.items.reduce((sum, item) => {
				const itemPrice = item.packageBatch?.packaging?.size || 1 * 5; // Simple price calculation
				return sum + item.quantity * itemPrice;
			}, 0);
			return total + orderTotal;
		}, 0);

		// Get new orders count
		const newOrders = await db.salesOrder.count({
			where: {
				orderDate: {
					gte: new Date(new Date().setDate(now.getDate() - 1)) // Last 24 hours
				}
			}
		});

		// Calculate growth compared to previous period
		let previousPeriodStart = new Date(startDate);
		switch (timeRange) {
			case 'week':
				previousPeriodStart.setDate(previousPeriodStart.getDate() - 7);
				break;
			case 'month':
				previousPeriodStart.setMonth(previousPeriodStart.getMonth() - 1);
				break;
			case 'year':
				previousPeriodStart.setFullYear(previousPeriodStart.getFullYear() - 1);
				break;
		}

		const previousPeriodOrders = await db.salesOrder.findMany({
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

		const previousRevenue = previousPeriodOrders.reduce((total, order) => {
			const orderTotal = order.items.reduce((sum, item) => {
				const itemPrice = item.packageBatch?.packaging?.size || 1 * 5;
				return sum + item.quantity * itemPrice;
			}, 0);
			return total + orderTotal;
		}, 0);

		// Calculate growth rate
		const salesGrowth =
			previousRevenue > 0
				? ((revenue - previousRevenue) / previousRevenue) * 100
				: 0;

		// Get distinct customers who placed orders in the period
		const activeCustomers = await db.salesOrder.groupBy({
			by: ['userId'],
			where: {
				orderDate: {
					gte: startDate
				}
			}
		});

		// Get top customers
		const topCustomersData = await db.salesOrder.groupBy({
			by: ['customerName'],
			where: {
				orderDate: {
					gte: startDate
				}
			},
			_count: {
				id: true
			},
			orderBy: {
				_count: {
					id: 'desc'
				}
			},
			take: 3
		});

		const topCustomers: TopCustomer[] = await Promise.all(
			topCustomersData.map(async (customer) => {
				const customerOrders = await db.salesOrder.findMany({
					where: {
						customerName: customer.customerName
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
					},
					orderBy: {
						orderDate: 'desc'
					}
				});

				const totalSpent = customerOrders.reduce((total, order) => {
					const orderTotal = order.items.reduce((sum, item) => {
						const itemPrice = item.packageBatch?.packaging?.size || 1 * 5;
						return sum + item.quantity * itemPrice;
					}, 0);
					return total + orderTotal;
				}, 0);

				const lastOrderDate =
					customerOrders.length > 0
						? customerOrders[0].orderDate.toISOString().split('T')[0]
						: 'N/A';

				return {
					name: customer.customerName,
					orders: customer._count.id,
					totalSpent: totalSpent,
					lastOrder: lastOrderDate
				};
			})
		);

		const salesStats: SalesStats = {
			revenue,
			newOrders,
			salesGrowth: Number(salesGrowth.toFixed(1)),
			activeCustomers: activeCustomers.length,
			topCustomers
		};

		return NextResponse.json(salesStats);
	} catch (error) {
		console.error('Failed to fetch sales stats:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch sales stats' },
			{ status: 500 }
		);
	}
}
