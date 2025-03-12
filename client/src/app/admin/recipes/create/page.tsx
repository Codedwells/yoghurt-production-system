'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import AdminHeader from '@/components/admin/AdminHeader';
import { Label } from '@/components/ui/label';
import { PlusIcon, Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';

type Additive = {
	id: string;
	name: string;
	description: string | null;
	type: string;
};

type RecipeAdditive = {
	additiveId: string;
	name: string;
	quantity: number;
	unit: string;
};

export default function CreateRecipePage() {
	const router = useRouter();
	const [additives, setAdditives] = useState<Additive[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);

	const [recipe, setRecipe] = useState({
		name: '',
		description: '',
		instructions: ''
	});

	const [recipeAdditives, setRecipeAdditives] = useState<RecipeAdditive[]>([]);

	useEffect(() => {
		fetchAdditives();
	}, []);

	const fetchAdditives = async () => {
		try {
			const response = await fetch('/api/admin/additives');
			if (response.ok) {
				const data = await response.json();
				setAdditives(data);
			}
		} catch (error) {
			console.error('Failed to fetch additives:', error);
			toast('Failed to load additives');
		} finally {
			setIsLoading(false);
		}
	};

	const handleAddAdditive = () => {
		if (additives.length === 0) return;

		const firstAdditive = additives[0];
		setRecipeAdditives([
			...recipeAdditives,
			{
				additiveId: firstAdditive.id,
				name: firstAdditive.name,
				quantity: 1,
				unit: 'g'
			}
		]);
	};

	const handleRemoveAdditive = (index: number) => {
		const updated = [...recipeAdditives];
		updated.splice(index, 1);
		setRecipeAdditives(updated);
	};

	const handleAdditiveChange = (
		index: number,
		field: string,
		value: string | number
	) => {
		const updated = [...recipeAdditives];

		if (field === 'additiveId') {
			const selectedAdditive = additives.find((a) => a.id === value);
			if (selectedAdditive) {
				updated[index] = {
					...updated[index],
					additiveId: value as string,
					name: selectedAdditive.name
				};
			}
		} else {
			updated[index] = {
				...updated[index],
				[field]: value
			};
		}

		setRecipeAdditives(updated);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSaving(true);

		try {
			const response = await fetch('/api/admin/recipes', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					...recipe,
					additives: recipeAdditives.map((a) => ({
						additiveId: a.additiveId,
						quantity: parseFloat(a.quantity.toString()),
						unit: a.unit
					}))
				})
			});

			if (response.ok) {
				toast.success('Recipe created successfully');

				router.push('/admin/recipes');
			} else {
				const error = await response.json();
				throw new Error(error.error || 'Failed to create recipe');
			}
		} catch (error) {
			console.error('Failed to save recipe:', error);

			toast.error('Failed to save recipe');
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<div className="container mx-auto p-6">
			<AdminHeader title="Create New Recipe" showBack={true} />

			<form onSubmit={handleSubmit}>
				<div className="grid gap-6">
					<Card>
						<CardHeader>
							<CardTitle>Recipe Details</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid gap-4">
								<div className="grid gap-2">
									<Label htmlFor="name">Recipe Name</Label>
									<Input
										id="name"
										value={recipe.name}
										onChange={(e) =>
											setRecipe({ ...recipe, name: e.target.value })
										}
										placeholder="Greek Yogurt"
										required
									/>
								</div>

								<div className="grid gap-2">
									<Label htmlFor="description">Description</Label>
									<Textarea
										id="description"
										value={recipe.description}
										onChange={(e) =>
											setRecipe({ ...recipe, description: e.target.value })
										}
										placeholder="A rich, creamy Greek-style yogurt..."
										rows={3}
									/>
								</div>

								<div className="grid gap-2">
									<Label htmlFor="instructions">Instructions</Label>
									<Textarea
										id="instructions"
										value={recipe.instructions}
										onChange={(e) =>
											setRecipe({ ...recipe, instructions: e.target.value })
										}
										placeholder="1. Heat milk to 180°F (82°C)..."
										rows={6}
										required
									/>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between">
							<CardTitle>Additives</CardTitle>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={handleAddAdditive}
								disabled={additives.length === 0}
							>
								<PlusIcon className="mr-2 h-4 w-4" />
								Add Additive
							</Button>
						</CardHeader>
						<CardContent>
							{isLoading ? (
								<div className="py-4 text-center">Loading additives...</div>
							) : additives.length === 0 ? (
								<div className="py-4 text-center">
									<p className="text-muted-foreground">
										No additives available. Please create additives first.
									</p>
								</div>
							) : recipeAdditives.length === 0 ? (
								<div className="py-4 text-center">
									<p className="text-muted-foreground">
										No additives added to this recipe yet.
									</p>
								</div>
							) : (
								<div className="space-y-4">
									{recipeAdditives.map((item, index) => (
										<div key={index} className="flex items-center gap-4">
											<div className="w-1/3">
												<Select
													value={item.additiveId}
													onValueChange={(value) =>
														handleAdditiveChange(index, 'additiveId', value)
													}
												>
													<SelectTrigger>
														<SelectValue placeholder="Select additive" />
													</SelectTrigger>
													<SelectContent>
														{additives.map((additive) => (
															<SelectItem key={additive.id} value={additive.id}>
																{additive.name}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</div>

											<div className="w-1/6">
												<Input
													type="number"
													step="0.01"
													min="0"
													value={item.quantity}
													onChange={(e) =>
														handleAdditiveChange(
															index,
															'quantity',
															parseFloat(e.target.value)
														)
													}
													placeholder="Qty"
												/>
											</div>

											<div className="w-1/6">
												<Input
													value={item.unit}
													onChange={(e) =>
														handleAdditiveChange(index, 'unit', e.target.value)
													}
													placeholder="Unit"
												/>
											</div>

											<Button
												type="button"
												variant="ghost"
												size="icon"
												onClick={() => handleRemoveAdditive(index)}
											>
												<Trash2Icon className="h-4 w-4" />
											</Button>
										</div>
									))}
								</div>
							)}
						</CardContent>
					</Card>

					<div className="flex justify-end gap-4">
						<Button
							type="button"
							variant="outline"
							onClick={() => router.back()}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={
								isLoading ||
								isSaving ||
								recipe.name === '' ||
								recipe.instructions === ''
							}
						>
							{isSaving ? 'Creating...' : 'Create Recipe'}
						</Button>
					</div>
				</div>
			</form>
		</div>
	);
}
