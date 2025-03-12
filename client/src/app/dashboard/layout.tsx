import { ReactNode } from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import DashboardSidebar from '@/components/dashboard/sidebar';
import DashboardHeader from '@/components/dashboard/header';

export default async function DashboardLayout({
	children
}: {
	children: ReactNode;
}) {
	const session = await getServerSession(authOptions);

	if (!session) {
		redirect('/login');
	}

	return (
		<div className="flex min-h-screen bg-gray-50">
			<DashboardSidebar role={session.user.role} />
			<div className="flex flex-1 flex-col">
				<DashboardHeader user={session.user} />
				<main className="flex-1 p-6">{children}</main>
			</div>
		</div>
	);
}
