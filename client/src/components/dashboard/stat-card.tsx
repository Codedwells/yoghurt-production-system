import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card';
import { ReactNode } from 'react';

interface DashboardStatCardProps {
	title: string;
	value: string;
	description: string;
	icon: ReactNode;
}

export default function DashboardStatCard({
	title,
	value,
	description,
	icon
}: DashboardStatCardProps) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">{title}</CardTitle>
				{icon}
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{value}</div>
				<p className="text-muted-foreground text-xs">{description}</p>
			</CardContent>
		</Card>
	);
}
