import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import {
	MilkIcon,
	BarChart3Icon,
	RocketIcon,
	DatabaseIcon,
	ClockIcon,
	CheckCircleIcon
} from 'lucide-react';

interface FeatureCardProps {
	icon: React.ReactNode;
	title: string;
	description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
	return (
		<div className="rounded-lg bg-white p-6 shadow-md">
			<div className="mb-4">{icon}</div>
			<h3 className="mb-2 text-xl font-semibold">{title}</h3>
			<p className="text-gray-600">{description}</p>
		</div>
	);
}

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
				<section className="bg-gradient-to-b from-blue-50 to-white py-20">
					<div className="container mx-auto px-4">
						<div className="mx-auto flex max-w-3xl flex-col items-center text-center">
							<h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl lg:text-6xl">
								AI-Powered Yoghurt Production Management
							</h1>
							<p className="mb-10 max-w-2xl text-xl text-gray-600">
								Optimize your yoghurt production, reduce waste, and improve
								quality with our intelligent production management system.
							</p>
							<div className="flex flex-wrap justify-center gap-4">
								<Link href="/login" className={buttonVariants({ size: 'lg' })}>
									Get Started
								</Link>
								<Link
									href="#features"
									className={buttonVariants({ variant: 'outline', size: 'lg' })}
								>
									Learn More
								</Link>
							</div>
						</div>
					</div>
				</section>

				{/* Features Section */}
				<section id="features" className="py-20">
					<div className="container mx-auto px-4">
						<h2 className="mb-12 text-center text-3xl font-bold">
							Key Features
						</h2>
						<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
							<FeatureCard
								icon={<MilkIcon className="h-10 w-10 text-blue-600" />}
								title="Batch Management"
								description="Create and track yoghurt batches with specific recipes and production parameters."
							/>
							<FeatureCard
								icon={<DatabaseIcon className="h-10 w-10 text-blue-600" />}
								title="Additive Tracking"
								description="Manage additives like fruit, probiotics, and flavors with complete traceability."
							/>
							<FeatureCard
								icon={<CheckCircleIcon className="h-10 w-10 text-blue-600" />}
								title="Quality Control"
								description="Monitor production quality in real-time and identify potential issues before they affect your product."
							/>
							<FeatureCard
								icon={<RocketIcon className="h-10 w-10 text-blue-600" />}
								title="AI Optimization"
								description="Use artificial intelligence to optimize production schedules and reduce waste."
							/>
							<FeatureCard
								icon={<ClockIcon className="h-10 w-10 text-blue-600" />}
								title="Production Scheduling"
								description="Create efficient production schedules that maximize resource utilization."
							/>
							<FeatureCard
								icon={<BarChart3Icon className="h-10 w-10 text-blue-600" />}
								title="Sales & Inventory"
								description="Track inventory levels and manage sales orders to ensure timely fulfillment."
							/>
						</div>
					</div>
				</section>

				{/* Benefits Section */}
				<section id="benefits" className="bg-gray-50 py-20">
					<div className="container mx-auto px-4">
						<h2 className="mb-12 text-center text-3xl font-bold">Benefits</h2>
						<div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
							<div className="rounded-lg bg-white p-6 shadow-md">
								<h3 className="mb-2 text-xl font-semibold">
									Operational Efficiency
								</h3>
								<p className="text-gray-600">
									Automate manual tasks and optimize resource use, reducing
									labor costs and increasing productivity.
								</p>
							</div>
							<div className="rounded-lg bg-white p-6 shadow-md">
								<h3 className="mb-2 text-xl font-semibold">Waste Reduction</h3>
								<p className="text-gray-600">
									Minimize spoilage and overproduction with AI-powered
									forecasting and inventory management.
								</p>
							</div>
							<div className="rounded-lg bg-white p-6 shadow-md">
								<h3 className="mb-2 text-xl font-semibold">
									Quality Improvement
								</h3>
								<p className="text-gray-600">
									Ensure consistent product standards through real-time
									monitoring and data-driven insights.
								</p>
							</div>
							<div className="rounded-lg bg-white p-6 shadow-md">
								<h3 className="mb-2 text-xl font-semibold">Scalability</h3>
								<p className="text-gray-600">
									Easily adapt to growing production demands with flexible
									scheduling and resource allocation.
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* About Section */}
				<section id="about" className="py-20">
					<div className="container mx-auto max-w-4xl px-4">
						<h2 className="mb-8 text-center text-3xl font-bold">
							About Yoghurt AI Production
						</h2>
						<div className="prose max-w-none text-gray-600">
							<p className="mb-4">
								Yoghurt AI Production Management System is a comprehensive
								solution designed specifically for yoghurt manufacturers who are
								looking to modernize their operations and leverage the power of
								artificial intelligence.
							</p>
							<p className="mb-4">
								Our system combines core production management functionality
								with advanced AI-driven optimization to help you produce better
								yoghurt more efficiently while reducing waste and maintaining
								consistent quality.
							</p>
							<p className="mb-4">
								Developed by industry experts with deep knowledge of dairy
								production processes, our platform addresses the unique
								challenges of yoghurt manufacturing, from managing cultures and
								additives to optimizing fermentation times and ensuring proper
								packaging.
							</p>
						</div>
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
