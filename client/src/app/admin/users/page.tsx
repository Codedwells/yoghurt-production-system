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
import AdminHeader from '@/components/admin/AdminHeader';

type User = {
	id: string;
	email: string;
	name: string;
	role: 'USER' | 'PRODUCTION_MANAGER' | 'ADMIN';
};

export default function UsersPage() {
	const [users, setUsers] = useState<User[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [newUser, setNewUser] = useState({
		email: '',
		name: '',
		password: '',
		role: 'USER' as 'USER' | 'PRODUCTION_MANAGER' | 'ADMIN'
	});
	const [editUser, setEditUser] = useState<User | null>(null);
	const [editPassword, setEditPassword] = useState('');
	const [searchTerm, setSearchTerm] = useState('');

	useEffect(() => {
		fetchUsers();
	}, []);

	const fetchUsers = async () => {
		setIsLoading(true);
		try {
			const response = await fetch('/api/admin/users');
			if (response.ok) {
				const data = await response.json();
				setUsers(data);
			}
		} catch (error) {
			console.error('Failed to fetch users:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleCreateUser = async () => {
		try {
			const response = await fetch('/api/admin/users', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(newUser)
			});

			if (response.ok) {
				setIsCreateDialogOpen(false);
				setNewUser({
					email: '',
					name: '',
					password: '',
					role: 'USER'
				});
				fetchUsers();
			}
		} catch (error) {
			console.error('Failed to create user:', error);
		}
	};

	const handleUpdateUser = async () => {
		if (!editUser) return;

		try {
			const updateData = {
				...editUser,
				...(editPassword ? { password: editPassword } : {})
			};

			const response = await fetch(`/api/admin/users/${editUser.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(updateData)
			});

			if (response.ok) {
				setIsEditDialogOpen(false);
				setEditUser(null);
				setEditPassword('');
				fetchUsers();
			}
		} catch (error) {
			console.error('Failed to update user:', error);
		}
	};

	const handleDeleteUser = async (id: string) => {
		if (!confirm('Are you sure you want to delete this user?')) return;

		try {
			const response = await fetch(`/api/admin/users/${id}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				fetchUsers();
			}
		} catch (error) {
			console.error('Failed to delete user:', error);
		}
	};

	const filteredUsers = users.filter(
		(user) =>
			user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.email.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div className="container mx-auto p-6">
			<AdminHeader
				title="User Management"
				actionLabel="Add User"
				actionFn={() => setIsCreateDialogOpen(true)}
			/>

			<div className="mb-4">
				<Input
					placeholder="Search users..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="max-w-sm"
				/>
			</div>

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Role</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoading ? (
							<TableRow>
								<TableCell colSpan={4} className="text-center">
									Loading...
								</TableCell>
							</TableRow>
						) : filteredUsers.length === 0 ? (
							<TableRow>
								<TableCell colSpan={4} className="text-center">
									No users found
								</TableCell>
							</TableRow>
						) : (
							filteredUsers.map((user) => (
								<TableRow key={user.id}>
									<TableCell>{user.name}</TableCell>
									<TableCell>{user.email}</TableCell>
									<TableCell>{user.role}</TableCell>
									<TableCell className="text-right">
										<Button
											variant="ghost"
											size="sm"
											onClick={() => {
												setEditUser(user);
												setIsEditDialogOpen(true);
											}}
											className="mr-2"
										>
											Edit
										</Button>
										<Button
											variant="destructive"
											size="sm"
											onClick={() => handleDeleteUser(user.id)}
										>
											Delete
										</Button>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			{/* Create User Dialog */}
			<Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add New User</DialogTitle>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<label className="text-right">Name</label>
							<Input
								value={newUser.name}
								onChange={(e) =>
									setNewUser({ ...newUser, name: e.target.value })
								}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<label className="text-right">Email</label>
							<Input
								type="email"
								value={newUser.email}
								onChange={(e) =>
									setNewUser({ ...newUser, email: e.target.value })
								}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<label className="text-right">Password</label>
							<Input
								type="password"
								value={newUser.password}
								onChange={(e) =>
									setNewUser({ ...newUser, password: e.target.value })
								}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<label className="text-right">Role</label>
							<Select
								value={newUser.role}
								onValueChange={(
									value: 'USER' | 'PRODUCTION_MANAGER' | 'ADMIN'
								) => setNewUser({ ...newUser, role: value })}
							>
								<SelectTrigger className="col-span-3">
									<SelectValue placeholder="Select a role" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="USER">User</SelectItem>
									<SelectItem value="PRODUCTION_MANAGER">
										Production Manager
									</SelectItem>
									<SelectItem value="ADMIN">Admin</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsCreateDialogOpen(false)}
						>
							Cancel
						</Button>
						<Button onClick={handleCreateUser}>Create</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Edit User Dialog */}
			<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit User</DialogTitle>
					</DialogHeader>
					{editUser && (
						<div className="grid gap-4 py-4">
							<div className="grid grid-cols-4 items-center gap-4">
								<label className="text-right">Name</label>
								<Input
									value={editUser.name}
									onChange={(e) =>
										setEditUser({ ...editUser, name: e.target.value })
									}
									className="col-span-3"
								/>
							</div>
							<div className="grid grid-cols-4 items-center gap-4">
								<label className="text-right">Email</label>
								<Input
									type="email"
									value={editUser.email}
									onChange={(e) =>
										setEditUser({ ...editUser, email: e.target.value })
									}
									className="col-span-3"
								/>
							</div>
							<div className="grid grid-cols-4 items-center gap-4">
								<label className="text-right">New Password</label>
								<Input
									type="password"
									value={editPassword}
									onChange={(e) => setEditPassword(e.target.value)}
									placeholder="Leave blank to keep unchanged"
									className="col-span-3"
								/>
							</div>
							<div className="grid grid-cols-4 items-center gap-4">
								<label className="text-right">Role</label>
								<Select
									value={editUser.role}
									onValueChange={(
										value: 'USER' | 'PRODUCTION_MANAGER' | 'ADMIN'
									) => setEditUser({ ...editUser, role: value })}
								>
									<SelectTrigger className="col-span-3">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="USER">User</SelectItem>
										<SelectItem value="PRODUCTION_MANAGER">
											Production Manager
										</SelectItem>
										<SelectItem value="ADMIN">Admin</SelectItem>
									</SelectContent>
								</Select>
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
						<Button onClick={handleUpdateUser}>Save Changes</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
