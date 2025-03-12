'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
	LayoutDashboard,
	Briefcase,
	ShoppingCart,
	Package,
	Calendar,
	LineChart,
	Settings,
	Users,
	ChevronLeft,
	ChevronRight,
	CupSoda
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
	role: string;
}

export default function DashboardSidebar({ role }: SidebarProps) {
	const [collapsed, setCollapsed] = useState(false);
	const pathname = usePathname();

	// Define navigation items based on role
	const navItems = [
		{
			title: 'Dashboard',
			href: '/dashboard',
			icon: <LayoutDashboard className="h-5 w-5" />,
			roles: ['USER', 'PRODUCTION_MANAGER', 'ADMIN']
		},
		{
			title: 'Batches',
			href: '/admin/batches',
			icon: <CupSoda className="h-5 w-5" />,
			roles: ['USER', 'PRODUCTION_MANAGER', 'ADMIN']
		},
		{
			title: 'Recipes',
			href: '/admin/recipes',
			icon: <Briefcase className="h-5 w-5" />,
			roles: ['USER', 'PRODUCTION_MANAGER', 'ADMIN']
		},
		{
			title: 'Production',
			href: '/admin/production',
			icon: <Calendar className="h-5 w-5" />,
			roles: ['PRODUCTION_MANAGER', 'ADMIN']
		},
		{
			title: 'Inventory',
			href: '/admin/inventory',
			icon: <Package className="h-5 w-5" />,
			roles: ['PRODUCTION_MANAGER', 'ADMIN']
		},
		{
			title: 'Sales',
			href: '/admin/sales',
			icon: <ShoppingCart className="h-5 w-5" />,
			roles: ['USER', 'PRODUCTION_MANAGER', 'ADMIN']
		},
		{
			title: 'Analytics',
			href: '/admin/analytics',
			icon: <LineChart className="h-5 w-5" />,
			roles: ['PRODUCTION_MANAGER', 'ADMIN']
		},
		{
			title: 'User Management',
			href: '/admin/users',
			icon: <Users className="h-5 w-5" />,
			roles: ['ADMIN']
		},
		{
			title: 'Settings',
			href: '/admin/settings',
			icon: <Settings className="h-5 w-5" />,
			roles: ['ADMIN']
		}
	];

	const filteredNavItems = navItems.filter((item) => item.roles.includes(role));

	return (
		<div
			className={cn(
				'flex flex-col border-r border-gray-200 bg-white transition-all duration-300',
				collapsed ? 'w-16' : 'w-64'
			)}
		>
			<div className="flex items-center justify-between border-b p-4">
				{!collapsed && (
					<Link href="/dashboard">
						<h1 className="text-xl font-bold">Yoghurt AI</h1>
					</Link>
				)}
				<Button
					variant="ghost"
					size="icon"
					onClick={() => setCollapsed(!collapsed)}
					className="ml-auto"
				>
					{collapsed ? <ChevronRight /> : <ChevronLeft />}
				</Button>
			</div>
			<nav className="flex-1 p-2">
				<ul className="space-y-1">
					{filteredNavItems.map((item) => (
						<li key={item.href}>
							<Link
								href={item.href}
								className={cn(
									'flex items-center rounded-md px-3 py-2 transition-colors',
									pathname === item.href
										? 'bg-gray-100 text-blue-600'
										: 'text-gray-700 hover:bg-gray-100'
								)}
							>
								{item.icon}
								{!collapsed && <span className="ml-3">{item.title}</span>}
							</Link>
						</li>
					))}
				</ul>
			</nav>
			<div className="border-t p-4 text-center text-xs text-gray-500">
				{!collapsed && <span>Yoghurt AI Production v1.0</span>}
			</div>
		</div>
	);
}
