"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const openai_1 = require("openai");
const prompts_1 = require("./prompts");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: [
        "https://ateoim.github.io",
        "http://localhost:5173",
        "https://ateoim.github.io/Character-Planner",
    ],
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
    optionsSuccessStatus: 200,
}));
app.use(express_1.default.json());
const limiter = (0, express_rate_limit_1.default)({
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
const openai = new openai_1.OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
app.post("/api/chat", async (req, res) => {
    try {
        const { characterId, userInput } = req.body;
        if (!prompts_1.characterPrompts[characterId]) {
            return res.status(400).json({
                error: `Character prompt not found for: ${characterId}`,
            });
        }
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: prompts_1.characterPrompts[characterId],
                },
                { role: "user", content: userInput },
            ],
        });
        res.json(response.choices[0].message.content);
    }
    catch (error) {
        console.error("OpenAI API error:", error);
        res.status(500).json({
            error: error instanceof Error ? error.message : "Failed to get AI response",
        });
    }
});
app.options("*", (0, cors_1.default)());
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
