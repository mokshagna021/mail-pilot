import { GoogleGenerativeAI } from '@google/generative-ai';

export const callGeminiWithFallback = async ({ systemPrompt, prompt, tools, toolDeclarations }) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: systemPrompt
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (err) {
    console.warn("Gemini API call error (falling back to MailPilot AI Engine):", err.message);
    return null;
  }
};
