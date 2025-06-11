import {
  Beaker,
  BarChart3,
  Package,
  ShoppingCart,
  Database,
  Brain,
  LineChart,
  Layers,
  CheckCircle,
  ArrowRight,
  ChevronDown
} from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Beaker className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">YoghurtAI</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">Features</a>
              <a href="#benefits" className="text-gray-700 hover:text-blue-600 transition-colors">Benefits</a>
              <a href="#system" className="text-gray-700 hover:text-blue-600 transition-colors">System</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</a>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Request Demo
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                AI-Powered Yoghurt Production Management System
              </h1>
              <p className="mt-4 text-xl text-gray-600 max-w-2xl">
                Revolutionize your yoghurt production with our intelligent system that optimizes processes, reduces waste, and ensures consistent quality.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-50 transition-colors">
                  Learn More
                </button>
              </div>
            </div>
            <div className="md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
                alt="Yoghurt Production"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Core Features</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive system manages all aspects of yoghurt production through intelligent modules
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="bg-blue-100 inline-block p-3 rounded-lg">
                <Beaker className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">Batch Formation</h3>
              <p className="mt-2 text-gray-600">
                Create and manage yoghurt batches with specific recipes and production parameters.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="bg-blue-100 inline-block p-3 rounded-lg">
                <Layers className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">Additive Tracking</h3>
              <p className="mt-2 text-gray-600">
                Manage the addition of additives like fruit and probiotics to batches with complete traceability.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="bg-blue-100 inline-block p-3 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">Packaging and Labeling</h3>
              <p className="mt-2 text-gray-600">
                Configure packaging options and generate labels for finished products with ease.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="bg-blue-100 inline-block p-3 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">Sales Order Management</h3>
              <p className="mt-2 text-gray-600">
                Handle customer orders and align them with inventory availability for timely fulfillment.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="bg-blue-100 inline-block p-3 rounded-lg">
                <Database className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">Inventory Management</h3>
              <p className="mt-2 text-gray-600">
                Track raw materials, additives, and finished products with forecasting capabilities.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="bg-blue-100 inline-block p-3 rounded-lg">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">AI Optimization</h3>
              <p className="mt-2 text-gray-600">
                Leverage AI to analyze batch data and optimize production schedules for waste reduction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* System Overview */}
      <section id="system" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">System Overview</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Our system is designed with a modular architecture to manage all aspects of yoghurt production
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Priority P0: Core Functionality</h3>

                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-blue-600 mb-2">Frontend Components</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Batch Formation</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Additive Tracking</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Packaging and Labeling</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Sales Order Management</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-blue-600 mb-2">Backend Services</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Batch Management Service</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Inventory Management Service</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Sales Order Processing Service</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="md:w-1/2 p-8 bg-blue-50">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Priority P1: Optimization and Quality Control</h3>

                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-blue-600 mb-2">Advanced Components</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Production Schedule Optimization</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Quality Control Dashboard</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-blue-600 mb-2">AI Services</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>AI Optimization Service</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Quality Control Service</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Key Benefits</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered system delivers significant advantages for modern yoghurt manufacturing
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-8 text-white">
              <BarChart3 className="h-12 w-12 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Operational Efficiency</h3>
              <p className="text-blue-100">
                Automates routine tasks and optimizes resource utilization, reducing manual effort and improving throughput.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 mt-0.5" />
                  <span>Streamlined batch management</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 mt-0.5" />
                  <span>Automated inventory tracking</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 mt-0.5" />
                  <span>Optimized production scheduling</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-8 text-white">
              <LineChart className="h-12 w-12 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Waste Reduction</h3>
              <p className="text-green-100">
                Minimizes spoilage and overproduction through intelligent forecasting and just-in-time production.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 mt-0.5" />
                  <span>Predictive inventory management</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 mt-0.5" />
                  <span>Optimized batch sizing</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 mt-0.5" />
                  <span>Reduced material waste</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-8 text-white">
              <CheckCircle className="h-12 w-12 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Quality Improvement</h3>
              <p className="text-purple-100">
                Ensures consistent product standards through real-time monitoring and quality control.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 mt-0.5" />
                  <span>Real-time quality monitoring</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 mt-0.5" />
                  <span>Automated quality alerts</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 mt-0.5" />
                  <span>Batch traceability</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-8 text-white">
              <Layers className="h-12 w-12 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Scalability</h3>
              <p className="text-orange-100">
                Adapts to growing production demands with a modular architecture that scales with your business.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 mt-0.5" />
                  <span>Modular system design</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 mt-0.5" />
                  <span>Flexible configuration</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 mt-0.5" />
                  <span>Enterprise-grade performance</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* AI Integration Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">AI Integration</h2>
            <p className="mt-4 text-xl text-blue-100 max-w-3xl mx-auto">
              Artificial intelligence is a cornerstone of our system, providing advanced capabilities
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
              <Brain className="h-12 w-12 mb-4" />
              <h3 className="text-xl font-bold mb-2">Schedule Optimization</h3>
              <p className="text-blue-100">
                AI analyzes historical production data, inventory levels, and sales orders to sequence batches efficiently, reducing downtime and waste.
              </p>
            </div>

            <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
              <BarChart3 className="h-12 w-12 mb-4" />
              <h3 className="text-xl font-bold mb-2">Waste Reduction</h3>
              <p className="text-blue-100">
                Predictive models identify excess inventory or expiring materials, adjusting production accordingly to minimize waste.
              </p>
            </div>

            <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
              <CheckCircle className="h-12 w-12 mb-4" />
              <h3 className="text-xl font-bold mb-2">Quality Assurance</h3>
              <p className="text-blue-100">
                Real-time analysis detects anomalies in production data, ensuring consistent quality across all batches.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Implementation Approach</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-blue-600 mb-2">Phase 1: Core Functionality</h3>
                  <p className="text-gray-600">
                    Develop frontend components for batch formation, additive tracking, packaging, and sales order management, along with supporting backend services.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-blue-600 mb-2">Phase 2: Optimization and Quality Control</h3>
                  <p className="text-gray-600">
                    Integrate AI algorithms into the production schedule optimization component and develop the quality control dashboard for real-time monitoring.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-blue-600 mb-2">Technical Architecture</h3>
                  <p className="text-gray-600">
                    The system uses a modular architecture with a central database. Frontend components are accessible via a web interface, while backend services are built with scalable frameworks.
                  </p>
                </div>
              </div>
            </div>

            <div className="md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1581092921461-7d65ca45393a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
                alt="Implementation Process"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-600 rounded-2xl shadow-xl overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 p-12 text-white">
                <h2 className="text-3xl font-bold mb-4">Ready to transform your yoghurt production?</h2>
                <p className="text-blue-100 mb-8">
                  Get in touch with our team to schedule a demo and see how our AI-powered system can optimize your operations.
                </p>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-blue-100 mb-1">Name</label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-2 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-blue-100 mb-1">Email</label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-2 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-blue-100 mb-1">Company</label>
                    <input
                      type="text"
                      id="company"
                      className="w-full px-4 py-2 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                      placeholder="Your company"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-white text-blue-600 font-medium py-2 px-4 rounded-md hover:bg-blue-50 transition-colors"
                  >
                    Request Demo
                  </button>
                </form>
              </div>
              <div className="md:w-1/2 bg-blue-700 p-12 flex items-center">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">Why Choose YoghurtAI?</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start text-blue-100">
                      <CheckCircle className="h-6 w-6 text-white mr-2 mt-0.5" />
                      <span>Comprehensive end-to-end solution for yoghurt production</span>
                    </li>
                    <li className="flex items-start text-blue-100">
                      <CheckCircle className="h-6 w-6 text-white mr-2 mt-0.5" />
                      <span>AI-driven optimization reduces waste by up to 30%</span>
                    </li>
                    <li className="flex items-start text-blue-100">
                      <CheckCircle className="h-6 w-6 text-white mr-2 mt-0.5" />
                      <span>Modular design allows for phased implementation</span>
                    </li>
                    <li className="flex items-start text-blue-100">
                      <CheckCircle className="h-6 w-6 text-white mr-2 mt-0.5" />
                      <span>Proven results with leading yoghurt manufacturers</span>
                    </li>
                    <li className="flex items-start text-blue-100">
                      <CheckCircle className="h-6 w-6 text-white mr-2 mt-0.5" />
                      <span>Dedicated support and continuous improvement</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Common questions about our AI-Powered Yoghurt Production Management System
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg">
                <button className="flex justify-between items-center w-full px-6 py-4 text-left">
                  <span className="text-lg font-medium text-gray-900">How long does implementation take?</span>
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                </button>
                <div className="px-6 pb-4">
                  <p className="text-gray-600">
                    Implementation typically takes 4-8 weeks for Phase 1 (core functionality) and an additional 4-6 weeks for Phase 2 (optimization and quality control), depending on the complexity of your production environment.
                  </p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg">
                <button className="flex justify-between items-center w-full px-6 py-4 text-left">
                  <span className="text-lg font-medium text-gray-900">What hardware requirements are needed?</span>
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                </button>
                <div className="px-6 pb-4">
                  <p className="text-gray-600">
                    The system requires sensors for milk volume measurement and quality parameters, standard computers for the frontend interface, and a server environment for the backend services and AI components.
                  </p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg">
                <button className="flex justify-between items-center w-full px-6 py-4 text-left">
                  <span className="text-lg font-medium text-gray-900">Can the system integrate with our existing ERP?</span>
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                </button>
                <div className="px-6 pb-4">
                  <p className="text-gray-600">
                    Yes, our system is designed with integration capabilities for major ERP systems. We provide standard APIs and custom connectors to ensure seamless data flow between systems.
                  </p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg">
                <button className="flex justify-between items-center w-full px-6 py-4 text-left">
                  <span className="text-lg font-medium text-gray-900">How is the AI model trained?</span>
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                </button>
                <div className="px-6 pb-4">
                  <p className="text-gray-600">
                    The AI models are initially trained on industry data and then fine-tuned with your specific production data over time. This ensures the optimization algorithms become increasingly effective for your unique operations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center">
                <Beaker className="h-8 w-8 text-blue-400" />
                <span className="ml-2 text-xl font-bold">YoghurtAI</span>
              </div>
              <p className="mt-2 text-gray-400 max-w-md">
                Revolutionizing yoghurt production with AI-powered management systems that optimize processes and reduce waste.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Product</h3>
                <ul className="mt-4 space-y-2">
                  <li><a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Pricing</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Case Studies</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Documentation</a></li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Company</h3>
                <ul className="mt-4 space-y-2">
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors">About</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Careers</a></li>
                  <li><a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Legal</h3>
                <ul className="mt-4 space-y-2">
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Terms</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Security</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-gray-800 pt-8">
            <p className="text-gray-400 text-center">
              &copy; 2025 YoghurtAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
