'use client';

import React, { useState } from 'react';
import { FiTrendingUp, FiAlertTriangle, FiBook, FiAward, FiChevronDown } from 'react-icons/fi';

interface Insight {
  title: string;
  category: string;
  content: string;
}

const businessInsights: Insight[] = [
  {
    title: "Realistic Capital Requirements",
    category: "Capital",
    content: "Typical dropshipping launch reserves range from $300 to $1,500. This covers website platform fees ($29-39/mo), domain and email ($20/yr), test product sample orders ($100-200), and initial ad testing budget ($200-800)."
  },
  {
    title: "Sustainable Margin Thresholds",
    category: "Economics",
    content: "DTC stores require a minimum 35% net margin before ad acquisition costs. Products priced under $30 struggle to remain profitable once TikTok/Meta ad CPAs exceed $15."
  },
  {
    title: "Carrier Lead Times & Retention",
    category: "Fulfillment",
    content: "Over 38% of online shoppers state they will not buy again from a merchant after a delayed shipping experience. Prioritize suppliers providing 5-10 day regional fulfillment over cheap 25-day sea freight."
  },
  {
    title: "Market Validation Protocol",
    category: "Research",
    content: "Successful operators spend over 60% of preparation time analyzing existing competitor ads in the Meta Ad Library and TikTok Creative Center to identify unsaturated hooks before ordering inventory."
  },
  {
    title: "Chargeback & Dispute Prevention",
    category: "Risk",
    content: "Payment gateways (Stripe/Shopify Payments) closely monitor dispute ratios. Keeping disputes below 0.65% requires sending automatic tracking numbers upon dispatch and offering easy 1-click refund resolutions."
  },
];

export default function BusinessInsights() {
  const [activeInsight, setActiveInsight] = useState<number | null>(0);

  const toggleInsight = (index: number) => {
    setActiveInsight(activeInsight === index ? null : index);
  };

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-black dark:text-white">
            Operational Best Practices & Field Insights
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">Essential unit economics and supplier principles</p>
        </div>
        <span className="badge-mono badge-mono-outline">Executive Guide</span>
      </div>

      <div className="space-y-2.5">
        {businessInsights.map((insight, index) => {
          const isOpen = activeInsight === index;
          return (
            <div
              key={index}
              className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden transition-colors"
            >
              <button
                onClick={() => toggleInsight(index)}
                className="w-full p-3.5 text-left flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-zinc-400">0{index + 1}</span>
                  <span className="text-xs font-semibold text-black dark:text-white">{insight.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-500">
                    {insight.category}
                  </span>
                  <FiChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-3.5 pt-1 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/30">
                  {insight.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}