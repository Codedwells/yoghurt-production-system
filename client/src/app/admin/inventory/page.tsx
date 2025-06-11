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
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, SearchIcon } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type InventoryItem = {
	id: string;
	name: string;
	type: string;
	quantity: number;
	unit: string;
	location: string | null;
	supplier: string | null;
	reorderLevel: number | null;
	expiryDate: Date | null;
	additive?: { id: string; name: string } | null;
	packaging?: { id: string; name: string } | null;
};

export default function InventoryPage() {
	const [items, setItems] = useState<InventoryItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [filterType, setFilterType] = useState('all');

	const [newItem, setNewItem] = useState<Partial<InventoryItem>>({
		name: '',
		type: 'raw-material',
		quantity: 0,
		unit: '',
		location: '',
		supplier: '',
		reorderLevel: 0,
		expiryDate: null,
		additive: null, // Added default value
		packaging: null // Added default value
	});

	const [editItem, setEditItem] = useState<InventoryItem | null>(null);
	const [additives, setAdditives] = useState<{ id: string; name: string }[]>(
		[]
	);
	const [packaging, setPackaging] = useState<{ id: string; name: string }[]>(
		[]
	);
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);

	useEffect(() => {
		fetchInventory();
		fetchAdditives();
		fetchPackaging();
	}, []);

	const fetchInventory = async () => {
		setIsLoading(true);
		try {
			const response = await fetch('/api/admin/inventory');
			if (response.ok) {
				const data = await response.json();
				setItems(data);
			}
		} catch (error) {
			console.error('Failed to fetch inventory:', error);
			toast.info('Failed to load inventory items');
		} finally {
			setIsLoading(false);
		}
	};

	const fetchAdditives = async () => {
		try {
			const response = await fetch('/api/admin/additives');
			if (response.ok) {
				const data = await response.json();
				setAdditives(data.map((a: any) => ({ id: a.id, name: a.name })));
			}
		} catch (error) {
			console.error('Failed to fetch additives:', error);
		}
	};

	const fetchPackaging = async () => {
		try {
			const response = await fetch('/api/admin/packaging');
			if (response.ok) {
				const data = await response.json();
				setPackaging(data.map((p: any) => ({ id: p.id, name: p.name })));
			}
		} catch (error) {
			console.error('Failed to fetch packaging:', error);
		}
	};

	const handleCreateItem = async () => {
		try {
			const response = await fetch('/api/admin/inventory', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(newItem)
			});

			if (response.ok) {
				setIsCreateDialogOpen(false);
				resetNewItem();
				fetchInventory();
			} else {
				const error = await response.json();
				throw new Error(error.error || 'Failed to create inventory item');
			}
		} catch (error) {
			console.error('Failed to create inventory item:', error);
			toast.error('Failed to create inventory item');
		}
	};

	const handleUpdateItem = async () => {
		if (!editItem) return;

		try {
			const response = await fetch(`/api/admin/inventory/${editItem.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(editItem)
			});

			if (response.ok) {
				setIsEditDialogOpen(false);
				setEditItem(null);
				fetchInventory();
			} else {
				const error = await response.json();
				throw new Error(error.error || 'Failed to update inventory item');
			}
		} catch (error) {
			console.error('Failed to update inventory item:', error);
			toast.error('Failed to update inventory item');
		}
	};

	const handleDeleteItem = async (id: string) => {
		if (!confirm('Are you sure you want to delete this inventory item?'))
			return;

		try {
			const response = await fetch(`/api/admin/inventory/${id}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				toast.success('Inventory item deleted successfully');
				fetchInventory();
			} else {
				const error = await response.json();
				throw new Error(error.error || 'Failed to delete inventory item');
			}
		} catch (error) {
			console.error('Failed to delete inventory item:', error);
			toast.success('Failed to delete inventory items');
		}
	};

	const resetNewItem = () => {
		setNewItem({
			name: '',
			type: 'raw-material',
			quantity: 0,
			unit: '',
			location: '',
			supplier: '',
			reorderLevel: 0,
			expiryDate: null,
			additive: null, // Added default value
			packaging: null // Added default value
		});
		setSelectedDate(null);
	};

	const filteredItems = items.filter((item) => {
		const matchesSearch =
			item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			item.supplier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			item.location?.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesType = filterType === 'all' || item.type === filterType;

		return matchesSearch && matchesType;
	});

	const handleTypeChange = (value: string) => {
		setNewItem({
			...newItem,
			type: value,
			packaging: null, // Updated to use `packaging`
			additive: null // Updated to use `additive`
		});
	};

	const handleEditTypeChange = (value: string) => {
		if (!editItem) return;

		setEditItem({
			...editItem,
			type: value,
			additive: null, // Updated to use `additive`
			packaging: null // Updated to use `packaging`
		});
	};

	const handleDateSelect = (date: Date | undefined) => {
		setSelectedDate(date || null); // Ensures `null` is passed if `undefined`
		setNewItem({ ...newItem, expiryDate: date || null });
	};

	const handleEditDateSelect = (date: Date | undefined) => {
		if (!editItem) return;
		setEditItem({ ...editItem, expiryDate: date || null }); // Ensures `null` is passed if `undefined`
	};

	return (
		<div className="container mx-auto p-6">
			<AdminHeader
				title="Inventory Management"
				actionLabel="Add Item"
				actionFn={() => setIsCreateDialogOpen(true)}
			/>

			<div className="mb-6 flex items-center justify-between">
				<div className="flex items-center gap-4">
					<div className="relative max-w-sm">
						<SearchIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
						<Input
							placeholder="Search inventory..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="max-w-sm pl-10"
						/>
					</div>

					<Select value={filterType} onValueChange={setFilterType}>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Filter by type" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Types</SelectItem>
							<SelectItem value="raw-material">Raw Material</SelectItem>
							<SelectItem value="additive">Additive</SelectItem>
							<SelectItem value="finished-product">Finished Product</SelectItem>
							<SelectItem value="packaging">Packaging</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			{isLoading ? (
				<div className="py-10 text-center">Loading inventory items...</div>
			) : (
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Type</TableHead>
								<TableHead>Quantity</TableHead>
								<TableHead>Location</TableHead>
								<TableHead>Supplier</TableHead>
								<TableHead>Expiry Date</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredItems.length === 0 ? (
								<TableRow>
									<TableCell colSpan={8} className="text-center">
										No inventory items found
									</TableCell>
								</TableRow>
							) : (
								filteredItems.map((item) => {
									const isLowStock =
										item.reorderLevel && item.quantity <= item.reorderLevel;
									const isExpiringSoon =
										item.expiryDate &&
										new Date(item.expiryDate) <=
											new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

									return (
										<TableRow key={item.id}>
											<TableCell className="font-medium">{item.name}</TableCell>
											<TableCell>
												<Badge variant="outline">
													{item.type.replace('-', ' ')}
												</Badge>
											</TableCell>
											<TableCell>{`${item.quantity} ${item.unit}`}</TableCell>
											<TableCell>{item.location || '-'}</TableCell>
											<TableCell>{item.supplier || '-'}</TableCell>
											<TableCell>
												{item.expiryDate
													? format(new Date(item.expiryDate), 'MMM d, yyyy')
													: '-'}
											</TableCell>
											<TableCell>
												{isLowStock && (
													<Badge variant="destructive" className="mr-2">
														Low Stock
													</Badge>
												)}
												{isExpiringSoon && item.expiryDate && (
													<Badge>Expiring Soon</Badge>
												)}
											</TableCell>
											<TableCell className="text-right">
												<Button
													variant="ghost"
													size="sm"
													onClick={() => {
														setEditItem(item);
														setSelectedDate(
															item.expiryDate ? new Date(item.expiryDate) : null
														);
														setIsEditDialogOpen(true);
													}}
													className="mr-2"
												>
													Edit
												</Button>
												<Button
													variant="destructive"
													size="sm"
													onClick={() => handleDeleteItem(item.id)}
												>
													Delete
												</Button>
											</TableCell>
										</TableRow>
									);
								})
							)}
						</TableBody>
					</Table>
				</div>
			)}

			{/* Create Inventory Item Dialog */}
			<Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>Add Inventory Item</DialogTitle>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<label className="text-right">Name</label>
							<Input
								value={newItem.name || ''}
								onChange={(e) =>
									setNewItem({ ...newItem, name: e.target.value })
								}
								className="col-span-3"
							/>
						</div>

						<div className="grid grid-cols-4 items-center gap-4">
							<label className="text-right">Type</label>
							<Select value={newItem.type} onValueChange={handleTypeChange}>
								<SelectTrigger className="col-span-3">
									<SelectValue placeholder="Select type" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="raw-material">Raw Material</SelectItem>
									<SelectItem value="additive">Additive</SelectItem>
									<SelectItem value="finished-product">
										Finished Product
									</SelectItem>
									<SelectItem value="packaging">Packaging</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{newItem.type === 'additive' && (
							<div className="grid grid-cols-4 items-center gap-4">
								<label className="text-right">Additive</label>
								<Select
									value={newItem.additive?.id}
									onValueChange={(value) =>
										setNewItem({
											...newItem,
											additive: additives.find((a) => a.id === value) || null
										})
									}
								>
									<SelectTrigger className="col-span-3">
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
						)}

						{newItem.type === 'packaging' && (
							<div className="grid grid-cols-4 items-center gap-4">
								<label className="text-right">Packaging</label>
								<Select
									value={newItem.packaging?.id}
									onValueChange={(value) =>
										setNewItem({
											...newItem,
											packaging: packaging.find((p) => p.id === value) || null
										})
									}
								>
									<SelectTrigger className="col-span-3">
										<SelectValue placeholder="Select packaging" />
									</SelectTrigger>
									<SelectContent>
										{packaging.map((pkg) => (
											<SelectItem key={pkg.id} value={pkg.id}>
												{pkg.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						)}

						<div className="grid grid-cols-4 items-center gap-4">
							<label className="text-right">Quantity</label>
							<Input
								type="number"
								step="0.01"
								min="0"
								value={newItem.quantity || 0}
								onChange={(e) =>
									setNewItem({
										...newItem,
										quantity: parseFloat(e.target.value)
									})
								}
								className="col-span-3"
							/>
						</div>

						<div className="grid grid-cols-4 items-center gap-4">
							<label className="text-right">Unit</label>
							<Input
								value={newItem.unit || ''}
								onChange={(e) =>
									setNewItem({ ...newItem, unit: e.target.value })
								}
								placeholder="kg, l, pcs"
								className="col-span-3"
							/>
						</div>

						<div className="grid grid-cols-4 items-center gap-4">
							<label className="text-right">Location</label>
							<Input
								value={newItem.location || ''}
								onChange={(e) =>
									setNewItem({ ...newItem, location: e.target.value })
								}
								placeholder="Warehouse A, Shelf 3"
								className="col-span-3"
							/>
						</div>

						<div className="grid grid-cols-4 items-center gap-4">
							<label className="text-right">Supplier</label>
							<Input
								value={newItem.supplier || ''}
								onChange={(e) =>
									setNewItem({ ...newItem, supplier: e.target.value })
								}
								className="col-span-3"
							/>
						</div>

						<div className="grid grid-cols-4 items-center gap-4">
							<label className="text-right">Reorder Level</label>
							<Input
								type="number"
								min="0"
								value={newItem.reorderLevel || 0}
								onChange={(e) =>
									setNewItem({
										...newItem,
										reorderLevel: parseFloat(e.target.value)
									})
								}
								className="col-span-3"
							/>
						</div>

						<div className="grid grid-cols-4 items-center gap-4">
							<label className="text-right">Expiry Date</label>
							<div className="col-span-3">
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant="outline"
											className={cn(
												'w-full justify-start text-left font-normal',
												!selectedDate && 'text-muted-foreground'
											)}
										>
											<CalendarIcon className="mr-2 h-4 w-4" />
											{selectedDate
												? format(selectedDate, 'PPP')
												: 'Select date'}
										</Button>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0">
										<Calendar
											mode="single"
											selected={selectedDate || undefined}
											onSelect={(date) => {
												setSelectedDate(date || null); // Ensures `null` is passed if `undefined`
												setNewItem({ ...newItem, expiryDate: date || null });
											}}
											initialFocus
										/>
									</PopoverContent>
								</Popover>
							</div>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => {
								setIsCreateDialogOpen(false);
								resetNewItem();
							}}
						>
							Cancel
						</Button>
						<Button onClick={handleCreateItem}>Create</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Edit Inventory Item Dialog */}
			<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>Edit Inventory Item</DialogTitle>
					</DialogHeader>
					{editItem && (
						<div className="grid gap-4 py-4">
							<div className="grid grid-cols-4 items-center gap-4">
								<label className="text-right">Name</label>
								<Input
									value={editItem.name}
									onChange={(e) =>
										setEditItem({ ...editItem, name: e.target.value })
									}
									className="col-span-3"
								/>
							</div>

							<div className="grid grid-cols-4 items-center gap-4">
								<label className="text-right">Type</label>
								<Select
									value={editItem.type}
									onValueChange={handleEditTypeChange}
								>
									<SelectTrigger className="col-span-3">
										<SelectValue placeholder="Select type" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="raw-material">Raw Material</SelectItem>
										<SelectItem value="additive">Additive</SelectItem>
										<SelectItem value="finished-product">
											Finished Product
										</SelectItem>
										<SelectItem value="packaging">Packaging</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{editItem.type === 'additive' && (
								<div className="grid grid-cols-4 items-center gap-4">
									<label className="text-right">Additive</label>
									<Select
										value={editItem.additive?.id}
										onValueChange={(value) =>
											setEditItem({
												...editItem,
												additive: additives.find((a) => a.id === value) || null
											})
										}
									>
										<SelectTrigger className="col-span-3">
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
							)}

							{editItem.type === 'packaging' && (
								<div className="grid grid-cols-4 items-center gap-4">
									<label className="text-right">Packaging</label>
									<Select
										value={editItem.packaging?.id}
										onValueChange={(value) =>
											setEditItem({
												...editItem,
												packaging: packaging.find((p) => p.id === value) || null
											})
										}
									>
										<SelectTrigger className="col-span-3">
											<SelectValue placeholder="Select packaging" />
										</SelectTrigger>
										<SelectContent>
											{packaging.map((pkg) => (
												<SelectItem key={pkg.id} value={pkg.id}>
													{pkg.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							)}

							<div className="grid grid-cols-4 items-center gap-4">
								<label className="text-right">Quantity</label>
								<Input
									type="number"
									step="0.01"
									min="0"
									value={editItem.quantity}
									onChange={(e) =>
										setEditItem({
											...editItem,
											quantity: parseFloat(e.target.value)
										})
									}
									className="col-span-3"
								/>
							</div>

							<div className="grid grid-cols-4 items-center gap-4">
								<label className="text-right">Unit</label>
								<Input
									value={editItem.unit}
									onChange={(e) =>
										setEditItem({ ...editItem, unit: e.target.value })
									}
									className="col-span-3"
								/>
							</div>

							<div className="grid grid-cols-4 items-center gap-4">
								<label className="text-right">Location</label>
								<Input
									value={editItem.location || ''}
									onChange={(e) =>
										setEditItem({ ...editItem, location: e.target.value })
									}
									className="col-span-3"
								/>
							</div>

							<div className="grid grid-cols-4 items-center gap-4">
								<label className="text-right">Supplier</label>
								<Input
									value={editItem.supplier || ''}
									onChange={(e) =>
										setEditItem({ ...editItem, supplier: e.target.value })
									}
									className="col-span-3"
								/>
							</div>

							<div className="grid grid-cols-4 items-center gap-4">
								<label className="text-right">Reorder Level</label>
								<Input
									type="number"
									min="0"
									value={editItem.reorderLevel || 0}
									onChange={(e) =>
										setEditItem({
											...editItem,
											reorderLevel: parseFloat(e.target.value)
										})
									}
									className="col-span-3"
								/>
							</div>

							<div className="grid grid-cols-4 items-center gap-4">
								<label className="text-right">Expiry Date</label>
								<div className="col-span-3">
									<Popover>
										<PopoverTrigger asChild>
											<Button
												variant="outline"
												className={cn(
													'w-full justify-start text-left font-normal',
													!selectedDate && 'text-muted-foreground'
												)}
											>
												<CalendarIcon className="mr-2 h-4 w-4" />
												{selectedDate
													? format(selectedDate, 'PPP')
													: 'No expiry date'}
											</Button>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0">
											<Calendar
												mode="single"
												selected={selectedDate || undefined}
												onSelect={(date) => {
													setSelectedDate(date || null); // Ensures `null` is passed if `undefined`
													setEditItem({
														...editItem,
														expiryDate: date || null
													});
												}}
												initialFocus
											/>
										</PopoverContent>
									</Popover>
								</div>
							</div>
						</div>
					)}
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => {
								setIsEditDialogOpen(false);
								setEditItem(null);
								setSelectedDate(null);
							}}
						>
							Cancel
						</Button>
						<Button onClick={handleUpdateItem}>Save Changes</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
