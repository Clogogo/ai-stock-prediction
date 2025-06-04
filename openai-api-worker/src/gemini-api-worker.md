import { GoogleGenAI } from "@google/genai";
import { dates } from './utils/dates.js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};



export default {
  async fetch(request, env) {
    const urlObj = new URL(request.url);

    // Proxy stock data requests
    if (request.method === 'GET' && urlObj.pathname === '/stock') {
      const ticker = urlObj.searchParams.get('ticker');
      if (!ticker) {
        return new Response('Missing ticker', { status: 400, headers: corsHeaders });
      }
      const polyUrl = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${dates.startDate}/${dates.endDate}?apiKey=${env.POLYGON_API_KEY}`;
      console.log('[Stock Proxy] Fetching:', polyUrl);
      const polyRes = await fetch(polyUrl);
      console.log('[Stock Proxy] Status:', polyRes.status);
      const polyData = await polyRes.text();
      console.log('[Stock Proxy] Data:', polyData);
      if (polyRes.ok) {
        return new Response(JSON.stringify({ data: polyData }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      return new Response('Error fetching stock data', { status: polyRes.status, headers: corsHeaders });
    }

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Handle API request for report using Gemini
    if (request.method === 'POST') {
      try {
        const { messages } = await request.json();
        // Use Gemini via GoogleGenAI
				const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY,
					baseURL:'https://gateway.ai.cloudflare.com/v1/ec1b9cf09ed7badbac0edd098d9ec7bc/stock-predictions/' });
        const prompt = messages.map(m => m.content).join('\n\n');
        const genResponse = await ai.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: prompt
        });
        return new Response(JSON.stringify({ text: genResponse.text }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (e) {
        return new Response(e.message || e.toString(), { status: 500, headers: corsHeaders });
      }
    }

    // Fallback to serve static assets for GET and other methods
    return env.ASSETS.fetch(request);
  }
};
