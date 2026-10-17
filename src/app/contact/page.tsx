'use client';

import React, { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiSend, FiCheckCircle } from 'react-icons/fi';
import { siteConfig } from '@/config/site';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'support',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 700));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="badge-mono badge-mono-black">Support & Inquiries</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-black dark:text-white tracking-tight mt-2">
            Get in touch with our team
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm mt-2">
            Have questions regarding wholesale catalogs, simulator mechanics, or API configurations?
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto">
          {/* Contact Details Card (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="card h-full p-8 flex flex-col justify-between space-y-6">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-400">Headquarters</span>
                <h3 className="text-xl font-bold text-black dark:text-white mt-1">Direct Channels</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                  Our developer and e-commerce research teams respond to all platform queries within 24 business hours.
                </p>

                <div className="space-y-4 mt-8 text-xs">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-black dark:text-white flex-shrink-0">
                      <FiMail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-black dark:text-white">Email Desk</p>
                      <a href={`mailto:${siteConfig.contact.email}`} className="text-zinc-500 hover:underline">
                        {siteConfig.contact.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-black dark:text-white flex-shrink-0">
                      <FiPhone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-black dark:text-white">Direct Line</p>
                      <span className="text-zinc-500">{siteConfig.contact.phone}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-black dark:text-white flex-shrink-0">
                      <FiMapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-black dark:text-white">Research Campus</p>
                      <span className="text-zinc-500 leading-relaxed block">{siteConfig.contact.address}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800">
                <span className="text-[11px] font-mono text-zinc-400">System Status: Operational • Response SLA &lt; 24h</span>
              </div>
            </div>
          </div>

          {/* Form Card (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="card p-8">
              {isSubmitted ? (
                <div className="text-center py-12 space-y-4 animate-in zoom-in-95">
                  <div className="w-12 h-12 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center mx-auto">
                    <FiCheckCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-black dark:text-white">Inquiry Received</h3>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                    Thank you for reaching out. A simulation specialist will review your ticket and respond to <strong>{formData.email}</strong> shortly.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: '', email: '', subject: 'support', message: '' });
                    }}
                    className="btn btn-outline text-xs mt-4"
                  >
                    Submit Another Query
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Riley Morgan"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-obsidian text-xs focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="riley@business.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-obsidian text-xs focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">
                      Inquiry Category
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-obsidian text-xs focus:outline-none"
                    >
                      <option value="support">Technical Support & Simulator Engine</option>
                      <option value="suppliers">Supplier Catalog Inquiries</option>
                      <option value="api">3rd-Party API Integration</option>
                      <option value="partnership">Academic & Institutional Licensing</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">
                      Message Details
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Please describe your question or feature suggestion..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-obsidian text-xs focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary w-full text-xs py-2.5 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? 'Transmitting Ticket...' : (
                      <>
                        <FiSend className="w-3.5 h-3.5" /> Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}