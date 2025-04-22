'use client';

import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import {
	MilkIcon,
	ArrowRight,
	BarChart2,
	Brain,
	Cpu,
	Factory,
	LineChart,
	Shapes
} from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const features = [
	{
		icon: <Brain />,
		title: 'AI-Driven Optimization',
		description:
			'Leverage artificial intelligence to optimize production schedules and reduce waste.'
	},
	{
		icon: <Factory />,
		title: 'Batch Management',
		description:
			'Create and manage yoghurt batches with precise recipe control and tracking.'
	},
	{
		icon: <Shapes />,
		title: 'Additive Tracking',
		description:
			'Monitor and manage additives with complete traceability throughout production.'
	},
	{
		icon: <LineChart />,
		title: 'Real-time Analytics',
		description: 'Monitor production metrics and quality control in real-time.'
	},
	{
		icon: <Cpu />,
		title: 'Smart Automation',
		description: 'Automate routine tasks and streamline production workflows.'
	},
	{
		icon: <BarChart2 />,
		title: 'Production Insights',
		description: 'Gain valuable insights to improve efficiency and quality.'
	}
];

export default function Home() {
	const mouseX = useMotionValue(0);
	const mouseY = useMotionValue(0);

	const gradientX = useTransform(mouseX, [0, 1000], ['30%', '70%']);
	const gradientY = useTransform(mouseY, [0, 1000], ['30%', '70%']);

	const handleMouseMove = (e: React.MouseEvent) => {
		const { clientX, clientY } = e;
		mouseX.set(clientX);
		mouseY.set(clientY);
	};

	return (
		<div className="flex min-h-screen flex-col">
			<header className="fixed top-0 right-0 left-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
				<div className="container mx-auto flex items-center justify-between px-4 py-4">
					<div className="flex items-center space-x-2">
						<MilkIcon className="h-7 w-7 text-indigo-600" />
						<h1 className="text-gradient text-xl font-bold">
							Yoghurt AI Production
						</h1>
					</div>
					<nav>
						<ul className="flex items-center space-x-8">
							<li>
								<a
									href="#features"
									className="text-gray-600 transition-colors hover:text-indigo-600"
								>
									Features
								</a>
							</li>
							<li>
								<a
									href="#benefits"
									className="text-gray-600 transition-colors hover:text-indigo-600"
								>
									Benefits
								</a>
							</li>
							<li>
								<a
									href="#about"
									className="text-gray-600 transition-colors hover:text-indigo-600"
								>
									About
								</a>
							</li>
							<li>
								<Link
									href="/login"
									className={cn(
										buttonVariants({ variant: 'outline', size: 'sm' }),
										'ml-4'
									)}
								>
									Log In
								</Link>
							</li>
						</ul>
					</nav>
				</div>
			</header>

			<main className="flex-1 pt-16">
				<section
					className="relative overflow-hidden px-6 py-32 sm:px-8 sm:py-40 md:px-12 lg:px-16 xl:px-24"
					onMouseMove={handleMouseMove}
				>
					<motion.div
						className="absolute inset-0"
						style={{
							background: `radial-gradient(circle at ${gradientX}% ${gradientY}%, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 25%, rgba(244, 114, 182, 0.15) 50%, rgba(99, 102, 241, 0.15) 75%)`
						}}
					/>
					<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZTBlMGUwIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-[0.2]" />
					<div className="relative mx-auto max-w-7xl">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8 }}
							className="space-y-8 text-center"
						>
							<motion.span
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.2, duration: 0.5 }}
								className="inline-block rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-medium text-indigo-600"
							>
								AI-Powered Management System
							</motion.span>
							<motion.h1
								initial={{ opacity: 0, y: 30 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.3, duration: 0.8 }}
								className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl md:text-7xl"
							>
								Revolutionary
								<span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
									Yoghurt Production
								</span>
								Management
							</motion.h1>
							<motion.p
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.5, duration: 0.8 }}
								className="mx-auto max-w-2xl text-xl text-gray-600"
							>
								Optimize your production processes, reduce waste, and enhance
								efficiency with our cutting-edge AI-driven system.
							</motion.p>
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.7, duration: 0.8 }}
								className="flex justify-center gap-6"
							>
								<Button
									size="lg"
									className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90"
								>
									Request Demo <ArrowRight className="ml-2 h-5 w-5" />
								</Button>
								<Button size="lg" variant="outline" className="border-2">
									Learn More
								</Button>
							</motion.div>
						</motion.div>
					</div>
				</section>

				<section
					id="features"
					className="bg-white px-6 py-24 sm:px-8 md:px-12 lg:px-16 xl:px-24"
				>
					<div className="mx-auto max-w-7xl">
						<div className="mb-16 text-center">
							<h2 className="text-4xl font-bold text-gray-900 sm:text-5xl">
								Comprehensive
								<span className="text-gradient"> Production Management</span>
							</h2>
							<p className="mt-4 text-xl text-gray-600">
								Every aspect of yoghurt production, optimized and automated
							</p>
						</div>

						<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
							{features.map((feature, index) => (
								<Card
									key={index}
									className="group overflow-hidden p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
									style={{
										animation: `fadeSlideUp 0.5s ease-out forwards ${index * 0.1}s`
									}}
								>
									<div className="bg-gradient-primary bg-opacity-10 group-hover:bg-gradient-primary mb-4 flex h-14 w-14 items-center justify-center rounded-xl transition-colors duration-300">
										{React.cloneElement(feature.icon, {
											className:
												'h-7 w-7 text-indigo-600 group-hover:text-white transition-colors duration-300'
										})}
									</div>
									<h3 className="mb-3 text-xl font-semibold text-gray-900">
										{feature.title}
									</h3>
									<p className="text-gray-600">{feature.description}</p>
								</Card>
							))}
						</div>
					</div>
				</section>

				<section className="relative overflow-hidden px-6 py-24 sm:px-8 md:px-12 lg:px-16 xl:px-24">
					<div className="bg-gradient-primary absolute inset-0 opacity-[0.03]" />
					<div className="relative mx-auto max-w-4xl text-center">
						<h2 className="mb-6 text-4xl font-bold text-gray-900 sm:text-5xl">
							Ready to Transform Your
							<span className="text-gradient"> Production?</span>
						</h2>
						<p className="mb-10 text-xl text-gray-600">
							Join the future of yoghurt production management with our
							AI-powered solution.
						</p>
						<Button
							size="lg"
							className="bg-gradient-primary text-white hover:opacity-90"
						>
							Get Started Today
						</Button>
					</div>
				</section>
			</main>

			<footer className="bg-gray-900 py-16 text-white">
				<div className="container mx-auto px-4">
					<div className="grid gap-12 md:grid-cols-3">
						<div>
							<div className="mb-6 flex items-center space-x-2">
								<MilkIcon className="h-8 w-8 text-indigo-400" />
								<h3 className="text-xl font-bold text-white">
									Yoghurt AI Production
								</h3>
							</div>
							<p className="leading-relaxed text-gray-400">
								Revolutionizing yoghurt production with AI-powered management
								and optimization.
							</p>
						</div>
						<div>
							<h3 className="mb-6 text-lg font-semibold">Quick Links</h3>
							<ul className="space-y-4">
								<li>
									<a
										href="#features"
										className="text-gray-400 transition-colors hover:text-white"
									>
										Features
									</a>
								</li>
								<li>
									<a
										href="#benefits"
										className="text-gray-400 transition-colors hover:text-white"
									>
										Benefits
									</a>
								</li>
								<li>
									<a
										href="#about"
										className="text-gray-400 transition-colors hover:text-white"
									>
										About
									</a>
								</li>
								<li>
									<a
										href="/login"
										className="text-gray-400 transition-colors hover:text-white"
									>
										Log In
									</a>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="mb-6 text-lg font-semibold">Contact</h3>
							<address className="space-y-3 text-gray-400 not-italic">
								<p>Email: contact@yoghurt-ai.com</p>
								<p>Phone: +1 (555) 123-4567</p>
								<p>Address: 123 Dairy Lane, Yoghurt City</p>
							</address>
						</div>
					</div>
					<div className="mt-12 border-t border-gray-800 pt-8 text-center">
						<p className="text-gray-500">
							© {new Date().getFullYear()} Yoghurt AI Production. All rights
							reserved.
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
}
