'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
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
import AdminHeader from '@/components/admin/AdminHeader';
import { ChevronLeft, Edit, Trash, Clock, Gauge } from 'lucide-react';
import { toast } from 'sonner';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter
} from '@/components/ui/dialog';

interface RecipeAdditive {
	id: string;
	quantity: number;
	unit: string;
	additive: {
		id: string;
		name: string;
		description?: string | null;
	};
}

interface Batch {
	id: string;
	batchNumber: string;
	productionDate: string;
	expiryDate: string;
	status: string;
}

interface Recipe {
	id: string;
	name: string;
	description: string | null;
	instructions: string;
	createdAt: string;
	updatedAt: string;
	recipeAdditives: RecipeAdditive[];
	batches: Batch[];
}

export default function RecipeDetailsPage() {
	const params = useParams();
	const router = useRouter();
	const [recipe, setRecipe] = useState<Recipe | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [dialogOpen, setDialogOpen] = useState(false);

	useEffect(() => {
		if (params.id) {
			fetchRecipeDetails(params.id as string);
		}
	}, [params.id]);

	const fetchRecipeDetails = async (id: string) => {
		setIsLoading(true);
		setError(null); // Reset error state
		try {
			// Show loading toast
			const toastId = toast.loading('Loading recipe details...');

			const response = await fetch(`/api/admin/recipes/${id}`);

			if (!response.ok) {
				// Try to parse error message from response
				let errorMessage = 'Failed to fetch recipe details';
				try {
					const errorData = await response.json();
					errorMessage = errorData.error || errorMessage;
				} catch (e) {
					// If parsing fails, use status-specific message
					if (response.status === 404) {
						errorMessage = 'Recipe not found';
					} else if (response.status === 401) {
						errorMessage = 'Unauthorized. Please log in again.';
					} else if (response.status === 403) {
						errorMessage = 'You do not have permission to view this recipe';
					} else if (response.status >= 500) {
						errorMessage = 'Server error. Please try again later.';
					}
				}

				toast.error(errorMessage, { id: toastId });
				throw new Error(errorMessage);
			}

			const data = await response.json();
			setRecipe(data);
			toast.success('Recipe loaded successfully', { id: toastId });
		} catch (err) {
			console.error('Error fetching recipe details:', err);
			setError((err as Error).message);
			toast.error((err as Error).message);
		} finally {
			setIsLoading(false);
		}
	};

	const handleDeleteRecipe = async () => {
		if (!recipe) return;

		try {
			// First check if the recipe can be deleted (has no associated batches)
			if (recipe.batches && recipe.batches.length > 0) {
				toast.error('Cannot delete a recipe that has associated batches');
				return;
			}

			// Show loading toast
			const toastId = toast.loading('Deleting recipe...');

			const response = await fetch(`/api/admin/recipes/${recipe.id}`, {
				method: 'DELETE'
			});

			if (!response.ok) {
				// Try to parse error message from response
				let errorMessage = 'Failed to delete recipe';
				try {
					const errorData = await response.json();
					errorMessage = errorData.error || errorMessage;
				} catch (e) {
					// If parsing fails, use status-specific message
					if (response.status === 401) {
						errorMessage = 'Unauthorized. Please log in again.';
					} else if (response.status === 403) {
						errorMessage = 'You do not have permission to delete this recipe';
					} else if (response.status === 409) {
						errorMessage = 'Cannot delete a recipe that is in use';
					} else if (response.status >= 500) {
						errorMessage = 'Server error. Please try again later.';
					}
				}

				toast.error(errorMessage, { id: toastId });
				throw new Error(errorMessage);
			}

			toast.success('Recipe deleted successfully', { id: toastId });
			router.push('/admin/recipes');
		} catch (err) {
			console.error('Error deleting recipe:', err);
			toast.error((err as Error).message);
		}
	};

	const formatDate = (dateStr: string) => {
		return new Date(dateStr).toLocaleDateString();
	};

	const goBack = () => {
		router.back();
	};

	if (isLoading) {
		return (
			<div className="container mx-auto p-6">
				<div className="flex items-center space-x-2">
					<Button variant="outline" size="sm" onClick={goBack}>
						<ChevronLeft className="mr-2 h-4 w-4" />
						Back
					</Button>
					<AdminHeader title="Recipe Details" />
				</div>
				<div className="flex h-64 flex-col items-center justify-center gap-4">
					<div className="border-primary h-12 w-12 animate-spin rounded-full border-b-2"></div>
					<p className="text-muted-foreground">Loading recipe details...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="container mx-auto p-6">
				<div className="flex items-center space-x-2">
					<Button variant="outline" size="sm" onClick={goBack}>
						<ChevronLeft className="mr-2 h-4 w-4" />
						Back
					</Button>
					<AdminHeader title="Recipe Details" />
				</div>
				<Card className="border-red-200">
					<CardContent className="flex h-64 flex-col items-center justify-center gap-4">
						<div className="rounded-full bg-red-100 p-3">
							<Trash className="h-6 w-6 text-red-500" />
						</div>
						<div className="text-center">
							<h3 className="mb-2 text-lg font-medium text-red-500">
								Error Loading Recipe
							</h3>
							<p className="max-w-md text-gray-500">{error}</p>
						</div>
						<Button
							variant="outline"
							onClick={() => fetchRecipeDetails(params.id as string)}
						>
							Try Again
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-2">
					<Button variant="outline" size="sm" onClick={goBack}>
						<ChevronLeft className="mr-2 h-4 w-4" />
						Back
					</Button>
					<AdminHeader title={recipe?.name || 'Recipe Details'} />
				</div>
				<div className="flex space-x-2">
					<Button
						onClick={() => router.push(`/admin/recipes/${recipe?.id}/edit`)}
					>
						<Edit className="mr-2 h-4 w-4" />
						Edit Recipe
					</Button>
					<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
						<DialogTrigger asChild>
							<Button variant="destructive" onClick={() => setDialogOpen(true)}>
								<Trash className="mr-2 h-4 w-4" />
								Delete Recipe
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Delete Recipe</DialogTitle>
								<DialogDescription>
									Are you sure you want to delete this recipe?{' '}
									{recipe?.batches.length
										? 'This recipe has associated batches and cannot be deleted.'
										: 'This action cannot be undone.'}
								</DialogDescription>
							</DialogHeader>
							<DialogFooter>
								<Button variant="outline" onClick={() => setDialogOpen(false)}>
									Cancel
								</Button>
								<Button
									variant="destructive"
									onClick={() => {
										handleDeleteRecipe();
										setDialogOpen(false);
									}}
									disabled={recipe?.batches.length ? true : false}
								>
									Delete
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
			</div>

			<div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
				<Card className="md:col-span-2">
					<CardHeader>
						<CardTitle>Recipe Details</CardTitle>
						<CardDescription>
							Last Updated:{' '}
							{recipe?.updatedAt ? formatDate(recipe.updatedAt) : 'N/A'}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div>
							<h3 className="text-lg font-medium">Description</h3>
							<p className="mt-1 text-gray-500">
								{recipe?.description || 'No description provided'}
							</p>
						</div>

						<div>
							<h3 className="text-lg font-medium">Instructions</h3>
							<div className="mt-1 rounded-md bg-gray-50 p-4 whitespace-pre-line text-gray-500">
								{recipe?.instructions || 'No instructions provided'}
							</div>
						</div>

						<div>
							<h3 className="text-lg font-medium">Additives</h3>
							<div className="mt-2">
								{recipe?.recipeAdditives &&
								recipe.recipeAdditives.length > 0 ? (
									<div className="rounded-md border">
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead>Name</TableHead>
													<TableHead>Quantity</TableHead>
													<TableHead>Description</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{recipe.recipeAdditives.map((additive) => (
													<TableRow key={additive.id}>
														<TableCell className="font-medium">
															{additive.additive.name}
														</TableCell>
														<TableCell>
															{additive.quantity} {additive.unit}
														</TableCell>
														<TableCell>
															{additive.additive.description || '-'}
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</div>
								) : (
									<p className="text-gray-500">No additives for this recipe</p>
								)}
							</div>
						</div>
					</CardContent>
				</Card>

				<div className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Recipe Stats</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center">
										<Clock className="mr-2 h-5 w-5 text-gray-400" />
										<span className="text-sm font-medium">Created</span>
									</div>
									<span className="text-right text-sm">
										{recipe?.createdAt ? formatDate(recipe.createdAt) : 'N/A'}
									</span>
								</div>

								<div className="flex items-center justify-between">
									<div className="flex items-center">
										<Gauge className="mr-2 h-5 w-5 text-gray-400" />
										<span className="text-sm font-medium">Batches</span>
									</div>
									<Badge variant="outline">
										{recipe?.batches?.length || 0}
									</Badge>
								</div>

								{recipe?.batches && recipe.batches.length > 0 && (
									<>
										<Separator />
										<div>
											<h4 className="mb-2 text-sm font-medium">
												Total Ingredients Used
											</h4>
											<div className="space-y-1 text-sm">
												{recipe.recipeAdditives &&
													recipe.recipeAdditives.map((additive) => (
														<div
															key={additive.id}
															className="flex items-center justify-between"
														>
															<span className="text-muted-foreground">
																{additive.additive.name}
															</span>
															<span className="font-medium">
																{additive.quantity * recipe.batches.length}{' '}
																{additive.unit}
															</span>
														</div>
													))}
											</div>
										</div>
									</>
								)}
							</div>
						</CardContent>
					</Card>

					{recipe?.batches && recipe.batches.length > 0 ? (
						<Card>
							<CardHeader>
								<CardTitle>Recent Batches</CardTitle>
								<CardDescription>
									Recent productions using this recipe
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-2">
									{recipe.batches.map((batch) => (
										<div
											key={batch.id}
											className="flex items-center justify-between rounded-md border p-3"
										>
											<div>
												<p className="font-medium">{batch.batchNumber}</p>
												<p className="text-sm text-gray-500">
													{formatDate(batch.productionDate)}
												</p>
											</div>
											<Button
												variant="ghost"
												size="sm"
												onClick={() =>
													router.push(`/admin/batches/${batch.id}`)
												}
											>
												View
											</Button>
										</div>
									))}
								</div>
							</CardContent>
							{recipe.batches.length > 5 && (
								<CardFooter>
									<Button
										variant="outline"
										className="w-full"
										onClick={() =>
											router.push(`/admin/batches?recipeId=${recipe.id}`)
										}
									>
										View All Batches
									</Button>
								</CardFooter>
							)}
						</Card>
					) : (
						<Card>
							<CardHeader>
								<CardTitle>New Recipe</CardTitle>
								<CardDescription>
									This recipe hasn&apos;t been used in production yet
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="flex flex-col items-center justify-center space-y-2 p-4 text-center">
									<div className="rounded-full bg-blue-100 p-3">
										<Gauge className="h-6 w-6 text-blue-500" />
									</div>
									<p className="text-muted-foreground text-sm">
										When you create batches using this recipe, they will appear
										here.
									</p>
									<Button
										variant="outline"
										size="sm"
										className="mt-2"
										onClick={() =>
											router.push('/admin/batches/new?recipeId=' + recipe?.id)
										}
									>
										Create First Batch
									</Button>
								</div>
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
}
