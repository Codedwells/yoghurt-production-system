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
import { Textarea } from '@/components/ui/textarea';
import AdminHeader from '@/components/admin/AdminHeader';
import { toast } from 'sonner';

type Setting = {
	id: string;
	key: string;
	value: string;
	description: string | null;
	createdAt: string;
	updatedAt: string;
};

export default function SettingsPage() {
	const [settings, setSettings] = useState<Setting[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const [currentSetting, setCurrentSetting] = useState<Setting | null>(null);
	const [newSetting, setNewSetting] = useState({
		key: '',
		value: '',
		description: ''
	});
	const [searchTerm, setSearchTerm] = useState('');

	useEffect(() => {
		fetchSettings();
	}, []);

	const fetchSettings = async () => {
		setIsLoading(true);
		try {
			const response = await fetch('/api/admin/settings');
			if (response.ok) {
				const data = await response.json();
				setSettings(data);
			} else {
				toast('Error', { description: 'Failed to load settings!' });
			}
		} catch (error) {
			console.error('Error fetching settings:', error);
			toast('Error', { description: 'Failed to load settings!' });
		} finally {
			setIsLoading(false);
		}
	};

	const handleCreateSetting = async () => {
		try {
			const response = await fetch('/api/admin/settings', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(newSetting)
			});

			if (response.ok) {
				setIsCreateDialogOpen(false);
				setNewSetting({ key: '', value: '', description: '' });
				fetchSettings();
			} else {
				const error = await response.json();
				toast('Error', { description: 'Failed to create settings!' });
			}
		} catch (error) {
			toast('Error', { description: 'Failed to load settings!' });
		}
	};

	const handleUpdateSetting = async () => {
		if (!currentSetting) return;

		try {
			const response = await fetch(`/api/admin/settings/${currentSetting.id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					value: currentSetting.value,
					description: currentSetting.description
				})
			});

			if (response.ok) {
				setIsEditDialogOpen(false);
				fetchSettings();
			} else {
				const error = await response.json();
				toast('Error', { description: 'Failed to load settings!' });
			}
		} catch (error) {
			toast('Error', { description: 'Failed to load update settings!' });
		}
	};

	const handleDeleteSetting = async (id: string) => {
		if (!window.confirm('Are you sure you want to delete this setting?'))
			return;

		try {
			const response = await fetch(`/api/admin/settings/${id}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				fetchSettings();
			} else {
				const error = await response.json();
				toast('Error', { description: 'Failed to delete settings!' });
			}
		} catch (error) {
			toast('Error', { description: 'Failed to load settings!' });
		}
	};

	const filteredSettings = settings.filter(
		(setting) =>
			setting.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
			setting.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
			(setting.description &&
				setting.description.toLowerCase().includes(searchTerm.toLowerCase()))
	);

	return (
		<div className="space-y-6 p-6">
			<AdminHeader title="System Settings" />

			<div className="flex items-center justify-between">
				<Input
					placeholder="Search settings..."
					className="max-w-xs"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				<Button onClick={() => setIsCreateDialogOpen(true)}>
					Add New Setting
				</Button>
			</div>

			{isLoading ? (
				<div className="flex min-h-[200px] items-center justify-center">
					<p>Loading settings...</p>
				</div>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Key</TableHead>
							<TableHead>Value</TableHead>
							<TableHead>Description</TableHead>
							<TableHead>Last Updated</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredSettings.length === 0 ? (
							<TableRow>
								<TableCell colSpan={5} className="text-center">
									No settings found.
								</TableCell>
							</TableRow>
						) : (
							filteredSettings.map((setting) => (
								<TableRow key={setting.id}>
									<TableCell className="font-medium">{setting.key}</TableCell>
									<TableCell>{setting.value}</TableCell>
									<TableCell>{setting.description}</TableCell>
									<TableCell>
										{new Date(setting.updatedAt).toLocaleString()}
									</TableCell>
									<TableCell className="space-x-2 text-right">
										<Button
											variant="outline"
											size="sm"
											onClick={() => {
												setCurrentSetting(setting);
												setIsEditDialogOpen(true);
											}}
										>
											Edit
										</Button>
										<Button
											variant="destructive"
											size="sm"
											onClick={() => handleDeleteSetting(setting.id)}
										>
											Delete
										</Button>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			)}

			{/* Create Setting Dialog */}
			<Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add New Setting</DialogTitle>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<label htmlFor="key" className="text-right">
								Key
							</label>
							<Input
								id="key"
								className="col-span-3"
								value={newSetting.key}
								onChange={(e) =>
									setNewSetting({ ...newSetting, key: e.target.value })
								}
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<label htmlFor="value" className="text-right">
								Value
							</label>
							<Input
								id="value"
								className="col-span-3"
								value={newSetting.value}
								onChange={(e) =>
									setNewSetting({ ...newSetting, value: e.target.value })
								}
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<label htmlFor="description" className="text-right">
								Description
							</label>
							<Textarea
								id="description"
								className="col-span-3"
								value={newSetting.description}
								onChange={(e) =>
									setNewSetting({ ...newSetting, description: e.target.value })
								}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsCreateDialogOpen(false)}
						>
							Cancel
						</Button>
						<Button onClick={handleCreateSetting}>Create</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Edit Setting Dialog */}
			<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Setting</DialogTitle>
					</DialogHeader>
					{currentSetting && (
						<div className="grid gap-4 py-4">
							<div className="grid grid-cols-4 items-center gap-4">
								<label className="text-right font-medium">Key</label>
								<div className="col-span-3 font-medium">
									{currentSetting.key}
								</div>
							</div>
							<div className="grid grid-cols-4 items-center gap-4">
								<label htmlFor="edit-value" className="text-right">
									Value
								</label>
								<Input
									id="edit-value"
									className="col-span-3"
									value={currentSetting.value}
									onChange={(e) =>
										setCurrentSetting({
											...currentSetting,
											value: e.target.value
										})
									}
								/>
							</div>
							<div className="grid grid-cols-4 items-center gap-4">
								<label htmlFor="edit-description" className="text-right">
									Description
								</label>
								<Textarea
									id="edit-description"
									className="col-span-3"
									value={currentSetting.description || ''}
									onChange={(e) =>
										setCurrentSetting({
											...currentSetting,
											description: e.target.value
										})
									}
								/>
							</div>
						</div>
					)}
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsEditDialogOpen(false)}
						>
							Cancel
						</Button>
						<Button onClick={handleUpdateSetting}>Save Changes</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
