import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize express JSON middleware
app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Server-side API for birthday wishes generation
app.post("/api/generate-wishes", async (req, res) => {
  try {
    const { girlfriendName, senderName, favoriteThings, tone, promptOffset } = req.body;

    if (!girlfriendName) {
      return res.status(400).json({ error: "Girlfriend's name is required" });
    }

    const toneInstruction = tone === "romantic" 
      ? "deeply romantic, highly sentimental, emotional, heartwarming, and poetic" 
      : tone === "poetic"
      ? "written in elegant stanzas or a whimsical rhyme, beautiful and lyrical"
      : tone === "funny"
      ? "playful, lighthearted, filled with inside jokes, cute tease, and joyful humor"
      : "super sweet, cute, bubbly, and endearing";

    const favorDetail = favoriteThings ? `She absolutely loves: ${favoriteThings}. Incorporate these elements in a subtle, beautiful, and personalized way.` : "";
    const senderDetail = senderName ? `from her loving partner, ${senderName}` : "from her loving boyfriend";

    const prompt = `Write a beautiful, personalized 16th birthday greeting card message for a girl named "${girlfriendName}" ${senderDetail}.
The tone should be ${toneInstruction}.
${favorDetail}
This is her 16th birthday (Sweet Sixteen), which is a major milestone—make it feel magical, sparkling, and memorable.
Provide the response in a structured JSON object with the following fields:
- title: A cute, sweet headline for her card
- message: The main body of the letter/wish. Write about 3-4 paragraphs (or relevant elegant stanzas if poetic), highly engaging and specific.
- shortQuote: A brief, beautiful, copyable 1-line sweet quote (e.g. for Instagram caption or tiny note)
- threeWishes: An array of 3 magical virtual "wishes for her 16th year" (e.g., "1. Infinite starlight in your eyes...", "2. A year of blooming like the prettiest cherry blossom...")
- predictions: An array of 3 cute, warm, whimsical predictions of what her 16th year will bring.

Additional context seed: ${promptOffset || "first time wishing"}. Ensure high-quality writing, avoid cliche AI phrases like 'delve', 'beacon', 'testament', use natural charming words. Do not wrap JSON in markdown blocks in your final output, return raw JSON string.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const resultText = response.text || "{}";
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Error generating birthday wishes:", error);
    res.status(500).json({ error: error?.message || "Failed to generate wishes" });
  }
});

// Configure Vite and Asset Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Sweet 16 Birthday server running on http://localhost:${PORT}`);
  });
}

startServer();
