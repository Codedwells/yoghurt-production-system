'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { SearchIcon, PlusIcon } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type Recipe = {
	id: string;
	name: string;
	description: string | null;
	instructions: string;
	createdAt: string;
	updatedAt: string;
	recipeAdditiveCount: number;
	batchCount: number;
};

export default function RecipesPage() {
	const router = useRouter();
	const [recipes, setRecipes] = useState<Recipe[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');

	useEffect(() => {
		fetchRecipes();
	}, []);

	const fetchRecipes = async () => {
		setIsLoading(true);
		try {
			const response = await fetch('/api/admin/recipes');
			if (response.ok) {
				const data = await response.json();
				setRecipes(data);
			}
		} catch (error) {
			console.error('Failed to fetch recipes:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleDeleteRecipe = async (id: string) => {
		if (!confirm('Are you sure you want to delete this recipe?')) return;

		try {
			const response = await fetch(`/api/admin/recipes/${id}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				fetchRecipes();
			}
		} catch (error) {
			console.error('Failed to delete recipe:', error);
		}
	};

	const filteredRecipes = recipes.filter(
		(recipe) =>
			recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			recipe.description?.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const formatDate = (dateStr: string) => {
		return new Date(dateStr).toLocaleDateString();
	};

	return (
		<div className="container mx-auto p-6">
			<AdminHeader
				title="Recipe Management"
				actionLabel="Add Recipe"
				actionFn={() => router.push('/admin/recipes/create')}
			/>

			<div className="mb-6 flex items-center justify-between">
				<div className="relative max-w-sm">
					<SearchIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
					<Input
						placeholder="Search recipes..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="max-w-sm pl-10"
					/>
				</div>
			</div>

			{isLoading ? (
				<div className="py-10 text-center">Loading recipes...</div>
			) : recipes.length === 0 ? (
				<Card>
					<CardContent className="flex flex-col items-center justify-center py-10">
						<p className="text-muted-foreground mb-4">
							No recipes found. Create your first recipe!
						</p>
						<Button onClick={() => router.push('/admin/recipes/create')}>
							<PlusIcon className="mr-2 h-4 w-4" />
							Add Recipe
						</Button>
					</CardContent>
				</Card>
			) : (
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Created</TableHead>
								<TableHead>Last Updated</TableHead>
								<TableHead>Additives</TableHead>
								<TableHead>Batches</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredRecipes.map((recipe) => (
								<TableRow key={recipe.id}>
									<TableCell className="font-medium">{recipe.name}</TableCell>
									<TableCell>{formatDate(recipe.createdAt)}</TableCell>
									<TableCell>{formatDate(recipe.updatedAt)}</TableCell>
									<TableCell>
										<Badge variant="outline">
											{recipe.recipeAdditiveCount}
										</Badge>
									</TableCell>
									<TableCell>
										<Badge variant="outline">{recipe.batchCount}</Badge>
									</TableCell>
									<TableCell className="text-right">
										<Button
											variant="ghost"
											size="sm"
											onClick={() => router.push(`/admin/recipes/${recipe.id}`)}
											className="mr-2"
										>
											View
										</Button>
										<Button
											variant="ghost"
											size="sm"
											onClick={() =>
												router.push(`/admin/recipes/${recipe.id}/edit`)
											}
											className="mr-2"
										>
											Edit
										</Button>
										<Button
											variant="destructive"
											size="sm"
											onClick={() => handleDeleteRecipe(recipe.id)}
										>
											Delete
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			)}
		</div>
	);
}
