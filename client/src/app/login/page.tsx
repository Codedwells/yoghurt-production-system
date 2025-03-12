'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { MilkIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

const loginSchema = z.object({
	email: z.string().email({ message: 'Please enter a valid email address.' }),
	password: z.string().min(1, { message: 'Password is required.' })
});

export default function LoginPage() {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<z.infer<typeof loginSchema>>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: ''
		}
	});

	async function onSubmit(values: z.infer<typeof loginSchema>) {
		setIsLoading(true);
		setError(null);

		const result = await signIn('credentials', {
			email: values.email,
			password: values.password,
			redirect: false
		});

		console.log(result);

		setIsLoading(false);

		if (result?.error) {
			setError('Invalid email or password. Please try again.');
			return;
		}

		router.push('/dashboard');
		router.refresh();
	}

	return (
		<div className="flex min-h-screen flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-md">
				<div className="flex justify-center">
					<MilkIcon className="h-12 w-12 text-blue-600" />
				</div>
				<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
					Sign in to Yoghurt AI
				</h2>
				<p className="mt-2 text-center text-sm text-gray-600">
					Manage your yoghurt production efficiently
				</p>
			</div>

			<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
				<div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
					{error && (
						<Alert variant="destructive" className="mb-6">
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email address</FormLabel>
										<FormControl>
											<Input
												{...field}
												type="email"
												placeholder="you@example.com"
												disabled={isLoading}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input {...field} type="password" disabled={isLoading} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div>
								<Button type="submit" className="w-full" disabled={isLoading}>
									{isLoading ? 'Signing in...' : 'Sign in'}
								</Button>
							</div>
						</form>
					</Form>

					<div className="mt-6">
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-300" />
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="bg-white px-2 text-gray-500">
									Demo accounts
								</span>
							</div>
						</div>

						<div className="mt-6 grid grid-cols-1 gap-3">
							<div className="rounded-md bg-gray-50 p-3 text-sm">
								<p>
									<strong>Admin:</strong> admin@yoghurt.com / admin123
								</p>
							</div>
							<div className="rounded-md bg-gray-50 p-3 text-sm">
								<p>
									<strong>Production Manager:</strong> manager@yoghurt.com /
									manager123
								</p>
							</div>
							<div className="rounded-md bg-gray-50 p-3 text-sm">
								<p>
									<strong>Staff:</strong> user@yoghurt.com / user123
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="mt-8 text-center">
				<Link href="/" className="text-sm text-blue-600 hover:text-blue-500">
					Return to homepage
				</Link>
			</div>
		</div>
	);
}
