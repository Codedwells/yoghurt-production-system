'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';
import AdminHeader from '@/components/admin/AdminHeader';
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/components/ui/popover';
import { CalendarIcon, Plus, RefreshCw, Search } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

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
}

interface BatchAdditive {
	id: string;
	quantity: number;
	unit: string;
	additiveId: string;
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
	createdAt?: string;
}

interface FormData {
	batchNumber: string;
	recipeId: string;
	milkQuantity: string;
	milkUnit: string;
	status: string;
	expiryDate: string;
	notes: string;
	additives: {
		id: string;
		quantity: number;
		unit: string;
	}[];
}

export default function BatchesPage() {
	const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
	const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [batches, setBatches] = useState<Batch[]>([]);
	const [recipes, setRecipes] = useState<Recipe[]>([]);
	const [date, setDate] = useState<Date>(new Date());
	const [searchTerm, setSearchTerm] = useState<string>('');
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
	const [formData, setFormData] = useState<FormData>({
		batchNumber: '',
		recipeId: '',
		milkQuantity: '',
		milkUnit: 'liters',
		status: 'pending',
		expiryDate: '',
		notes: '',
		additives: []
	});
	const [aiSchedule, setAiSchedule] = useState<any>(null);
	const [aiLoading, setAiLoading] = useState<boolean>(false);
	const [aiError, setAiError] = useState<string | null>(null);

	useEffect(() => {
		fetchBatches();
		fetchRecipes();
	}, []);

	async function fetchBatches() {
		setIsLoading(true);
		try {
			const response = await fetch('/api/batches');
			if (!response.ok) {
				throw new Error('Failed to fetch batches');
			}
			const data = await response.json();
			setBatches(data);
		} catch (error) {
			console.error('Error fetching batches:', error);
			toast.error('Failed to load batches');
		} finally {
			setIsLoading(false);
		}
	}

	async function fetchRecipes() {
		try {
			const response = await fetch('/api/recipes');
			if (!response.ok) {
				throw new Error('Failed to fetch recipes');
			}
			const data = await response.json();
			setRecipes(data);
		} catch (error) {
			console.error('Error fetching recipes:', error);
			toast.error('Failed to load recipes');
		}
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSelectChange = (name: string, value: string) => {
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			const payload = {
				...formData,
				milkQuantity: parseFloat(formData.milkQuantity),
				expiryDate: new Date(formData.expiryDate).toISOString()
			};

			const response = await fetch('/api/batches', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(payload)
			});

			if (!response.ok) {
				throw new Error('Failed to create batch');
			}

			toast.success('Batch created successfully');
			setIsDialogOpen(false);
			setFormData({
				batchNumber: '',
				recipeId: '',
				milkQuantity: '',
				milkUnit: 'liters',
				status: 'pending',
				expiryDate: '',
				notes: '',
				additives: []
			});
			fetchBatches();
		} catch (error) {
			console.error('Error creating batch:', error);
			toast.error('Failed to create batch');
		}
	};

	const refreshData = () => {
		fetchBatches();
		toast.info('Refreshing data...');
	};

	const filteredBatches = searchTerm
		? batches.filter(
				(batch) =>
					batch.batchNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
					batch.recipe?.name?.toLowerCase().includes(searchTerm.toLowerCase())
			)
		: batches;

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

	return (
		<div className="flex-1 space-y-4 p-8 pt-6">
			<AdminHeader title="Batch Management" />

			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Input
						placeholder="Search batches..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="max-w-sm"
					/>
					<Button variant="outline" size="icon">
						<Search className="h-4 w-4" />
					</Button>
				</div>

				<div className="flex items-center gap-2">
					<Popover>
						<PopoverTrigger asChild>
							<Button variant="outline" className="flex items-center gap-2">
								<CalendarIcon className="h-4 w-4" />
								<span>Filter by date</span>
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0" align="end">
							<Calendar
								mode="single"
								selected={date}
								onSelect={(day) => day && setDate(day)}
								initialFocus
							/>
						</PopoverContent>
					</Popover>

					<Button variant="outline" size="icon" onClick={refreshData}>
						<RefreshCw className="h-4 w-4" />
					</Button>

					<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
						<DialogTrigger asChild>
							<Button className="flex items-center gap-2">
								<Plus className="h-4 w-4" />
								<span>New Batch</span>
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[525px]">
							<form onSubmit={handleSubmit}>
								<DialogHeader>
									<DialogTitle>Create New Batch</DialogTitle>
									<DialogDescription>
										Enter the details for the new production batch.
									</DialogDescription>
								</DialogHeader>
								<div className="grid gap-4 py-4">
									<div className="grid grid-cols-4 items-center gap-4">
										<Label htmlFor="batchNumber" className="text-right">
											Batch Number
										</Label>
										<Input
											id="batchNumber"
											name="batchNumber"
											value={formData.batchNumber}
											onChange={handleInputChange}
											placeholder="YG-2023-123"
											className="col-span-3"
											required
										/>
									</div>
									<div className="grid grid-cols-4 items-center gap-4">
										<Label htmlFor="recipeId" className="text-right">
											Recipe
										</Label>
										<Select
											value={formData.recipeId}
											onValueChange={(value) =>
												handleSelectChange('recipeId', value)
											}
										>
											<SelectTrigger className="col-span-3">
												<SelectValue placeholder="Select a recipe" />
											</SelectTrigger>
											<SelectContent>
												{recipes.map((recipe) => (
													<SelectItem key={recipe.id} value={recipe.id}>
														{recipe.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									<div className="grid grid-cols-4 items-center gap-4">
										<Label htmlFor="milkQuantity" className="text-right">
											Quantity
										</Label>
										<div className="col-span-3 flex gap-2">
											<Input
												id="milkQuantity"
												name="milkQuantity"
												value={formData.milkQuantity}
												onChange={handleInputChange}
												type="number"
												className="flex-1"
												required
											/>
											<Select
												value={formData.milkUnit}
												onValueChange={(value) =>
													handleSelectChange('milkUnit', value)
												}
											>
												<SelectTrigger className="w-[100px]">
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="liters">Liters</SelectItem>
													<SelectItem value="gallons">Gallons</SelectItem>
												</SelectContent>
											</Select>
										</div>
									</div>
									<div className="grid grid-cols-4 items-center gap-4">
										<Label htmlFor="status" className="text-right">
											Status
										</Label>
										<Select
											value={formData.status}
											onValueChange={(value) =>
												handleSelectChange('status', value)
											}
										>
											<SelectTrigger className="col-span-3">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="pending">Pending</SelectItem>
												<SelectItem value="processing">In Progress</SelectItem>
												<SelectItem value="completed">Completed</SelectItem>
												<SelectItem value="cancelled">Cancelled</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div className="grid grid-cols-4 items-center gap-4">
										<Label htmlFor="expiryDate" className="text-right">
											Expiry Date
										</Label>
										<Input
											id="expiryDate"
											name="expiryDate"
											value={formData.expiryDate}
											onChange={handleInputChange}
											type="date"
											className="col-span-3"
										/>
									</div>
									<div className="grid grid-cols-4 items-center gap-4">
										<Label htmlFor="notes" className="text-right">
											Notes
										</Label>
										<Input
											id="notes"
											name="notes"
											value={formData.notes}
											onChange={handleInputChange}
											className="col-span-3"
										/>
									</div>
								</div>
								<DialogFooter>
									<Button
										type="button"
										variant="secondary"
										disabled={aiLoading}
										onClick={async () => {
											setAiLoading(true);
											setAiError(null);
											setAiSchedule(null);
											try {
												const payload = {
													batchSize: parseFloat(formData.milkQuantity),
													recipeId: formData.recipeId,
													fermentationTime: 24, // Placeholder, replace with real value if needed
													temperature: 42, // Placeholder, replace with real value if needed
													additives: formData.additives,
													preferredStartDate: formData.expiryDate // Or another field if needed
												};
												const res = await fetch('/api/schedule/ai', {
													method: 'POST',
													headers: { 'Content-Type': 'application/json' },
													body: JSON.stringify(payload)
												});
												if (!res.ok) throw new Error('AI scheduling failed');
												const data = await res.json();
												setAiSchedule(data);
											} catch (err: any) {
												setAiError(err.message || 'AI scheduling failed');
											} finally {
												setAiLoading(false);
											}
										}}
									>
										{aiLoading ? 'Requesting AI...' : 'Suggest AI Schedule'}
									</Button>
									<Button type="submit">Create Batch</Button>
								</DialogFooter>
								{aiSchedule && (
									<div className="my-3 rounded-md border bg-blue-50 p-3">
										<div className="mb-1 font-semibold">
											AI Suggested Schedule:
										</div>
										<div>
											<b>Start:</b>{' '}
											{format(
												new Date(aiSchedule.schedule.startDate),
												'MMM d, yyyy, h:mm a'
											)}
										</div>
										<div>
											<b>Estimated Completion:</b>{' '}
											{format(
												new Date(aiSchedule.schedule.estimatedCompletion),
												'MMM d, yyyy, h:mm a'
											)}
										</div>
										<div>
											<b>Line:</b> {aiSchedule.schedule.assignedLine}
										</div>
										<div className="mt-1 text-xs text-gray-600">
											{aiSchedule.aiExplanation}
										</div>
									</div>
								)}
								{aiError && (
									<div className="mt-2 text-sm text-red-600">{aiError}</div>
								)}
							</form>
						</DialogContent>
					</Dialog>
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Batches</CardTitle>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className="flex h-40 items-center justify-center">
							<p>Loading batches...</p>
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Batch ID</TableHead>
									<TableHead>Product</TableHead>
									<TableHead>Quantity</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Created Date</TableHead>
									<TableHead>Expiry Date</TableHead>
									<TableHead>Created By</TableHead>
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredBatches.length === 0 ? (
									<TableRow>
										<TableCell colSpan={8} className="py-8 text-center">
											No batches found
										</TableCell>
									</TableRow>
								) : (
									filteredBatches.map((batch) => (
										<TableRow key={batch.id}>
											<TableCell className="font-medium">
												{batch.batchNumber}
											</TableCell>
											<TableCell>{batch.recipe?.name || 'Unknown'}</TableCell>
											<TableCell>
												{batch.milkQuantity} {batch.milkUnit}
											</TableCell>
											<TableCell>
												<Badge className={cn(getStatusColor(batch.status))}>
													{batch.status || 'Unknown'}
												</Badge>
											</TableCell>
											<TableCell>
												{batch.createdAt
													? new Date(batch.createdAt).toLocaleDateString()
													: 'N/A'}
											</TableCell>
											<TableCell>
												{batch.expiryDate
													? new Date(batch.expiryDate).toLocaleDateString()
													: 'N/A'}
											</TableCell>
											<TableCell>{batch.creator?.name || 'Unknown'}</TableCell>
											<TableCell>
												<Button
													variant="outline"
													size="sm"
													onClick={() => {
														setSelectedBatch(batch);
														setIsViewDialogOpen(true);
													}}
												>
													View
												</Button>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>

			{/* Batch Details Dialog */}
			<Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
				<DialogContent className="sm:max-w-[500px]">
					<DialogHeader>
						<DialogTitle>Batch Details</DialogTitle>
					</DialogHeader>
					{selectedBatch && (
						<div className="space-y-2">
							<div>
								<b>Batch Number:</b> {selectedBatch.batchNumber}
							</div>
							<div>
								<b>Recipe:</b>{' '}
								{selectedBatch.recipe?.name || selectedBatch.recipeId}
							</div>
							<div>
								<b>Quantity:</b> {selectedBatch.milkQuantity}{' '}
								{selectedBatch.milkUnit}
							</div>
							<div>
								<b>Status:</b> {selectedBatch.status}
							</div>
							<div>
								<b>Production Date:</b>{' '}
								{selectedBatch.productionDate
									? format(
											new Date(selectedBatch.productionDate),
											'MMM d, yyyy'
										)
									: 'N/A'}
							</div>
							<div>
								<b>Expiry Date:</b>{' '}
								{selectedBatch.expiryDate
									? format(new Date(selectedBatch.expiryDate), 'MMM d, yyyy')
									: 'N/A'}
							</div>
							<div>
								<b>Notes:</b> {selectedBatch.notes || 'None'}
							</div>
							<div>
								<b>Created By:</b>{' '}
								{selectedBatch.creator?.name || selectedBatch.creatorId}
							</div>
							{selectedBatch.batchAdditives &&
								selectedBatch.batchAdditives.length > 0 && (
									<div>
										<b>Additives:</b>
										<ul className="ml-5 list-disc">
											{selectedBatch.batchAdditives.map((add, idx) => (
												<li key={add.id || idx}>
													{add.quantity} {add.unit} (ID: {add.additiveId})
												</li>
											))}
										</ul>
									</div>
								)}
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
