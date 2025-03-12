import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card';
import {
	AlertTriangleIcon,
	CircleCheck,
	FlaskRound,
	Package,
	ShoppingCart,
	TimerIcon
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import DashboardStatCard from '@/components/dashboard/stat-card';

export default async function DashboardPage() {
	const session = await getServerSession(authOptions);

	if (!session) {
		redirect('/login');
	}

	// Get counts and stats
	const batchesCount = await db.batch.count();
	const recipeCount = await db.recipe.count();
	const salesCount = await db.salesOrder.count();
	const inventoryCount = await db.inventoryItem.count();

	// Get low inventory items
	const lowInventory = await db.inventoryItem.findMany({
		where: {
			quantity: {
				lt: db.inventoryItem.fields.reorderLevel
			}
		},
		take: 5,
		orderBy: {
			quantity: 'asc'
		}
	});

	// Get recent batches
	const recentBatches = await db.batch.findMany({
		take: 5,
		orderBy: {
			productionDate: 'desc'
		},
		include: {
			recipe: true
		}
	});

	// Get upcoming expirations
	const upcomingExpirations = await db.batch.findMany({
		where: {
			expiryDate: {
				lt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
				gt: new Date() // Not expired yet
			},
			status: {
				not: 'expired'
			}
		},
		orderBy: {
			expiryDate: 'asc'
		},
		take: 5,
		include: {
			recipe: true
		}
	});

	// Get recent sales
	const recentSales = await db.salesOrder.findMany({
		take: 5,
		orderBy: {
			orderDate: 'desc'
		}
	});

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold">Dashboard</h1>
				<p className="text-gray-500">
					Welcome back, {session.user.name || session.user.email}
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<DashboardStatCard
					title="Total Batches"
					value={batchesCount.toString()}
					description="All-time batches created"
					icon={<FlaskRound className="h-5 w-5 text-blue-600" />}
				/>
				<DashboardStatCard
					title="Recipes"
					value={recipeCount.toString()}
					description="Available yoghurt recipes"
					icon={<CircleCheck className="h-5 w-5 text-green-600" />}
				/>
				<DashboardStatCard
					title="Sales Orders"
					value={salesCount.toString()}
					description="Total sales orders"
					icon={<ShoppingCart className="h-5 w-5 text-indigo-600" />}
				/>
				<DashboardStatCard
					title="Inventory Items"
					value={inventoryCount.toString()}
					description="Materials in inventory"
					icon={<Package className="h-5 w-5 text-amber-600" />}
				/>
			</div>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{/* Recent Production Batches */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center">
							<FlaskRound className="mr-2 h-5 w-5 text-blue-600" />
							Recent Production Batches
						</CardTitle>
						<CardDescription>Latest yoghurt batches produced</CardDescription>
					</CardHeader>
					<CardContent>
						<ul className="space-y-4">
							{recentBatches.length > 0 ? (
								recentBatches.map((batch) => (
									<li
										key={batch.id}
										className="flex items-center justify-between border-b pb-2"
									>
										<div>
											<p className="font-medium">{batch.batchNumber}</p>
											<p className="text-sm text-gray-500">
												{batch.recipe.name}
											</p>
										</div>
										<span
											className={`rounded-full px-2 py-1 text-xs ${
												batch.status === 'completed'
													? 'bg-green-100 text-green-800'
													: batch.status === 'in-production'
														? 'bg-blue-100 text-blue-800'
														: 'bg-gray-100 text-gray-800'
											}`}
										>
											{batch.status}
										</span>
									</li>
								))
							) : (
								<p className="text-gray-500">No recent batches found.</p>
							)}
						</ul>
					</CardContent>
				</Card>

				{/* Upcoming Expirations */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center">
							<TimerIcon className="mr-2 h-5 w-5 text-amber-600" />
							Upcoming Expirations
						</CardTitle>
						<CardDescription>Batches expiring soon</CardDescription>
					</CardHeader>
					<CardContent>
						<ul className="space-y-4">
							{upcomingExpirations.length > 0 ? (
								upcomingExpirations.map((batch) => (
									<li
										key={batch.id}
										className="flex items-center justify-between border-b pb-2"
									>
										<div>
											<p className="font-medium">{batch.batchNumber}</p>
											<p className="text-sm text-gray-500">
												{batch.recipe.name}
											</p>
										</div>
										<div className="text-right">
											<p className="font-medium text-amber-600">
												Expires{' '}
												{formatDistanceToNow(new Date(batch.expiryDate), {
													addSuffix: true
												})}
											</p>
										</div>
									</li>
								))
							) : (
								<p className="text-gray-500">No upcoming expirations.</p>
							)}
						</ul>
					</CardContent>
				</Card>

				{/* Low Inventory */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center">
							<AlertTriangleIcon className="mr-2 h-5 w-5 text-red-600" />
							Low Inventory
						</CardTitle>
						<CardDescription>Items that need restocking</CardDescription>
					</CardHeader>
					<CardContent>
						<ul className="space-y-4">
							{lowInventory.length > 0 ? (
								lowInventory.map((item) => (
									<li
										key={item.id}
										className="flex items-center justify-between border-b pb-2"
									>
										<div>
											<p className="font-medium">{item.name}</p>
											<p className="text-sm text-gray-500">{item.type}</p>
										</div>
										<div className="text-right">
											<p className="font-medium text-red-600">
												{item.quantity} {item.unit}
											</p>
											<p className="text-xs text-gray-500">
												Reorder at: {item.reorderLevel} {item.unit}
											</p>
										</div>
									</li>
								))
							) : (
								<p className="text-gray-500">No low inventory items.</p>
							)}
						</ul>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
