import { useState } from 'react';
import { FiTrendingUp, FiAlertTriangle, FiBook, FiAward } from 'react-icons/fi';

export default function BusinessInsights() {
  const [activeInsight, setActiveInsight] = useState<number | null>(null);

  // Real-world dropshipping educational content
  const businessInsights = [
    {
      title: "Starting Costs",
      icon: <FiTrendingUp className="text-blue-500" />,
      content: "Typical dropshipping startup costs range from $150-$1,500. This includes website hosting ($29/month), premium theme ($60-180), apps/plugins ($50-100/month), and initial marketing ($100-1,000)."
    },
    {
      title: "Profit Margins",
      icon: <FiTrendingUp className="text-green-500" />,
      content: "Most successful dropshipping stores maintain a 15-40% profit margin. Products priced below $20 typically need at least 30% margin to be sustainable when accounting for returns and marketing costs."
    },
    {
      title: "Shipping Times",
      icon: <FiAlertTriangle className="text-yellow-500" />,
      content: "Shipping time is a major factor in customer satisfaction. 38% of customers will not return after a negative delivery experience. Consider suppliers that offer 7-14 day shipping or faster."
    },
    {
      title: "Market Research",
      icon: <FiBook className="text-purple-500" />,
      content: "Successful dropshippers spend 60% of their initial time on market research. Before launching products, analyze at least 5 competitors, review their feedback, shipping policies, and pricing strategies."
    },
    {
      title: "Return Rates",
      icon: <FiAlertTriangle className="text-red-500" />,
      content: "The average return rate for e-commerce is 20-30%. Physical products that customers can't try before buying (like clothing) have higher return rates. Factor this into your pricing strategy."
    },
    {
      title: "Success Rate",
      icon: <FiAward className="text-amber-500" />,
      content: "Only about 10% of dropshipping stores achieve sustainable success. The majority of successes come from entrepreneurs who tested multiple products before finding profitable ones and who maintained consistent marketing."
    }
  ];

  const toggleInsight = (index: number) => {
    setActiveInsight(activeInsight === index ? null : index);
  };

  return (
    <div className="card bg-white mb-8">
      <h2 className="text-xl font-semibold mb-4">Real-World Dropshipping Insights</h2>
      <div className="space-y-3">
        {businessInsights.map((insight, index) => (
          <div key={index} className="border rounded-lg overflow-hidden">
            <div 
              className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
              onClick={() => toggleInsight(index)}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-gray-100">
                  {insight.icon}
                </div>
                <span className="font-medium">{insight.title}</span>
              </div>
              <span>{activeInsight === index ? '−' : '+'}</span>
            </div>
            
            {activeInsight === index && (
              <div className="p-3 bg-gray-50 border-t">
                <p className="text-gray-700">{insight.content}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 