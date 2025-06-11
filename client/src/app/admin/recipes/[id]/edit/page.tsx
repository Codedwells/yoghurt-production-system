'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft, Save, Plus, Trash } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import { toast } from 'sonner';

interface Additive {
	id: string;
	name: string;
	description: string | null;
	type: string;
}

interface RecipeAdditive {
	id?: string;
	additiveId: string;
	quantity: number;
	unit: string;
	additive?: {
		id: string;
		name: string;
		description?: string | null;
	};
}

interface Recipe {
	id: string;
	name: string;
	description: string | null;
	instructions: string;
	recipeAdditives: RecipeAdditive[];
}

export default function EditRecipePage() {
	const router = useRouter();
	const params = useParams();
	const isEditMode = Boolean(params.id);

	const [additives, setAdditives] = useState<Additive[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [formValues, setFormValues] = useState<{
		name: string;
		description: string;
		instructions: string;
		additives: RecipeAdditive[];
	}>({
		name: '',
		description: '',
		instructions: '',
		additives: []
	});

	useEffect(() => {
		fetchAdditives();
		if (isEditMode) {
			fetchRecipeDetails(params.id as string);
		} else {
			setIsLoading(false);
		}
	}, [params.id, isEditMode]);

	const fetchAdditives = async () => {
		try {
			const response = await fetch('/api/admin/additives');
			if (response.ok) {
				const data = await response.json();
				setAdditives(data);
			}
		} catch (error) {
			console.error('Failed to fetch additives:', error);
			toast.error('Failed to load additives');
		}
	};

	const fetchRecipeDetails = async (id: string) => {
		setIsLoading(true);
		try {
			// Show loading toast
			const toastId = toast.loading('Loading recipe data...');

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
						errorMessage = 'You do not have permission to edit this recipe';
					} else if (response.status >= 500) {
						errorMessage = 'Server error. Please try again later.';
					}
				}

				toast.error(errorMessage, { id: toastId });
				throw new Error(errorMessage);
			}

			const data: Recipe = await response.json();
			setFormValues({
				name: data.name,
				description: data.description || '',
				instructions: data.instructions,
				additives: data.recipeAdditives.map((additive) => ({
					additiveId: additive.additiveId || additive.additive?.id || '',
					quantity: additive.quantity,
					unit: additive.unit
				}))
			});
			toast.success('Recipe loaded successfully', { id: toastId });
		} catch (err) {
			console.error('Error fetching recipe details:', err);
			toast.error((err as Error).message);
			router.push('/admin/recipes');
		} finally {
			setIsLoading(false);
		}
	};

	const handleChange = (field: string, value: string) => {
		setFormValues((prev) => ({
			...prev,
			[field]: value
		}));
	};

	const handleAdditiveChange = (
		index: number,
		field: string,
		value: string | number
	) => {
		setFormValues((prev) => {
			const updatedAdditives = [...prev.additives];
			updatedAdditives[index] = {
				...updatedAdditives[index],
				[field]: value
			};
			return {
				...prev,
				additives: updatedAdditives
			};
		});
	};

	const addAdditive = () => {
		setFormValues((prev) => ({
			...prev,
			additives: [...prev.additives, { additiveId: '', quantity: 0, unit: 'g' }]
		}));
	};

	const removeAdditive = (index: number) => {
		setFormValues((prev) => ({
			...prev,
			additives: prev.additives.filter((_, i) => i !== index)
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Form validation
		const validationErrors = [];

		if (!formValues.name.trim()) {
			validationErrors.push('Recipe name is required');
		}

		if (!formValues.instructions.trim()) {
			validationErrors.push('Instructions are required');
		}

		const invalidAdditives = formValues.additives.filter((a) => !a.additiveId);
		if (invalidAdditives.length > 0) {
			validationErrors.push(
				'Please select an additive for each entry or remove it'
			);
		}

		const invalidQuantities = formValues.additives.filter(
			(a) => Number(a.quantity) <= 0
		);
		if (invalidQuantities.length > 0) {
			validationErrors.push(
				'All additives must have a quantity greater than 0'
			);
		}

		if (validationErrors.length > 0) {
			validationErrors.forEach((error) => toast.error(error));
			return;
		}

		// Proceed with form submission
		setIsSaving(true);
		const toastId = toast.loading(
			`${isEditMode ? 'Updating' : 'Creating'} recipe...`
		);

		try {
			const endpoint = isEditMode
				? `/api/admin/recipes/${params.id}`
				: '/api/admin/recipes';

			const method = isEditMode ? 'PUT' : 'POST';

			const response = await fetch(endpoint, {
				method,
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: formValues.name.trim(),
					description: formValues.description.trim(),
					instructions: formValues.instructions.trim(),
					additives: formValues.additives.map((a) => ({
						additiveId: a.additiveId,
						quantity: Number(a.quantity),
						unit: a.unit
					}))
				})
			});

			if (!response.ok) {
				// Try to parse error message from response
				let errorMessage = `Failed to ${isEditMode ? 'update' : 'create'} recipe`;
				try {
					const errorData = await response.json();
					errorMessage = errorData.error || errorMessage;
				} catch (e) {
					// If parsing fails, use status-specific message
					if (response.status === 401) {
						errorMessage = 'Unauthorized. Please log in again.';
					} else if (response.status === 403) {
						errorMessage = 'You do not have permission to modify recipes';
					} else if (response.status === 400) {
						errorMessage = 'Invalid recipe data. Please check your inputs.';
					} else if (response.status >= 500) {
						errorMessage = 'Server error. Please try again later.';
					}
				}

				toast.error(errorMessage, { id: toastId });
				throw new Error(errorMessage);
			}

			const data = await response.json();
			toast.success(
				`Recipe ${isEditMode ? 'updated' : 'created'} successfully`,
				{ id: toastId }
			);
			router.push(`/admin/recipes/${data.id}`);
		} catch (err) {
			console.error('Error saving recipe:', err);
			toast.error((err as Error).message);
		} finally {
			setIsSaving(false);
		}
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
					<AdminHeader title={isEditMode ? 'Edit Recipe' : 'Create Recipe'} />
				</div>
				<div className="flex h-64 flex-col items-center justify-center gap-4">
					<div className="border-primary h-12 w-12 animate-spin rounded-full border-b-2"></div>
					<p className="text-muted-foreground">Loading recipe data...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-6">
			<div className="flex items-center space-x-2">
				<Button variant="outline" size="sm" onClick={goBack}>
					<ChevronLeft className="mr-2 h-4 w-4" />
					Back
				</Button>
				<AdminHeader
					title={isEditMode ? `Edit ${formValues.name}` : 'Create New Recipe'}
				/>
			</div>

			<form onSubmit={handleSubmit} className="mt-6 space-y-6">
				<Card>
					<CardHeader>
						<CardTitle>Recipe Information</CardTitle>
						<p className="text-muted-foreground text-sm">
							Fields marked with <span className="text-red-500">*</span> are
							required
						</p>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid w-full gap-4">
							<div className="space-y-2">
								<Label htmlFor="name">
									Recipe Name <span className="text-red-500">*</span>
								</Label>
								<Input
									id="name"
									placeholder="Enter recipe name"
									value={formValues.name}
									onChange={(e) => handleChange('name', e.target.value)}
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="description">Description (Optional)</Label>
								<Textarea
									id="description"
									placeholder="Provide a brief description of the recipe"
									value={formValues.description}
									onChange={(e) => handleChange('description', e.target.value)}
									rows={3}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="instructions">
									Instructions <span className="text-red-500">*</span>
								</Label>
								<Textarea
									id="instructions"
									placeholder="Enter detailed preparation instructions"
									value={formValues.instructions}
									onChange={(e) => handleChange('instructions', e.target.value)}
									rows={6}
									required
								/>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Recipe Additives</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						{formValues.additives.length === 0 ? (
							<div className="rounded-md bg-gray-50 p-4 text-center">
								<p className="text-sm text-gray-500">
									No additives added yet. Add your first additive below.
								</p>
							</div>
						) : (
							<div className="space-y-4">
								{formValues.additives.map((additiveItem, index) => (
									<div
										key={index}
										className="flex items-end gap-4 rounded-md bg-gray-50 p-4"
									>
										<div className="flex-1 space-y-2">
											<Label htmlFor={`additive-${index}`}>Additive</Label>
											<select
												id={`additive-${index}`}
												className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
												value={additiveItem.additiveId}
												onChange={(e) =>
													handleAdditiveChange(
														index,
														'additiveId',
														e.target.value
													)
												}
												required
											>
												<option value="">Select additive</option>
												{additives.map((additive) => (
													<option key={additive.id} value={additive.id}>
														{additive.name}
													</option>
												))}
											</select>
										</div>

										<div className="w-24 space-y-2">
											<Label htmlFor={`quantity-${index}`}>Quantity</Label>
											<Input
												id={`quantity-${index}`}
												type="number"
												min="0"
												step="0.01"
												value={additiveItem.quantity}
												onChange={(e) =>
													handleAdditiveChange(
														index,
														'quantity',
														parseFloat(e.target.value)
													)
												}
												required
											/>
										</div>

										<div className="w-24 space-y-2">
											<Label htmlFor={`unit-${index}`}>Unit</Label>
											<Input
												id={`unit-${index}`}
												value={additiveItem.unit}
												onChange={(e) =>
													handleAdditiveChange(index, 'unit', e.target.value)
												}
												required
											/>
										</div>

										<Button
											type="button"
											variant="destructive"
											size="icon"
											onClick={() => removeAdditive(index)}
										>
											<Trash className="h-4 w-4" />
										</Button>
									</div>
								))}
							</div>
						)}

						<Button
							type="button"
							variant="outline"
							onClick={addAdditive}
							className="w-full"
						>
							<Plus className="mr-2 h-4 w-4" />
							Add Additive
						</Button>
					</CardContent>
				</Card>

				<div className="flex justify-end space-x-4">
					<Button variant="outline" type="button" onClick={goBack}>
						Cancel
					</Button>
					<Button type="submit" disabled={isSaving}>
						{isSaving ? (
							<>
								<div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
								{isEditMode ? 'Updating...' : 'Creating...'}
							</>
						) : (
							<>
								<Save className="mr-2 h-4 w-4" />
								{isEditMode ? 'Update Recipe' : 'Create Recipe'}
							</>
						)}
					</Button>
				</div>
			</form>
		</div>
	);
}
