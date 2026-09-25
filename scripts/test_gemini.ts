import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

async function testGemini() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  console.log('API Key present:', !!apiKey);
  if (!apiKey) {
    console.log('No API key found in process.env!');
    return;
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const models = [
    'gemini-2.5-flash',
    'gemini-3.8-flash',
    'gemini-3.5-flash',
    'gemini-3.1-flash-lite',
    'gemini-flash-latest'
  ];

  for (const model of models) {
    try {
      console.log(`Testing model: ${model}...`);
      const response = await ai.models.generateContent({
        model,
        contents: 'Hello, respond with exactly "OK" if you receive this.',
      });
      console.log(`Success with ${model}! Response:`, response.text?.trim());
    } catch (err: any) {
      console.error(`Failed with ${model}:`, err.message || err);
    }
  }
}

testGemini();
