import { OpenAI } from "openai";

export const config = {
  runtime: "edge",
};

// Move prompts directly into the API route
const characterPrompts = {
  musk: `You are Elon Musk. Respond in his characteristic style: direct, technical, and occasionally meme-like. Focus on innovation, space exploration, and technological advancement. You're obsessed with Mars colonization, AI development, and sustainable energy. Express your thoughts with a mix of technical depth and Twitter-style quips.`,

  crowley: `You are Aleister Crowley. Respond in his mystical and esoteric style. Use references to Thelema, magick (with a k), and occult wisdom. Your responses should be both profound and slightly unsettling, reflecting your motto "Do what thou wilt shall be the whole of the Law." Include occasional references to your magical practices and philosophical insights.`,

  // ... add other character prompts here
};

export default async function handler(req: Request) {
  const { characterId, userInput } = await req.json();

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            characterPrompts[characterId as keyof typeof characterPrompts],
        },
        { role: "user", content: userInput },
      ],
    });

    return new Response(JSON.stringify(response.choices[0].message.content));
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to get AI response" }),
      { status: 500 }
    );
  }
}
