import { NextRequest, NextResponse } from 'next/server';

/**
 * Server-Side Secure Gemini AI Route
 * Guards the GEMINI_API_KEY on the server; client never receives or inspects the key.
 */
export async function POST(req: NextRequest) {
  try {
    const { prompt, systemInstruction } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Resolve API key strictly on server (or optional runtime header)
    const runtimeKey = req.headers.get('x-runtime-key');
    const apiKey = (runtimeKey && runtimeKey.trim().length > 0 ? runtimeKey.trim() : null) || process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_AI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured on the server.' },
        { status: 500 }
      );
    }

    const candidateModels = [
      'gemini-2.0-flash',
      'gemini-1.5-flash',
      'gemini-1.5-flash-8b',
      'gemini-1.5-pro',
      'gemini-flash-latest',
      'gemini-3.8-flash',
      'gemini-3.5-flash'
    ];

    let lastError = 'Failed to generate response';

    for (const model of candidateModels) {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const payload: any = {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
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
          const errData = await response.json().catch(() => ({}));
          lastError = errData.error?.message || `Status ${response.status}`;
          continue;
        }

        const data = await response.json();
        const parts = data.candidates?.[0]?.content?.parts || [];
        const textPart = parts.find((p: any) => typeof p.text === 'string' && p.text.length > 0);

        if (textPart && textPart.text) {
          return NextResponse.json({ text: textPart.text, model });
        }
      } catch (err: any) {
        lastError = err.message;
      }
    }

    return NextResponse.json({ error: lastError }, { status: 502 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
