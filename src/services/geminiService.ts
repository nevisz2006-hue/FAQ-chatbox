import { GoogleGenAI } from "@google/genai";

const FAQ_DATA = [
  {
    question: "What is this chatbot?",
    answer: "This is a universal FAQ chatbot designed to help you with common questions about our services."
  },
  {
    question: "How do I contact support?",
    answer: "You can contact support by emailing support@example.com or calling 1-800-555-0199."
  },
  {
    question: "What are your business hours?",
    answer: "We are open Monday through Friday, 9:00 AM to 5:00 PM EST."
  },
  {
    question: "Do you offer a free trial?",
    answer: "Yes, we offer a 14-day free trial for all new users. No credit card required."
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. We use industry-standard encryption and security protocols to protect your data."
  }
];

const SYSTEM_INSTRUCTION = `
You are a helpful and professional FAQ Chatbot. Your goal is to provide accurate information based on the following FAQ data:

${FAQ_DATA.map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n')}

If a user asks a question that is not covered by the FAQ, try to answer it generally and politely, but prioritize the FAQ information. If you're unsure, suggest they contact support at support@example.com.
Keep your responses concise and friendly.
`;

export const getGeminiResponse = async (message: string, history: { role: string, parts: { text: string }[] }[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  
  const chat = ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
    history: history,
  });

  try {
    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to get response from AI. Please try again later.");
  }
};
