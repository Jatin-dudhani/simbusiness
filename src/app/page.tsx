import Link from 'next/link';
import {
  FiBarChart2, 
  FiPackage, 
  FiDollarSign, 
  FiUsers, 
  FiTarget, 
  FiAlertTriangle 
} from 'react-icons/fi';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">SimBusiness</h1>
            <p className="text-xl mb-8">Master the art of dropshipping with our interactive business simulation platform.</p>
            <div className="flex justify-center gap-4">
              <Link href="/dashboard" className="btn btn-accent text-lg px-6 py-3">
                Start Simulation
              </Link>
              <Link href="/market" className="btn btn-outline text-white border-white hover:bg-white hover:text-primary text-lg px-6 py-3">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              title="Market Analysis" 
              description="Analyze market trends and customer behavior to make informed decisions." 
              icon={<FiBarChart2 className="text-blue-500"/>} 
            />
            <FeatureCard 
              title="Inventory Management" 
              description="Track and manage your product inventory efficiently." 
              icon={<FiPackage className="text-orange-500"/>} 
            />
            <FeatureCard 
              title="Financial Tracking" 
              description="Monitor revenue, expenses, and profit margins in real-time." 
              icon={<FiDollarSign className="text-green-500"/>} 
            />
            <FeatureCard 
              title="Supplier Relationships" 
              description="Build and manage relationships with suppliers around the globe." 
              icon={<FiUsers className="text-purple-500"/>} 
            />
            <FeatureCard 
              title="Marketing Campaigns" 
              description="Create and analyze the effectiveness of various marketing strategies." 
              icon={<FiTarget className="text-red-500"/>} 
            />
            <FeatureCard 
              title="Risk Assessment" 
              description="Identify and mitigate potential risks in your business model." 
              icon={<FiAlertTriangle className="text-yellow-500"/>} 
            />
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Dropshipping Journey?</h2>
          <p className="text-xl mb-8">Jump into our simulation and learn without financial risk.</p>
          <Link href="/dashboard" className="btn btn-accent text-lg px-6 py-3">
            Start Simulating Now
          </Link>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) {
  return (
    <div className="card bg-white hover:shadow-lg transition-shadow p-6 text-center">
      <div className="flex justify-center mb-4">
        <div className="text-4xl p-3 bg-gray-100 rounded-full">{icon}</div>
      </div>
      <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
} 