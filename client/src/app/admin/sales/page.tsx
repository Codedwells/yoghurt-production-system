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
import { Input } from '@/components/ui/input';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table';
import AdminHeader from '@/components/admin/AdminHeader';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
	DownloadIcon,
	Search,
	ArrowUpRight,
	CreditCard,
	DollarSign,
	TrendingUp,
	RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

interface TopCustomer {
	name: string;
	orders: number;
	totalSpent: number;
	lastOrder: string;
}

interface SalesData {
	revenue: number;
	newOrders: number;
	salesGrowth: number;
	activeCustomers: number;
	topCustomers: TopCustomer[];
}

interface OrderItem {
	packageBatch?: {
		packaging?: {
			name: string;
		};
	};
	quantity: number;
}

interface Order {
	id: string;
	orderNumber?: string;
	customerName?: string;
	customer?: string;
	deliveryDate?: string;
	createdAt?: string;
	date?: string;
	amount?: number | string;
	status: string;
	items?: OrderItem[];
	products?: string;
}

export default function SalesPage() {
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [salesData, setSalesData] = useState<SalesData>({
		revenue: 0,
		newOrders: 0,
		salesGrowth: 0,
		activeCustomers: 0,
		topCustomers: []
	});
	const [orders, setOrders] = useState<Order[]>([]);
	const [searchTerm, setSearchTerm] = useState<string>('');
	const [timeRange, setTimeRange] = useState<string>('week');
	const [statusFilter, setStatusFilter] = useState<string>('all');

	useEffect(() => {
		fetchSalesData();
		fetchOrders();
	}, []);

	async function fetchSalesData() {
		try {
			const response = await fetch(
				`/api/admin/sales/stats?timeRange=${timeRange}`
			);
			if (!response.ok) {
				throw new Error('Failed to fetch sales data');
			}
			const data = await response.json();
			setSalesData(data);
		} catch (error) {
			console.error('Error fetching sales data:', error);
			toast.error('Failed to load sales statistics');
			// Use fallback data
			setSalesData({
				revenue: 45231.89,
				newOrders: 12,
				salesGrowth: 12.5,
				activeCustomers: 24,
				topCustomers: [
					{
						name: 'Walmart',
						orders: 32,
						totalSpent: 124500.0,
						lastOrder: '2023-11-08'
					},
					{
						name: 'Target',
						orders: 28,
						totalSpent: 98320.0,
						lastOrder: '2023-11-06'
					},
					{
						name: 'Kroger',
						orders: 24,
						totalSpent: 87650.0,
						lastOrder: '2023-11-07'
					}
				]
			});
		}
	}

	async function fetchOrders() {
		setIsLoading(true);
		try {
			const response = await fetch('/api/sales');
			if (!response.ok) {
				throw new Error('Failed to fetch orders');
			}
			const data = await response.json();
			setOrders(data);
		} catch (error) {
			console.error('Error fetching orders:', error);
			toast.error('Failed to load orders');
			// Use mock data as fallback
			setOrders([
				{
					id: 'ORD-001',
					customer: 'Walmart',
					date: '2023-11-08',
					amount: '$4,250.00',
					status: 'Delivered',
					products: 'Plain Yogurt (500), Greek Yogurt (250)'
				},
				{
					id: 'ORD-002',
					customer: 'Kroger',
					date: '2023-11-07',
					amount: '$3,120.00',
					status: 'Processing',
					products: 'Strawberry Yogurt (300), Vanilla Yogurt (200)'
				},
				{
					id: 'ORD-003',
					customer: 'Target',
					date: '2023-11-06',
					amount: '$5,800.00',
					status: 'Pending',
					products: 'Greek Yogurt (400), Low-Fat Yogurt (350)'
				}
			]);
		} finally {
			setIsLoading(false);
		}
	}

	const handleRefresh = () => {
		toast.info('Refreshing sales data...');
		fetchSalesData();
		fetchOrders();
	};

	const handleTimeRangeChange = (value: string) => {
		setTimeRange(value);
		fetchSalesData();
	};

	const handleStatusFilterChange = (value: string) => {
		setStatusFilter(value);
	};

	const getFilteredOrders = (): Order[] => {
		let filtered = orders;

		if (searchTerm) {
			filtered = filtered.filter(
				(order) =>
					order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
					(order.customerName || order.customer || '')
						.toLowerCase()
						.includes(searchTerm.toLowerCase())
			);
		}

		if (statusFilter !== 'all') {
			filtered = filtered.filter(
				(order) => order.status?.toLowerCase() === statusFilter.toLowerCase()
			);
		}

		return filtered;
	};

	const getStatusBadge = (status: string | undefined) => {
		const statusMap: Record<string, { class: string; label: string }> = {
			delivered: { class: 'bg-green-100 text-green-800', label: 'Delivered' },
			processing: { class: 'bg-blue-100 text-blue-800', label: 'Processing' },
			pending: { class: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
			cancelled: { class: 'bg-red-100 text-red-800', label: 'Cancelled' }
		};

		const statusKey = status?.toLowerCase() || '';
		const statusInfo = statusMap[statusKey] || {
			class: 'bg-gray-100 text-gray-800',
			label: status || 'Unknown'
		};

		return <Badge className={statusInfo.class}>{statusInfo.label}</Badge>;
	};

	const formatCurrency = (amount: number | string | undefined): string => {
		if (typeof amount === 'number') {
			return new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: 'USD'
			}).format(amount);
		}
		return amount?.toString() || '';
	};

	const filteredOrders = getFilteredOrders();

	return (
		<div className="flex-1 space-y-4 p-8 pt-6">
			<div className="flex items-center justify-between">
				<AdminHeader title="Sales Dashboard" />
				<Button variant="outline" size="sm" onClick={handleRefresh}>
					<RefreshCw className="mr-2 h-4 w-4" />
					Refresh Data
				</Button>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
						<DollarSign className="text-muted-foreground h-4 w-4" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{formatCurrency(salesData.revenue)}
						</div>
						<p className="text-muted-foreground text-xs">
							+20.1% from last month
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">New Orders</CardTitle>
						<CreditCard className="text-muted-foreground h-4 w-4" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">+{salesData.newOrders}</div>
						<p className="text-muted-foreground text-xs">-8% from yesterday</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Sales Growth</CardTitle>
						<ArrowUpRight className="text-muted-foreground h-4 w-4" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">+{salesData.salesGrowth}%</div>
						<p className="text-muted-foreground text-xs">
							Compared to last quarter
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Active Customers
						</CardTitle>
						<TrendingUp className="text-muted-foreground h-4 w-4" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{salesData.activeCustomers}
						</div>
						<p className="text-muted-foreground text-xs">+4 new this month</p>
					</CardContent>
				</Card>
			</div>

			<Tabs defaultValue="overview">
				<TabsList>
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="orders">Orders</TabsTrigger>
				</TabsList>

				<TabsContent value="overview" className="space-y-4">
					<div className="grid gap-4 md:grid-cols-2">
						<Card>
							<CardHeader>
								<div className="flex items-center justify-between">
									<CardTitle>Sales Trend</CardTitle>
									<Select
										value={timeRange}
										onValueChange={handleTimeRangeChange}
									>
										<SelectTrigger className="w-[120px]">
											<SelectValue placeholder="Select Range" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="week">This Week</SelectItem>
											<SelectItem value="month">This Month</SelectItem>
											<SelectItem value="year">This Year</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</CardHeader>
							<CardContent className="h-80">
								<div className="text-muted-foreground flex h-full items-center justify-center">
									Sales chart would appear here
									<br />
									(Requires chart library integration)
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Product Distribution</CardTitle>
								<CardDescription>Sales by product category</CardDescription>
							</CardHeader>
							<CardContent className="h-80">
								<div className="text-muted-foreground flex h-full items-center justify-center">
									Product distribution chart would appear here
									<br />
									(Requires chart library integration)
								</div>
							</CardContent>
						</Card>
					</div>

					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle>Top Customers</CardTitle>
								<Button variant="outline" size="sm">
									<DownloadIcon className="mr-1 h-4 w-4" />
									Export
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Customer</TableHead>
										<TableHead>Orders</TableHead>
										<TableHead>Total Spent</TableHead>
										<TableHead>Last Order</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{salesData.topCustomers?.length > 0 ? (
										salesData.topCustomers.map((customer, index) => (
											<TableRow key={index}>
												<TableCell>{customer.name}</TableCell>
												<TableCell>{customer.orders}</TableCell>
												<TableCell>
													{formatCurrency(customer.totalSpent)}
												</TableCell>
												<TableCell>{customer.lastOrder}</TableCell>
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell colSpan={4} className="text-center">
												No customer data available
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="orders">
					<div className="mb-4 flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Input
								placeholder="Search orders..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="max-w-sm"
							/>
							<Button variant="outline" size="icon">
								<Search className="h-4 w-4" />
							</Button>
						</div>

						<div className="flex items-center gap-2">
							<Select
								value={statusFilter}
								onValueChange={handleStatusFilterChange}
							>
								<SelectTrigger className="w-[150px]">
									<SelectValue placeholder="Filter by status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Statuses</SelectItem>
									<SelectItem value="delivered">Delivered</SelectItem>
									<SelectItem value="processing">Processing</SelectItem>
									<SelectItem value="pending">Pending</SelectItem>
								</SelectContent>
							</Select>

							<Button>
								<DownloadIcon className="mr-1 h-4 w-4" />
								Export
							</Button>
						</div>
					</div>

					<Card>
						<CardContent className="pt-6">
							{isLoading ? (
								<div className="flex h-40 items-center justify-center">
									<p>Loading orders...</p>
								</div>
							) : filteredOrders.length === 0 ? (
								<div className="flex h-40 items-center justify-center">
									<p>No orders found</p>
								</div>
							) : (
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Order ID</TableHead>
											<TableHead>Customer</TableHead>
											<TableHead>Date</TableHead>
											<TableHead>Amount</TableHead>
											<TableHead>Status</TableHead>
											<TableHead>Products</TableHead>
											<TableHead>Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{filteredOrders.map((order) => (
											<TableRow key={order.id}>
												<TableCell className="font-medium">
													{order.orderNumber || order.id}
												</TableCell>
												<TableCell>
													{order.customerName || order.customer}
												</TableCell>
												<TableCell>
													{order.deliveryDate || order.createdAt
														? new Date(
																order.deliveryDate || order.createdAt || ''
															).toLocaleDateString()
														: order.date}
												</TableCell>
												<TableCell>
													{typeof order.amount === 'number'
														? formatCurrency(order.amount)
														: order.amount}
												</TableCell>
												<TableCell>{getStatusBadge(order.status)}</TableCell>
												<TableCell className="max-w-xs truncate">
													{order.items
														?.map(
															(item) =>
																`${item.packageBatch?.packaging?.name || 'Product'} (${item.quantity})`
														)
														.join(', ') || order.products}
												</TableCell>
												<TableCell>
													<Button variant="outline" size="sm">
														View
													</Button>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							)}
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
