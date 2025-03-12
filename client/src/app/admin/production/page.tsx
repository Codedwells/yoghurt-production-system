'use client';

import { useState, useEffect } from 'react';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AdminHeader from '@/components/admin/AdminHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	AlertCircle,
	ArrowUpRight,
	CheckCircle2,
	Clock,
	PackageOpen,
	RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ProductionStats {
	activeCount: number;
	avgCompletion: number;
	onTimeRate: number;
	qualityRating: number;
}

interface ActiveProduction {
	id: string;
	name: string;
	progress: number;
	stage: string;
	startTime: string;
	estimatedCompletion: string;
	status: string;
	assigned: string;
}

interface CompletedProduction {
	id: string;
	name: string;
	completionDate: string;
	status: string;
	outputQuality: string;
	notes: string;
}

export default function ProductionPage() {
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [productionStats, setProductionStats] = useState<ProductionStats>({
		activeCount: 0,
		avgCompletion: 0,
		onTimeRate: 0,
		qualityRating: 0
	});
	const [activeProduction, setActiveProduction] = useState<ActiveProduction[]>(
		[]
	);
	const [completedProduction, setCompletedProduction] = useState<
		CompletedProduction[]
	>([]);

	useEffect(() => {
		fetchProductionData();
	}, []);

	const fetchProductionData = async () => {
		setIsLoading(true);
		try {
			const [statsResponse, activeResponse, completedResponse] =
				await Promise.all([
					fetch('/api/admin/production/stats'),
					fetch('/api/admin/production?status=active'),
					fetch('/api/admin/production?status=completed')
				]);

			if (!statsResponse.ok || !activeResponse.ok || !completedResponse.ok) {
				throw new Error('Failed to fetch production data');
			}

			const stats = await statsResponse.json();
			const active = await activeResponse.json();
			const completed = await completedResponse.json();

			setProductionStats(stats);
			setActiveProduction(active);
			setCompletedProduction(completed);
		} catch (error) {
			console.error('Error fetching production data:', error);
			toast.error('Failed to load production data');
		} finally {
			setIsLoading(false);
		}
	};

	const handleRefresh = () => {
		toast.info('Refreshing production data...');
		fetchProductionData();
	};

	const getStatusColor = (status: string): string => {
		switch (status) {
			case 'on-track':
				return 'bg-green-100 text-green-800';
			case 'delayed':
				return 'bg-yellow-100 text-yellow-800';
			case 'critical':
				return 'bg-red-100 text-red-800';
			case 'completed':
				return 'bg-blue-100 text-blue-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case 'on-track':
				return <CheckCircle2 className="h-4 w-4 text-green-600" />;
			case 'delayed':
				return <Clock className="h-4 w-4 text-yellow-600" />;
			case 'critical':
				return <AlertCircle className="h-4 w-4 text-red-600" />;
			case 'completed':
				return <CheckCircle2 className="h-4 w-4 text-blue-600" />;
			default:
				return null;
		}
	};

	return (
		<div className="flex-1 space-y-4 p-8 pt-6">
			<div className="flex items-center justify-between">
				<AdminHeader title="Production Management" />
				<Button variant="outline" size="sm" onClick={handleRefresh}>
					<RefreshCw className="mr-2 h-4 w-4" />
					Refresh Data
				</Button>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Active Productions
						</CardTitle>
						<PackageOpen className="text-muted-foreground h-4 w-4" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{isLoading ? '...' : productionStats.activeCount}
						</div>
						<p className="text-muted-foreground text-xs">
							Productions in progress
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Average Completion
						</CardTitle>
						<ArrowUpRight className="text-muted-foreground h-4 w-4" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{isLoading ? '...' : productionStats.avgCompletion}%
						</div>
						<p className="text-muted-foreground text-xs">+2% from last week</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							On-Time Production
						</CardTitle>
						<Clock className="text-muted-foreground h-4 w-4" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{isLoading ? '...' : productionStats.onTimeRate}%
						</div>
						<p className="text-muted-foreground text-xs">-3% from last month</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Quality Rating
						</CardTitle>
						<CheckCircle2 className="text-muted-foreground h-4 w-4" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{isLoading ? '...' : productionStats.qualityRating.toFixed(1)}/5
						</div>
						<p className="text-muted-foreground text-xs">
							Based on quality assessments
						</p>
					</CardContent>
				</Card>
			</div>

			<Tabs defaultValue="active">
				<TabsList>
					<TabsTrigger value="active">Active Production</TabsTrigger>
					<TabsTrigger value="completed">Completed</TabsTrigger>
				</TabsList>

				<TabsContent value="active" className="space-y-4">
					{isLoading ? (
						<Card>
							<CardContent className="flex h-40 items-center justify-center">
								<p>Loading production data...</p>
							</CardContent>
						</Card>
					) : activeProduction.length === 0 ? (
						<Card>
							<CardContent className="flex h-40 items-center justify-center">
								<p>No active production batches found</p>
							</CardContent>
						</Card>
					) : (
						activeProduction.map((item) => (
							<Card key={item.id}>
								<CardHeader>
									<div className="flex items-center justify-between">
										<CardTitle>{item.name}</CardTitle>
										<Badge className={cn(getStatusColor(item.status))}>
											<div className="flex items-center gap-1">
												{getStatusIcon(item.status)}
												<span className="capitalize">{item.status}</span>
											</div>
										</Badge>
									</div>
									<CardDescription>
										Started at {item.startTime} • Assigned to {item.assigned}
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div>
											<div className="mb-1 flex justify-between text-sm">
												<span>Current stage: {item.stage}</span>
												<span>{item.progress}% complete</span>
											</div>
											<Progress value={item.progress} className="h-2" />
										</div>

										<div className="flex items-center justify-between">
											<div className="text-muted-foreground text-sm">
												Estimated completion: {item.estimatedCompletion}
											</div>
											<Button variant="outline" size="sm">
												View Details
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						))
					)}
				</TabsContent>

				<TabsContent value="completed" className="space-y-4">
					{isLoading ? (
						<Card>
							<CardContent className="flex h-40 items-center justify-center">
								<p>Loading completed production data...</p>
							</CardContent>
						</Card>
					) : completedProduction.length === 0 ? (
						<Card>
							<CardContent className="flex h-40 items-center justify-center">
								<p>No completed production batches found</p>
							</CardContent>
						</Card>
					) : (
						completedProduction.map((item) => (
							<Card key={item.id}>
								<CardHeader>
									<div className="flex items-center justify-between">
										<CardTitle>{item.name}</CardTitle>
										<Badge className={cn(getStatusColor(item.status))}>
											<div className="flex items-center gap-1">
												{getStatusIcon(item.status)}
												<span className="capitalize">{item.status}</span>
											</div>
										</Badge>
									</div>
									<CardDescription>
										Completed on {item.completionDate}
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div className="grid grid-cols-2 gap-4">
											<div>
												<p className="text-sm font-medium">Output Quality</p>
												<p className="text-muted-foreground text-sm">
													{item.outputQuality}
												</p>
											</div>
											<div>
												<p className="text-sm font-medium">Notes</p>
												<p className="text-muted-foreground text-sm">
													{item.notes}
												</p>
											</div>
										</div>

										<div className="flex justify-end">
											<Button variant="outline" size="sm">
												View Report
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						))
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
}
