import { config } from "../config";

export const getAIAdvice = async (characterId: string, userInput: string) => {
  try {
    const response = await fetch(`${config.apiUrl}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        characterId,
        userInput,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to get AI response");
    }

    return await response.json();
  } catch (error: unknown) {
    console.error("Error getting AI advice:", error);
    if (error instanceof Error && error.message.includes("rate limit")) {
      return "I'm receiving too many requests. Please wait a moment.";
    }
    return "An error occurred. Please try again later.";
  }
};
