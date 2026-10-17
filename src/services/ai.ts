/**
 * Gemini AI Integration Service
 * Powers AI Dropshipping Advisor, Ad Copy Generation, and Market Strategy
 * Works with any standard Google Gemini API Key (e.g. gemini-1.5-flash)
 */

export interface AIAdvisorRequest {
  day: number;
  revenue: number;
  expenses: number;
  profit: number;
  orders: number;
  inventory: number;
  conversionRate: number;
  currentEvent?: string | null;
}

export interface AIProductCopyRequest {
  productName: string;
  category: string;
  cost: number;
  potentialPrice: number;
}

let runtimeAiApiKey: string = '';

/**
 * Set Gemini API key in runtime memory (prevents clear-text localStorage storage)
 */
export function setRuntimeAiApiKey(key: string): void {
  runtimeAiApiKey = key.trim();
}

/**
 * Get active Gemini API key from runtime memory or environment variables
 */
export function getGeminiApiKey(): string {
  if (runtimeAiApiKey && runtimeAiApiKey.length > 0) {
    return runtimeAiApiKey;
  }
  return (
    process.env.NEXT_PUBLIC_AI_API_KEY || 
    process.env.NEXT_PUBLIC_GEMINI_API_KEY || 
    process.env.GEMINI_API_KEY || 
    ''
  );
}

/**
 * Call Gemini REST API with model fallback cascade
 */
async function callGeminiApi(prompt: string, systemInstruction?: string): Promise<string> {
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    throw new Error('No Gemini API Key found. Please add your Gemini API key in Settings (/settings) or NEXT_PUBLIC_AI_API_KEY in .env.local.');
  }

  // Model cascade: gemini-3.8-flash is primary, fallback to 3.5, flash-latest, and 1.5
  const candidateModels = [
    'gemini-3.8-flash',
    'gemini-3.5-flash',
    'gemini-flash-latest',
    'gemini-1.5-flash'
  ];

  let lastError: Error | null = null;

  for (const model of candidateModels) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const payload: any = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
      }
    };

    if (systemInstruction) {
      payload.systemInstruction = {
        parts: [{ text: systemInstruction }]
      };
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        const message = errorJson.error?.message || `Gemini API returned status ${response.status}`;
        lastError = new Error(message);
        continue; // Try next model in cascade
      }

      const data = await response.json();
      const parts = data.candidates?.[0]?.content?.parts || [];
      const textPart = parts.find((p: any) => typeof p.text === 'string' && p.text.length > 0);
      
      if (textPart && textPart.text) {
        return textPart.text;
      }
    } catch (err: any) {
      lastError = err;
    }
  }

  throw lastError || new Error('Failed to generate response from Gemini API.');
}

/**
 * 1. AI Strategic Advisor for Store Operations
 */
export async function getStoreAiAdvice(stats: AIAdvisorRequest): Promise<string> {
  const systemInstruction = 
    "You are an elite, no-nonsense e-commerce and dropshipping strategist. Analyze current business metrics and give 3 sharp, highly actionable bullet points to optimize profitability, ad spend, and inventory.";

  const prompt = `
Current Store Operations Snapshot:
- Operational Day: ${stats.day}
- Total Revenue: $${stats.revenue.toFixed(2)}
- Total Expenses: $${stats.expenses.toFixed(2)}
- Net Profit: $${stats.profit.toFixed(2)}
- Orders Fulfilled: ${stats.orders}
- Available Inventory Units: ${stats.inventory}
- Current Conversion Rate: ${stats.conversionRate.toFixed(2)}%
- Active Market Event: ${stats.currentEvent || 'None (Normal market conditions)'}

Provide:
1. Executive Assessment (1 sentence)
2. Immediate Action Plan (3 specific bullet points addressing inventory, ad budget, or margins)
3. One Pro Caution (e.g. chargeback risk, supplier delay, ad fatigue)
Keep formatting minimalist and concise.
`;

  return await callGeminiApi(prompt, systemInstruction);
}

/**
 * 2. AI Viral Ad Hook & Product Description Generator
 */
export async function generateProductCopy(params: AIProductCopyRequest): Promise<string> {
  const systemInstruction =
    "You are an expert direct-to-consumer (DTC) e-commerce copywriter specialized in TikTok & Meta viral ads. Generate compelling high-converting hooks.";

  const margin = (((params.potentialPrice - params.cost) / params.potentialPrice) * 100).toFixed(0);

  const prompt = `
Product: ${params.productName}
Category: ${params.category}
Wholesale Landed Cost: $${params.cost.toFixed(2)}
Retail Price: $${params.potentialPrice.toFixed(2)}
Profit Margin: ${margin}%

Generate:
1. 3 High-Converting TikTok / Reel Video Ad Hooks
2. Compelling 2-sentence Value Proposition
3. Recommended Target Audience Angle
`;

  return await callGeminiApi(prompt, systemInstruction);
}
