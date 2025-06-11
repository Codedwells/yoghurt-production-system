'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
	CardFooter
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
	DialogClose
} from '@/components/ui/dialog';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AdminHeader from '@/components/admin/AdminHeader';
import AiSuggestions from '@/components/admin/AiSuggestions';
import {
	AlertCircle,
	ArrowLeft,
	CheckCircle2,
	Clock,
	ClipboardList,
	Beaker,
	Users,
	CalendarRange
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ProductionDetail {
	id: string;
	batchNumber: string;
	productName: string;
	// For active productions
	progress?: number;
	stage?: string;
	startTime?: string;
	estimatedCompletion?: string;
	status: string;
	assigned?: string;
	schedule?: any;
	// For completed productions
	completionDate?: string;
	outputQuality?: string;
	qualityMetrics?: Array<{
		id: string;
		parameter: string;
		value: number;
		notes?: string | null;
	}>;
	// Common fields
	milkQuantity: string;
	recipeAdditives: Array<{
		id: string;
		quantity: number;
		unit: string;
		additiveId: string;
		additive: {
			id: string;
			name: string;
			description?: string | null;
		};
	}>;
	additives: Array<{
		id: string;
		quantity: number;
		unit: string;
		additive: {
			id: string;
			name: string;
			description?: string | null;
		};
	}>;
	notes: string;
	createdBy?: string;
	creationDate?: string;
	expiryDate?: string;
}

export default function ProductionDetailPage() {
	const params = useParams();
	const router = useRouter();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [production, setProduction] = useState<ProductionDetail | null>(null);
	const [error, setError] = useState<string | null>(null);

	// Determine if the production is completed or active
	const isCompleted = production?.status === 'completed';

	useEffect(() => {
		if (params.id) {
			fetchProductionDetails(params.id as string);
		}
	}, [params.id]);

	async function fetchProductionDetails(id: string) {
		setIsLoading(true);
		try {
			const response = await fetch(`/api/admin/production/${id}`);
			if (!response.ok) {
				if (response.status === 404) {
					throw new Error('Production data not found');
				}
				throw new Error('Failed to fetch production details');
			}
			const data = await response.json();
			setProduction(data);
		} catch (error) {
			console.error('Error fetching production details:', error);
			setError((error as Error).message);
			toast.error((error as Error).message);
		} finally {
			setIsLoading(false);
		}
	}

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

	const goBack = () => {
		router.back();
	};

	if (isLoading) {
		return (
			<div className="flex-1 space-y-4 p-8 pt-6">
				<div className="flex items-center space-x-2">
					<Button variant="outline" size="sm" onClick={goBack}>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back
					</Button>
					<AdminHeader title="Production Details" />
				</div>
				<div className="flex h-64 items-center justify-center">
					<p>Loading production details...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex-1 space-y-4 p-8 pt-6">
				<div className="flex items-center space-x-2">
					<Button variant="outline" size="sm" onClick={goBack}>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back
					</Button>
					<AdminHeader title="Production Details" />
				</div>
				<Card>
					<CardContent className="flex h-64 items-center justify-center">
						<p className="text-red-500">{error}</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="flex-1 space-y-4 p-8 pt-6">
			<div className="flex items-center space-x-2">
				<Button variant="outline" size="sm" onClick={goBack}>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back
				</Button>
				<AdminHeader
					title={`${isCompleted ? 'Completed' : 'Active'} Production`}
				/>
			</div>

			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle>{production?.productName}</CardTitle>
						<Badge className={cn(getStatusColor(production?.status || ''))}>
							<div className="flex items-center gap-1">
								{getStatusIcon(production?.status || '')}
								<span className="capitalize">{production?.status}</span>
							</div>
						</Badge>
					</div>
					<CardDescription>
						{isCompleted
							? `Completed on ${production?.completionDate}`
							: `Started at ${production?.startTime} • Assigned to ${production?.assigned}`}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{!isCompleted && (
						<div className="space-y-2">
							<div className="mb-1 flex justify-between text-sm">
								<span>Current stage: {production?.stage}</span>
								<span>{production?.progress}% complete</span>
							</div>
							<Progress value={production?.progress} className="h-2" />
							<p className="text-muted-foreground text-sm">
								Estimated completion: {production?.estimatedCompletion}
							</p>
						</div>
					)}

					<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
						<div>
							<p className="text-sm font-medium">Batch Number</p>
							<p className="text-muted-foreground">{production?.batchNumber}</p>
						</div>
						<div>
							<p className="text-sm font-medium">Milk Quantity</p>
							<p className="text-muted-foreground">
								{production?.milkQuantity}
							</p>
						</div>
						{isCompleted ? (
							<div>
								<p className="text-sm font-medium">Output Quality</p>
								<p className="text-muted-foreground">
									{production?.outputQuality}
								</p>
							</div>
						) : (
							<div>
								<p className="text-sm font-medium">Assigned To</p>
								<p className="text-muted-foreground">{production?.assigned}</p>
							</div>
						)}
					</div>

					<Separator />

					<div>
						<p className="text-sm font-medium">Notes</p>
						<p className="text-muted-foreground">{production?.notes}</p>
					</div>
				</CardContent>
				{!isCompleted && (
					<CardFooter className="bg-muted/50 flex justify-end gap-2">
						<Dialog>
							<DialogTrigger asChild>
								<Button>Mark as Complete</Button>
							</DialogTrigger>
							<DialogContent className="sm:max-w-[425px]">
								<DialogHeader>
									<DialogTitle>Complete Production</DialogTitle>
									<DialogDescription>
										Are you sure you want to mark this production as complete?
									</DialogDescription>
								</DialogHeader>
								<div className="grid gap-4 py-4">
									<div className="grid grid-cols-4 items-center gap-4">
										<Label htmlFor="complete-notes" className="text-right">
											Notes
										</Label>
										<Textarea
											id="complete-notes"
											placeholder="Add final notes about the production"
											className="col-span-3"
											defaultValue={production?.notes || ''}
										/>
									</div>
								</div>
								<DialogFooter>
									<DialogClose asChild>
										<Button variant="secondary">Cancel</Button>
									</DialogClose>
									<Button
										onClick={async () => {
											try {
												const notesElement = document.getElementById(
													'complete-notes'
												) as HTMLTextAreaElement;
												const notes = notesElement?.value || '';

												if (!production?.id) {
													throw new Error('Production ID is missing');
												}

												console.log('Completing production', {
													id: production.id,
													notes
												});

												const response = await fetch(
													`/api/admin/production/${production.id}/progress`,
													{
														method: 'PATCH',
														headers: {
															'Content-Type': 'application/json'
														},
														body: JSON.stringify({ isCompleted: true, notes })
													}
												);

												if (!response.ok) {
													const errorData = await response.json();
													throw new Error(
														errorData.error || 'Failed to complete production'
													);
												}

												toast.success(
													'Production marked as complete successfully'
												);
												fetchProductionDetails(params.id as string);
											} catch (error) {
												console.error('Error completing production:', error);
												toast.error(
													(error as Error).message ||
														'Failed to mark production as complete'
												);
											}
										}}
										className="bg-green-600 hover:bg-green-700"
									>
										Complete Production
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</CardFooter>
				)}
			</Card>

			{/* AI Suggestions section - needs batch ID */}
			<div className="mt-4">
				{/* 
					Note: This assumes the API will be modified to look up batches by batchNumber 
					or that the production API returns the actual batch ID
				*/}
				{production?.id && <AiSuggestions batchId={production.id} />}
			</div>

			{/* Print and Export buttons removed */}
		</div>
	);
}
