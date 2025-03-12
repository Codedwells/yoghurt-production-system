import React from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface AdminHeaderProps {
	title: string;
	actionLabel?: string;
	actionFn?: () => void;
	showBack?: boolean;
}

const AdminHeader = ({
	title,
	actionLabel,
	actionFn,
	showBack = false
}: AdminHeaderProps) => {
	const router = useRouter();

	return (
		<div className="mb-6 flex items-center justify-between">
			<div className="flex items-center gap-4">
				{showBack && (
					<Button variant="outline" size="sm" onClick={() => router.back()}>
						Back
					</Button>
				)}
				<h1 className="text-2xl font-bold">{title}</h1>
			</div>

			{actionLabel && actionFn && (
				<Button onClick={actionFn}>{actionLabel}</Button>
			)}
		</div>
	);
};

export default AdminHeader;
