'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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
import AdminHeader from '@/components/admin/AdminHeader';
import AiSuggestions from '@/components/admin/AiSuggestions';
import {
	ChevronLeft,
	Calendar,
	ClipboardList,
	Beaker,
	Users
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Define types for our data structures
interface Recipe {
	id: string;
	name: string;
	description?: string | null;
	instructions: string;
}

interface User {
	id: string;
	name: string | null;
	email: string | null;
}

interface BatchAdditive {
	id: string;
	quantity: number;
	unit: string;
	additive: {
		id: string;
		name: string;
		description?: string | null;
	};
}

interface QualityData {
	id: string;
	parameter: string;
	value: number;
	notes?: string | null;
}

interface Batch {
	id: string;
	batchNumber: string;
	recipeId: string;
	recipe?: Recipe;
	productionDate: string;
	expiryDate: string;
	status: string;
	milkQuantity: number;
	milkUnit: string;
	notes?: string | null;
	creator?: User;
	creatorId: string;
	batchAdditives?: BatchAdditive[];
	qualityData?: QualityData[];
	createdAt: string;
}

export default function BatchDetailPage() {
	const params = useParams();
	const router = useRouter();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [batch, setBatch] = useState<Batch | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (params.id) {
			fetchBatchDetails(params.id as string);
		}
	}, [params.id]);

	async function fetchBatchDetails(id: string) {
		setIsLoading(true);
		try {
			const response = await fetch(`/api/batches/${id}`);
			if (!response.ok) {
				if (response.status === 404) {
					throw new Error('Batch not found');
				}
				throw new Error('Failed to fetch batch details');
			}
			const data = await response.json();
			setBatch(data);
		} catch (error) {
			console.error('Error fetching batch details:', error);
			setError((error as Error).message);
			toast.error((error as Error).message);
		} finally {
			setIsLoading(false);
		}
	}

	const getStatusColor = (status: string | undefined): string => {
		switch (status?.toLowerCase()) {
			case 'completed':
				return 'bg-green-100 text-green-800';
			case 'in progress':
			case 'processing':
				return 'bg-blue-100 text-blue-800';
			case 'pending':
				return 'bg-yellow-100 text-yellow-800';
			case 'cancelled':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
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
						<ChevronLeft className="mr-2 h-4 w-4" />
						Back
					</Button>
					<AdminHeader title="Batch Details" />
				</div>
				<div className="flex h-64 items-center justify-center">
					<p>Loading batch details...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex-1 space-y-4 p-8 pt-6">
				<div className="flex items-center space-x-2">
					<Button variant="outline" size="sm" onClick={goBack}>
						<ChevronLeft className="mr-2 h-4 w-4" />
						Back
					</Button>
					<AdminHeader title="Batch Details" />
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
					<ChevronLeft className="mr-2 h-4 w-4" />
					Back
				</Button>
				<AdminHeader title={`Batch: ${batch?.batchNumber}`} />
			</div>

			<div className="grid gap-4 md:grid-cols-5">
				<Card className="md:col-span-3">
					<CardHeader>
						<div className="flex items-center justify-between">
							<CardTitle>Batch Information</CardTitle>
							<Badge className={cn(getStatusColor(batch?.status))}>
								{batch?.status || 'Unknown'}
							</Badge>
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<p className="text-sm font-medium">Batch Number</p>
								<p className="text-muted-foreground">{batch?.batchNumber}</p>
							</div>
							<div>
								<p className="text-sm font-medium">Product</p>
								<p className="text-muted-foreground">{batch?.recipe?.name}</p>
							</div>
							<div>
								<p className="text-sm font-medium">Quantity</p>
								<p className="text-muted-foreground">
									{batch?.milkQuantity} {batch?.milkUnit}
								</p>
							</div>
							<div>
								<p className="text-sm font-medium">Created By</p>
								<p className="text-muted-foreground">{batch?.creator?.name}</p>
							</div>
							<div>
								<p className="text-sm font-medium">Creation Date</p>
								<p className="text-muted-foreground">
									{batch?.createdAt
										? new Date(batch?.createdAt).toLocaleDateString()
										: 'N/A'}
								</p>
							</div>
							<div>
								<p className="text-sm font-medium">Expiry Date</p>
								<p className="text-muted-foreground">
									{batch?.expiryDate
										? new Date(batch?.expiryDate).toLocaleDateString()
										: 'N/A'}
								</p>
							</div>
						</div>

						<Separator />

						<div>
							<p className="text-sm font-medium">Notes</p>
							<p className="text-muted-foreground">
								{batch?.notes || 'No notes'}
							</p>
						</div>
					</CardContent>
				</Card>

				<Card className="md:col-span-2">
					<CardHeader>
						<CardTitle>Recipe Information</CardTitle>
						<CardDescription>Details of the recipe used</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<p className="text-sm font-medium">Recipe Name</p>
							<p className="text-muted-foreground">{batch?.recipe?.name}</p>
						</div>

						<div>
							<p className="text-sm font-medium">Description</p>
							<p className="text-muted-foreground">
								{batch?.recipe?.description || 'No description'}
							</p>
						</div>

						<Button
							variant="outline"
							className="w-full"
							onClick={() => router.push(`/admin/recipes/${batch?.recipeId}`)}
						>
							View Full Recipe
						</Button>
					</CardContent>
				</Card>
			</div>

			<div className="mt-4">
				<AiSuggestions batchId={batch?.id as string} />
			</div>

			<div className="mt-4 flex justify-end gap-2">
				{batch?.status !== 'completed' && (
					<Dialog>
						<DialogTrigger asChild>
							<Button>Update Status</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[425px]">
							<DialogHeader>
								<DialogTitle>Update Batch Status</DialogTitle>
								<DialogDescription>
									Change the current status of this batch.
								</DialogDescription>
							</DialogHeader>
							<div className="grid gap-4 py-4">
								<div className="grid grid-cols-4 items-center gap-4">
									<Label htmlFor="status" className="text-right">
										Status
									</Label>
									<Select
										defaultValue={batch?.status}
										onValueChange={async (value) => {
											try {
												const response = await fetch(
													`/api/batches/${batch?.id}/status`,
													{
														method: 'PATCH',
														headers: {
															'Content-Type': 'application/json'
														},
														body: JSON.stringify({ status: value })
													}
												);

												if (!response.ok) {
													throw new Error('Failed to update batch status');
												}

												toast.success('Batch status updated successfully');
												fetchBatchDetails(batch?.id as string);
											} catch (error) {
												console.error('Error updating batch status:', error);
												toast.error('Failed to update batch status');
											}
										}}
									>
										<SelectTrigger className="col-span-3">
											<SelectValue placeholder="Select status" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="pending">Pending</SelectItem>
											<SelectItem value="in-production">
												In Production
											</SelectItem>
											<SelectItem value="processing">Processing</SelectItem>
											<SelectItem value="completed">Completed</SelectItem>
											<SelectItem value="cancelled">Cancelled</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
							<DialogFooter>
								<DialogClose asChild>
									<Button variant="secondary">Close</Button>
								</DialogClose>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				)}
			</div>
		</div>
	);
}
