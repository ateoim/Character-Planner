import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { OpenAI } from "openai";
import { characterPrompts } from "./prompts";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: [
      "https://ateoim.github.io",
      "http://localhost:5173",
      "https://ateoim.github.io/Character-Planner",
    ],
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use("/api/", limiter);

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/chat", async (req, res) => {
  try {
    const { characterId, userInput } = req.body;

    if (!characterPrompts[characterId as keyof typeof characterPrompts]) {
      return res.status(400).json({
        error: `Character prompt not found for: ${characterId}`,
      });
    }

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

    res.json(response.choices[0].message.content);
  } catch (error) {
    console.error("OpenAI API error:", error);
    res.status(500).json({
      error:
        error instanceof Error ? error.message : "Failed to get AI response",
    });
  }
});

app.options("*", cors());

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
