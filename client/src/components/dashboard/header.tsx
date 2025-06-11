'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface User {
	id: string;
	name?: string | null;
	email: string;
	role: string;
}

interface HeaderProps {
	user: User;
}

export default function DashboardHeader({ user }: HeaderProps) {
	const [notifications] = useState(3); // Example notification count

	const getInitials = (name?: string | null) => {
		if (!name) return user.email.substring(0, 2).toUpperCase();
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase();
	};

	const getRoleDisplay = (role: string) => {
		switch (role) {
			case 'ADMIN':
				return 'Administrator';
			case 'PRODUCTION_MANAGER':
				return 'Production Manager';
			case 'USER':
				return 'Staff User';
			default:
				return role;
		}
	};

	return (
		<header className="h-16 border-b border-gray-200 bg-white shadow-sm">
			<div className="flex h-full items-center justify-between px-4">
				<div className="flex items-center"></div>
				<div className="flex items-center space-x-4">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="relative h-8 w-8 rounded-full">
								<Avatar className="h-8 w-8">
									<AvatarFallback>{getInitials(user.name)}</AvatarFallback>
								</Avatar>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-56" align="end" forceMount>
							<DropdownMenuLabel className="font-normal">
								<div className="flex flex-col space-y-1">
									<p className="text-sm leading-none font-medium">
										{user.name || user.email}
									</p>
									<p className="text-muted-foreground text-xs leading-none">
										{user.email}
									</p>
									<p className="text-muted-foreground text-xs leading-none">
										{getRoleDisplay(user.role)}
									</p>
								</div>
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>Profile</DropdownMenuItem>
							<DropdownMenuItem>Settings</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={() => signOut()}>
								Log out
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	);
}
