export const getAIAdvice = async (characterId: string, userInput: string) => {
  try {
    const response = await fetch(
      "https://character-portal-dd8jv6tj1-toms-projects-589fd1bc.vercel.app/api/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          characterId,
          userInput,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to get AI response");
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting AI advice:", error);
    return "My mind is elsewhere at the moment. Try again shortly.";
  }
};
