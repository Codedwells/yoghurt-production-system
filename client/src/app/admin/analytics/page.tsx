'use client';

import { useState, useEffect } from 'react';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AdminHeader from '@/components/admin/AdminHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';
import {
	BarChart,
	LineChart,
	PieChart,
	Calendar,
	TrendingUp,
	ArrowUpRight,
	ActivitySquare,
	Download,
	RefreshCw,
	ChartBar
} from 'lucide-react';
import { toast } from 'sonner';

// Define interfaces for our data
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

export default function AnalyticsPage() {
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [timeRange, setTimeRange] = useState<string>('month');
	const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
		production: {
			total: 24320,
			growth: 12,
			metrics: {
				avgBatchTime: 6.2,
				qualityPassRate: 98.7,
				resourceUtilization: 94.2,
				wastePercentage: 1.8
			}
		},
		revenue: {
			total: 285245.89,
			growth: 8.2
		},
		orders: {
			active: 32,
			change: -4
		},
		growthRate: {
			current: 14.2,
			change: 2.4
		},
		inventory: {
			stockoutRisk: [
				{
					product: 'Plain Yogurt (1L)',
					stock: 240,
					dailyUsage: 60,
					daysRemaining: 4,
					risk: 'high'
				},
				{
					product: 'Greek Yogurt (500ml)',
					stock: 350,
					dailyUsage: 40,
					daysRemaining: 8.7,
					risk: 'medium'
				},
				{
					product: 'Strawberry Yogurt (250ml)',
					stock: 520,
					dailyUsage: 35,
					daysRemaining: 14.8,
					risk: 'low'
				}
			]
		},
		seasonal: {
			insights: [
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
			]
		}
	});

	useEffect(() => {
		fetchAnalyticsData();
	}, [timeRange]);

	const fetchAnalyticsData = async () => {
		setIsLoading(true);
		try {
			const response = await fetch(
				`/api/admin/analytics?timeRange=${timeRange}`
			);
			if (!response.ok) {
				throw new Error('Failed to fetch analytics data');
			}
			const data = await response.json();
			setAnalyticsData(data);
		} catch (error) {
			console.error('Error fetching analytics data:', error);
			toast.error('Failed to load analytics data');
			// Default data is already set in state initialization
		} finally {
			setIsLoading(false);
		}
	};

	const handleRefresh = () => {
		toast.info('Refreshing analytics data...');
		fetchAnalyticsData();
	};

	const getRiskBadgeColor = (risk: string | undefined): string => {
		switch (risk?.toLowerCase()) {
			case 'high':
				return 'bg-red-100 text-red-800';
			case 'medium':
				return 'bg-yellow-100 text-yellow-800';
			case 'low':
				return 'bg-green-100 text-green-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	const getInsightBorderColor = (color: string | undefined): string => {
		switch (color?.toLowerCase()) {
			case 'blue':
				return 'border-blue-500';
			case 'green':
				return 'border-green-500';
			case 'yellow':
				return 'border-yellow-500';
			case 'purple':
				return 'border-purple-500';
			case 'red':
				return 'border-red-500';
			default:
				return 'border-gray-500';
		}
	};

	return (
		<div className="flex-1 space-y-4 p-8 pt-6">
			<div className="flex items-center justify-between">
				<AdminHeader title="Analytics Dashboard" />
				<Button variant="outline" size="sm" onClick={handleRefresh}>
					<RefreshCw className="mr-2 h-4 w-4" />
					Refresh Data
				</Button>
			</div>

			<div className="flex items-center justify-between">
				<div className="space-y-1">
					<h2 className="text-2xl font-semibold tracking-tight">Overview</h2>
					<p className="text-muted-foreground text-sm">
						Data for{' '}
						{timeRange === 'week'
							? 'the past week'
							: timeRange === 'month'
								? 'the past month'
								: timeRange === 'quarter'
									? 'the past quarter'
									: 'the past year'}
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Select value={timeRange} onValueChange={setTimeRange}>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Select time range" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="week">Past Week</SelectItem>
							<SelectItem value="month">Past Month</SelectItem>
							<SelectItem value="quarter">Past Quarter</SelectItem>
							<SelectItem value="year">Past Year</SelectItem>
						</SelectContent>
					</Select>

					<Button variant="outline">
						<Download className="mr-2 h-4 w-4" />
						Export
					</Button>
				</div>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Production
						</CardTitle>
						<ChartBar className="text-muted-foreground h-4 w-4" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{isLoading
								? '...'
								: `${analyticsData.production.total.toLocaleString()}L`}
						</div>
						<p className="text-muted-foreground text-xs">
							{analyticsData.production.growth > 0 ? '+' : ''}
							{analyticsData.production.growth}% from previous period
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Revenue</CardTitle>
						<TrendingUp className="text-muted-foreground h-4 w-4" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{isLoading
								? '...'
								: new Intl.NumberFormat('en-US', {
										style: 'currency',
										currency: 'USD'
									}).format(analyticsData.revenue.total)}
						</div>
						<p className="text-muted-foreground text-xs">
							{analyticsData.revenue.growth > 0 ? '+' : ''}
							{analyticsData.revenue.growth}% from previous period
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Active Orders</CardTitle>
						<ActivitySquare className="text-muted-foreground h-4 w-4" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{isLoading ? '...' : analyticsData.orders.active}
						</div>
						<p className="text-muted-foreground text-xs">
							{analyticsData.orders.change > 0 ? '+' : ''}
							{analyticsData.orders.change} from previous period
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
						<ArrowUpRight className="text-muted-foreground h-4 w-4" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{isLoading ? '...' : `+${analyticsData.growthRate.current}%`}
						</div>
						<p className="text-muted-foreground text-xs">
							{analyticsData.growthRate.change > 0 ? '+' : ''}
							{analyticsData.growthRate.change}% from previous period
						</p>
					</CardContent>
				</Card>
			</div>

			<Tabs defaultValue="production" className="space-y-4">
				<TabsList>
					<TabsTrigger value="production" className="flex items-center">
						<BarChart className="mr-2 h-4 w-4" />
						Production
					</TabsTrigger>
					<TabsTrigger value="sales" className="flex items-center">
						<LineChart className="mr-2 h-4 w-4" />
						Sales
					</TabsTrigger>
					<TabsTrigger value="inventory" className="flex items-center">
						<PieChart className="mr-2 h-4 w-4" />
						Inventory
					</TabsTrigger>
					<TabsTrigger value="seasonal" className="flex items-center">
						<Calendar className="mr-2 h-4 w-4" />
						Seasonal Trends
					</TabsTrigger>
				</TabsList>

				<TabsContent value="production" className="space-y-4">
					<div className="grid gap-4 md:grid-cols-2">
						<Card className="col-span-2">
							<CardHeader>
								<CardTitle>Production Volume Over Time</CardTitle>
								<CardDescription>
									Total production volume in liters by product type
								</CardDescription>
							</CardHeader>
							<CardContent className="h-96">
								{isLoading ? (
									<div className="flex h-full items-center justify-center">
										<p>Loading chart data...</p>
									</div>
								) : (
									<div className="text-muted-foreground flex h-full items-center justify-center">
										Line chart for production volume would appear here
										<br />
										(Requires chart library integration)
									</div>
								)}
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Production Efficiency</CardTitle>
								<CardDescription>
									Output vs. target efficiency ratio
								</CardDescription>
							</CardHeader>
							<CardContent className="h-80">
								{isLoading ? (
									<div className="flex h-full items-center justify-center">
										<p>Loading chart data...</p>
									</div>
								) : (
									<div className="text-muted-foreground flex h-full items-center justify-center">
										Area chart for efficiency would appear here
										<br />
										(Requires chart library integration)
									</div>
								)}
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Production by Batch Type</CardTitle>
								<CardDescription>
									Distribution across product categories
								</CardDescription>
							</CardHeader>
							<CardContent className="h-80">
								{isLoading ? (
									<div className="flex h-full items-center justify-center">
										<p>Loading chart data...</p>
									</div>
								) : (
									<div className="text-muted-foreground flex h-full items-center justify-center">
										Pie chart for batch distribution would appear here
										<br />
										(Requires chart library integration)
									</div>
								)}
							</CardContent>
						</Card>
					</div>

					<Card>
						<CardHeader>
							<CardTitle>Key Production Metrics</CardTitle>
							<CardDescription>
								Summary of critical performance indicators
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
								<div className="space-y-1">
									<p className="text-muted-foreground text-sm font-medium">
										Average Batch Time
									</p>
									<p className="text-2xl font-bold">
										{isLoading
											? '...'
											: `${analyticsData.production.metrics.avgBatchTime} hours`}
									</p>
									<p className="text-muted-foreground text-xs">
										-12 min from average
									</p>
								</div>
								<div className="space-y-1">
									<p className="text-muted-foreground text-sm font-medium">
										Quality Pass Rate
									</p>
									<p className="text-2xl font-bold">
										{isLoading
											? '...'
											: `${analyticsData.production.metrics.qualityPassRate}%`}
									</p>
									<p className="text-muted-foreground text-xs">
										+0.5% from average
									</p>
								</div>
								<div className="space-y-1">
									<p className="text-muted-foreground text-sm font-medium">
										Resource Utilization
									</p>
									<p className="text-2xl font-bold">
										{isLoading
											? '...'
											: `${analyticsData.production.metrics.resourceUtilization}%`}
									</p>
									<p className="text-muted-foreground text-xs">
										+2.1% from target
									</p>
								</div>
								<div className="space-y-1">
									<p className="text-muted-foreground text-sm font-medium">
										Waste Percentage
									</p>
									<p className="text-2xl font-bold">
										{isLoading
											? '...'
											: `${analyticsData.production.metrics.wastePercentage}%`}
									</p>
									<p className="text-muted-foreground text-xs">
										-0.3% from average
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="sales" className="space-y-4">
					<div className="grid gap-4 md:grid-cols-2">
						<Card className="col-span-2">
							<CardHeader>
								<CardTitle>Revenue Trends</CardTitle>
								<CardDescription>
									Monthly revenue over selected period
								</CardDescription>
							</CardHeader>
							<CardContent className="h-96">
								{isLoading ? (
									<div className="flex h-full items-center justify-center">
										<p>Loading chart data...</p>
									</div>
								) : (
									<div className="text-muted-foreground flex h-full items-center justify-center">
										Line chart for revenue would appear here
										<br />
										(Requires chart library integration)
									</div>
								)}
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Top Products</CardTitle>
								<CardDescription>
									Best selling products by volume
								</CardDescription>
							</CardHeader>
							<CardContent className="h-80">
								{isLoading ? (
									<div className="flex h-full items-center justify-center">
										<p>Loading chart data...</p>
									</div>
								) : (
									<div className="text-muted-foreground flex h-full items-center justify-center">
										Bar chart for top products would appear here
										<br />
										(Requires chart library integration)
									</div>
								)}
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Customer Distribution</CardTitle>
								<CardDescription>
									Revenue share by customer segment
								</CardDescription>
							</CardHeader>
							<CardContent className="h-80">
								{isLoading ? (
									<div className="flex h-full items-center justify-center">
										<p>Loading chart data...</p>
									</div>
								) : (
									<div className="text-muted-foreground flex h-full items-center justify-center">
										Pie chart for customer distribution would appear here
										<br />
										(Requires chart library integration)
									</div>
								)}
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="inventory" className="space-y-4">
					<div className="grid gap-4 md:grid-cols-2">
						<Card>
							<CardHeader>
								<CardTitle>Inventory Levels</CardTitle>
								<CardDescription>
									Current stock levels by product type
								</CardDescription>
							</CardHeader>
							<CardContent className="h-80">
								{isLoading ? (
									<div className="flex h-full items-center justify-center">
										<p>Loading chart data...</p>
									</div>
								) : (
									<div className="text-muted-foreground flex h-full items-center justify-center">
										Bar chart for inventory levels would appear here
										<br />
										(Requires chart library integration)
									</div>
								)}
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Inventory Turnover Rate</CardTitle>
								<CardDescription>
									How quickly inventory is sold and replaced
								</CardDescription>
							</CardHeader>
							<CardContent className="h-80">
								{isLoading ? (
									<div className="flex h-full items-center justify-center">
										<p>Loading chart data...</p>
									</div>
								) : (
									<div className="text-muted-foreground flex h-full items-center justify-center">
										Line chart for inventory turnover would appear here
										<br />
										(Requires chart library integration)
									</div>
								)}
							</CardContent>
						</Card>
					</div>

					<Card>
						<CardHeader>
							<CardTitle>Stockout Risk Analysis</CardTitle>
							<CardDescription>
								Products that risk running out of stock
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="overflow-x-auto">
								<table className="w-full text-sm">
									<thead>
										<tr>
											<th className="py-2 text-left font-medium">Product</th>
											<th className="py-2 text-left font-medium">
												Current Stock
											</th>
											<th className="py-2 text-left font-medium">
												Daily Usage
											</th>
											<th className="py-2 text-left font-medium">
												Days Remaining
											</th>
											<th className="py-2 text-left font-medium">Risk Level</th>
										</tr>
									</thead>
									<tbody>
										{analyticsData.inventory.stockoutRisk.map((item, index) => (
											<tr key={index}>
												<td className="py-2">{item.product}</td>
												<td className="py-2">{item.stock} units</td>
												<td className="py-2">{item.dailyUsage} units</td>
												<td className="py-2">{item.daysRemaining} days</td>
												<td className="py-2">
													<span
														className={`px-2 py-1 ${getRiskBadgeColor(item.risk)} rounded-full text-xs`}
													>
														{item.risk?.charAt(0).toUpperCase() +
															item.risk?.slice(1) || 'Unknown'}
													</span>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="seasonal" className="space-y-4">
					<Card className="col-span-2">
						<CardHeader>
							<CardTitle>Seasonal Sales Patterns</CardTitle>
							<CardDescription>
								Monthly breakdown of sales throughout the year
							</CardDescription>
						</CardHeader>
						<CardContent className="h-96">
							{isLoading ? (
								<div className="flex h-full items-center justify-center">
									<p>Loading chart data...</p>
								</div>
							) : (
								<div className="text-muted-foreground flex h-full items-center justify-center">
									Area chart for seasonal trends would appear here
									<br />
									(Requires chart library integration)
								</div>
							)}
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Seasonal Insights</CardTitle>
							<CardDescription>
								Key findings and recommendations
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{analyticsData.seasonal.insights.map((insight, index) => (
									<div
										key={index}
										className={`border-l-4 ${getInsightBorderColor(insight.color)} py-1 pl-4`}
									>
										<h3 className="font-medium">{insight.title}</h3>
										<p className="text-muted-foreground text-sm">
											{insight.description}
										</p>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
