'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminHeader from '@/components/admin/AdminHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, LineChart, Users, Settings, Boxes } from 'lucide-react';

export default function AdminDashboardPage() {
	const [stats, setStats] = useState({
		userCount: 0,
		batchCount: 0,
		recipeCount: 0,
		salesCount: 0,
		settingsCount: 0
	});
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchStats = async () => {
			setIsLoading(true);
			try {
				const response = await fetch('/api/admin/stats');
				if (response.ok) {
					const data = await response.json();
					setStats(data);
				}
			} catch (error) {
				console.error('Error fetching admin stats:', error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchStats();
	}, []);

	return (
		<div className="space-y-6 p-6">
			<AdminHeader title="Admin Dashboard" />

			<Tabs defaultValue="overview" className="space-y-4">
				<TabsList>
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="activity">Recent Activity</TabsTrigger>
				</TabsList>
				<TabsContent value="overview" className="space-y-4">
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Total Users
								</CardTitle>
								<Users className="text-muted-foreground h-4 w-4" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{isLoading ? 'Loading...' : stats.userCount}
								</div>
								<p className="text-muted-foreground text-xs">
									Registered user accounts
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Production Batches
								</CardTitle>
								<Boxes className="text-muted-foreground h-4 w-4" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{isLoading ? 'Loading...' : stats.batchCount}
								</div>
								<p className="text-muted-foreground text-xs">
									Total yoghurt batches
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Recipes</CardTitle>
								<LineChart className="text-muted-foreground h-4 w-4" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{isLoading ? 'Loading...' : stats.recipeCount}
								</div>
								<p className="text-muted-foreground text-xs">
									Available production recipes
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									System Settings
								</CardTitle>
								<Settings className="text-muted-foreground h-4 w-4" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{isLoading ? 'Loading...' : stats.settingsCount}
								</div>
								<p className="text-muted-foreground text-xs">
									Configured system settings
								</p>
							</CardContent>
						</Card>
					</div>

					<Card className="col-span-4">
						<CardHeader>
							<CardTitle>System Health</CardTitle>
						</CardHeader>
						<CardContent className="pl-2">
							<div className="space-y-4">
								<div className="flex items-center">
									<div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
									<span className="mr-4 font-medium">Database</span>
									<span className="text-muted-foreground">Connected</span>
								</div>
								<div className="flex items-center">
									<div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
									<span className="mr-4 font-medium">API Services</span>
									<span className="text-muted-foreground">All operational</span>
								</div>
								<div className="flex items-center">
									<div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
									<span className="mr-4 font-medium">Storage</span>
									<span className="text-muted-foreground">79% available</span>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value="activity">
					<Card>
						<CardHeader>
							<CardTitle>Recent System Activity</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-8">
								<div className="flex">
									<div className="mr-4 w-1 rounded-full bg-blue-500"></div>
									<div className="space-y-1">
										<p className="text-sm leading-none font-medium">
											User Login
										</p>
										<p className="text-muted-foreground text-sm">
											Admin user logged in 5 minutes ago
										</p>
									</div>
								</div>
								<div className="flex">
									<div className="mr-4 w-1 rounded-full bg-green-500"></div>
									<div className="space-y-1">
										<p className="text-sm leading-none font-medium">
											Batch Created
										</p>
										<p className="text-muted-foreground text-sm">
											New production batch YG-2023-112 created 2 hours ago
										</p>
									</div>
								</div>
								<div className="flex">
									<div className="mr-4 w-1 rounded-full bg-yellow-500"></div>
									<div className="space-y-1">
										<p className="text-sm leading-none font-medium">
											Settings Updated
										</p>
										<p className="text-muted-foreground text-sm">
											System setting PRODUCTION_UNITS was changed yesterday
										</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
