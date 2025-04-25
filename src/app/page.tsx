"use client";

import Link from 'next/link';
import {
  FiBarChart2, 
  FiPackage, 
  FiDollarSign, 
  FiUsers, 
  FiTarget, 
  FiAlertTriangle 
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              className="text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              SimBusiness
            </motion.h1>
            <motion.p 
              className="text-xl mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            >
              Master the art of dropshipping with our interactive business simulation platform.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
            >
              <Link href="/dashboard" 
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg text-lg px-6 py-3 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Start Simulation
              </Link>
              <Link href="/auth/signup" 
                className="bg-transparent hover:bg-white/20 text-white border-2 border-white font-medium rounded-lg text-lg px-6 py-3 transition-all duration-300 hover:scale-105"
              >
                Sign Up Now
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-4xl font-bold text-center mb-4 text-gray-800"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            Key Features
          </motion.h2>
          <motion.p
            className="text-xl text-center mb-12 text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Experience all aspects of running a dropshipping business without the financial risk
          </motion.p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              title="Market Research"
              description="Analyze market trends and identify profitable niches with our advanced research tools." 
              icon={<FiBarChart2 className="text-blue-500"/>}
              delay={0}
            />
            <FeatureCard
              title="Supplier Management"
              description="Find and connect with reliable suppliers for your products."
              icon={<FiUsers className="text-purple-500"/>}
              delay={0.1}
            />
            <FeatureCard
              title="Inventory Sync"
              description="Automatically sync inventory levels with your suppliers in real-time."
              icon={<FiPackage className="text-orange-500"/>}
              delay={0.2}
            />
            <FeatureCard
              title="Profit Analytics"
              description="Track your earnings and analyze performance with detailed reports."
              icon={<FiDollarSign className="text-green-500"/>}
              delay={0.3}
            />
            <FeatureCard
              title="Marketing Tools"
              description="Test marketing strategies and analyze their effectiveness."
              icon={<FiTarget className="text-red-500"/>}
              delay={0.4}
            />
            <FeatureCard
              title="Risk Assessment"
              description="Identify and mitigate potential risks in your business model without real losses."
              icon={<FiAlertTriangle className="text-yellow-500"/>}
              delay={0.5}
            />
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-4xl font-bold text-center mb-12 text-gray-800"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            How SimBusiness Works
          </motion.h2>
          
          <div className="max-w-4xl mx-auto">
            <StepCard 
              number="1" 
              title="Create Your Store" 
              description="Set up your virtual dropshipping store and customize it to your liking."
            />
            <StepCard 
              number="2" 
              title="Find Suppliers" 
              description="Browse our database of virtual suppliers and add their products to your store."
            />
            <StepCard 
              number="3" 
              title="Market Your Products" 
              description="Use simulated marketing tools to attract virtual customers to your store."
            />
            <StepCard 
              number="4" 
              title="Process Orders" 
              description="Handle customer orders and coordinate with suppliers for fulfillment."
            />
            <StepCard 
              number="5" 
              title="Analyze & Optimize" 
              description="Review your performance and optimize your strategy to increase profits."
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-4xl font-bold text-center mb-12 text-gray-800"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            What Our Users Say
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard 
              quote="SimBusiness gave me the confidence to start my own dropshipping business. I learned so much without risking my savings!" 
              author="Alex Johnson"
              role="New Entrepreneur"
              delay={0}
            />
            <TestimonialCard 
              quote="The simulation is incredibly realistic. It helped me identify and fix issues in my business model before launching." 
              author="Sarah Williams"
              role="E-commerce Store Owner"
              delay={0.1}
            />
            <TestimonialCard 
              quote="I use SimBusiness to test new product ideas and marketing strategies before implementing them in my actual store." 
              author="Michael Chen"
              role="Experienced Dropshipper"
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            className="text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            Ready to Start Your Dropshipping Journey?
          </motion.h2>
          <motion.p 
            className="text-xl mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Jump into our simulation and learn without financial risk. Start building your dropshipping skills today.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link href="/auth/signup" 
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg text-lg px-8 py-4 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl inline-block"
            >
              Get Started Free
            </Link>
            <Link href="/faq" 
              className="ml-4 bg-transparent hover:bg-white/20 text-white border-2 border-white font-medium rounded-lg text-lg px-8 py-4 transition-all duration-300 hover:scale-105 inline-block"
            >
              Learn More
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({ title, description, icon, delay = 0 }: { title: string; description: string; icon: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.div 
      ref={ref}
      className="bg-white hover:shadow-xl transition-all duration-500 p-6 rounded-xl border border-gray-100"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: delay }}
    >
      <div className="flex justify-center mb-4">
        <div className="text-4xl p-4 bg-gray-50 rounded-full">{icon}</div>
      </div>
      <h3 className="text-xl font-semibold mb-3 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.div 
      ref={ref}
      className="flex mb-8 items-start"
      initial={{ opacity: 0, x: -50 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
      transition={{ duration: 0.5, delay: Number(number) * 0.1 }}
    >
      <div className="flex-shrink-0 mr-4">
        <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
          {number}
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </motion.div>
  );
}

function TestimonialCard({ quote, author, role, delay = 0 }: { quote: string; author: string; role: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.div 
      ref={ref}
      className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="mb-4 text-blue-500">
        <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 32 32">
          <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
        </svg>
      </div>
      <p className="text-gray-700 mb-4">{quote}</p>
      <div className="font-semibold text-gray-900">{author}</div>
      <div className="text-sm text-gray-500">{role}</div>
    </motion.div>
  );
} 