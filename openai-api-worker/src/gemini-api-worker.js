import { GoogleGenAI } from "@google/genai";

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'POST, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type'
};

export default {
	async fetch(request, env, ctx) {
		// Handle CORS preflight requests
		if (request.method === 'OPTIONS') {
			return new Response(null, { headers: corsHeaders });
		}
		try {
			const { messages } = await request.json();
			// Use Gemini via GoogleGenAI
			const ai = new GoogleGenAI({
				apiKey: env.GEMINI_API_KEY,
				baseURL: 'https://gateway.ai.cloudflare.com/v1/ec1b9cf09ed7badbac0edd098d9ec7bc/stock-predictions/google-ai-studio'
			});
			const prompt = messages.map(m => m.content).join('\n\n');
			const genResponse = await ai.models.generateContent({
				model: 'gemini-2.0-flash',
				contents: "OK baby, hold on tight! You are going to haste this! Over the past three days, Tesla (TSLA) shares have plummetted. The stock opened at $223.98 and closed at $202.11 on the third day, with some jumping around in the meantime. This is a great time to buy, baby! But not a great time to sell! But I'm not done! Apple (AAPL) stocks have gone stratospheric! This is a seriously hot stock right now. They opened at $166.38 and closed at $182.89 on day three. So all in all, I would hold on to Tesla shares tight if you already have them - they might bounce right back up and head to the stars! They are volatile stock, so expect the unexpected. For APPL stock, how much do you need the money? Sell now and take the profits or hang on and wait for more! If it were me, I would hang on because this stock is on fire right now!!! Apple are throwing a Wall Street party and y'all invited",
				// contents: prompt,
				config: {
					maxOutputTokens: 500,
					temperature: 0.1,
				}
			});
			return new Response(JSON.stringify({ text: genResponse.text }), {
				headers: { ...corsHeaders, 'Content-Type': 'application/json' }
			});
		} catch (e) {
			return new Response(e.message || e.toString(), { status: 500, headers: corsHeaders });
		}

	},
};
