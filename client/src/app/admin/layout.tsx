import { ReactNode } from 'react';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import DashboardHeader from '@/components/dashboard/header';
import DashboardSidebar from '@/components/dashboard/sidebar';

export default async function AdminLayout({
	children
}: {
	children: ReactNode;
}) {
	const session = await getServerSession(authOptions);

	if (!session) {
		redirect('/login');
	}

	if (session.user.role !== 'ADMIN') {
		redirect('/dashboard');
	}

	return (
		<div className="flex bg-gray-50 md:h-screen">
			<DashboardSidebar role={session.user.role} />
			<div className="flex flex-1 flex-col">
				<DashboardHeader user={session.user} />
				<main className="flex-1 overflow-y-auto p-6">{children}</main>
			</div>
		</div>
	);
}
