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
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Home() {
	return (
		<div className="flex min-h-screen flex-col">
			<header className="bg-white shadow-sm">
				<div className="container mx-auto flex items-center justify-between px-4 py-4">
					<div className="flex items-center space-x-2">
						<MilkIcon className="h-6 w-6 text-blue-600" />
						<h1 className="text-xl font-bold">Yoghurt AI Production</h1>
					</div>
					<nav>
						<ul className="flex space-x-6">
							<li>
								<Link
									href="#features"
									className="text-gray-600 hover:text-blue-600"
								>
									Features
								</Link>
							</li>
							<li>
								<Link
									href="#benefits"
									className="text-gray-600 hover:text-blue-600"
								>
									Benefits
								</Link>
							</li>
							<li>
								<Link
									href="#about"
									className="text-gray-600 hover:text-blue-600"
								>
									About
								</Link>
							</li>
							<li>
								<Link
									href="/login"
									className={buttonVariants({ variant: 'outline', size: 'sm' })}
								>
									Log In
								</Link>
							</li>
						</ul>
					</nav>
				</div>
			</header>

			<main className="flex-1">
				{/* Hero Section */}
				<section className="relative overflow-hidden px-6 py-24 sm:px-8 md:px-12 lg:px-16 xl:px-24">
					<div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 opacity-50" />
					<div className="relative mx-auto max-w-7xl">
						<div className="animate-fadeIn space-y-8 text-center">
							<span className="inline-block rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-600">
								AI-Powered Management System
							</span>
							<h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
								Revolutionary Yoghurt Production Management
							</h1>
							<p className="mx-auto max-w-2xl text-xl text-gray-600">
								Optimize your production processes, reduce waste, and enhance
								efficiency with our AI-driven system.
							</p>
							<div className="flex justify-center gap-4">
								<Button size="lg" className="bg-primary hover:bg-primary/90">
									Request Demo <ArrowRight className="ml-2 h-4 w-4" />
								</Button>
								<Button size="lg" variant="outline">
									Learn More
								</Button>
							</div>
						</div>
					</div>
				</section>

				{/* Features Section */}
				<section className="bg-white px-6 py-24 sm:px-8 md:px-12 lg:px-16 xl:px-24">
					<div className="mx-auto max-w-7xl">
						<div className="mb-16 text-center">
							<h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
								Comprehensive Production Management
							</h2>
							<p className="mt-4 text-lg text-gray-600">
								Every aspect of yoghurt production, optimized and automated
							</p>
						</div>

						<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
							{features.map((feature, index) => (
								<Card
									key={index}
									className="animate-slideUp p-6 transition-shadow hover:shadow-lg"
									style={{
										animationDelay: `${index * 100}ms`
									}}
								>
									<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
										{feature.icon}
									</div>
									<h3 className="mb-2 text-xl font-semibold text-gray-900">
										{feature.title}
									</h3>
									<p className="text-gray-600">{feature.description}</p>
								</Card>
							))}
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className="bg-gradient-to-br from-blue-50 to-green-50 px-6 py-24 sm:px-8 md:px-12 lg:px-16 xl:px-24">
					<div className="mx-auto max-w-4xl text-center">
						<h2 className="mb-6 text-3xl font-bold text-gray-900 sm:text-4xl">
							Ready to Transform Your Production?
						</h2>
						<p className="mb-8 text-xl text-gray-600">
							Join the future of yoghurt production management with our
							AI-powered solution.
						</p>
						<Button size="lg" className="bg-primary hover:bg-primary/90">
							Get Started Today
						</Button>
					</div>
				</section>
			</main>

			<footer className="bg-gray-800 py-12 text-white">
				<div className="container mx-auto px-4">
					<div className="grid gap-8 md:grid-cols-3">
						<div>
							<h3 className="mb-4 text-lg font-semibold">
								Yoghurt AI Production
							</h3>
							<p className="text-gray-300">
								Revolutionizing yoghurt production with AI-powered management
								and optimization.
							</p>
						</div>
						<div>
							<h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
							<ul className="space-y-2">
								<li>
									<Link
										href="#features"
										className="text-gray-300 hover:text-white"
									>
										Features
									</Link>
								</li>
								<li>
									<Link
										href="#benefits"
										className="text-gray-300 hover:text-white"
									>
										Benefits
									</Link>
								</li>
								<li>
									<Link
										href="#about"
										className="text-gray-300 hover:text-white"
									>
										About
									</Link>
								</li>
								<li>
									<Link
										href="/login"
										className="text-gray-300 hover:text-white"
									>
										Log In
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="mb-4 text-lg font-semibold">Contact</h3>
							<address className="text-gray-300 not-italic">
								<p>Email: contact@yoghurt-ai.com</p>
								<p>Phone: +1 (555) 123-4567</p>
								<p>Address: 123 Dairy Lane, Yoghurt City</p>
							</address>
						</div>
					</div>
					<div className="mt-8 border-t border-gray-700 pt-8 text-center">
						<p className="text-gray-400">
							© {new Date().getFullYear()} Yoghurt AI Production. All rights
							reserved.
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
}

const features = [
	{
		icon: <Brain className="h-6 w-6 text-blue-600" />,
		title: 'AI-Driven Optimization',
		description:
			'Leverage artificial intelligence to optimize production schedules and reduce waste.'
	},
	{
		icon: <Factory className="h-6 w-6 text-blue-600" />,
		title: 'Batch Management',
		description:
			'Create and manage yoghurt batches with precise recipe control and tracking.'
	},
	{
		icon: <Shapes className="h-6 w-6 text-blue-600" />,
		title: 'Additive Tracking',
		description:
			'Monitor and manage additives with complete traceability throughout production.'
	},
	{
		icon: <LineChart className="h-6 w-6 text-blue-600" />,
		title: 'Real-time Analytics',
		description: 'Monitor production metrics and quality control in real-time.'
	},
	{
		icon: <Cpu className="h-6 w-6 text-blue-600" />,
		title: 'Smart Automation',
		description: 'Automate routine tasks and streamline production workflows.'
	},
	{
		icon: <BarChart2 className="h-6 w-6 text-blue-600" />,
		title: 'Production Insights',
		description: 'Gain valuable insights to improve efficiency and quality.'
	}
];
