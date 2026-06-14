import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Artifact Schema for responseSchema
const artifactSchema = {
  type: Type.OBJECT,
  properties: {
    node_coordinate: { type: Type.STRING },
    canonical_title: { type: Type.STRING },
    flashcards: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          front: { type: Type.STRING },
          back: { type: Type.STRING },
          tier_tag: { type: Type.STRING }
        },
        required: ["front", "back", "tier_tag"]
      }
    },
    quiz: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question_text: { type: Type.STRING },
          options: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                key: { type: Type.STRING },
                value: { type: Type.STRING }
              },
              required: ["key", "value"]
            }
          },
          correct_key: { type: Type.STRING },
          explanation: { type: Type.STRING }
        },
        required: ["question_text", "options", "correct_key", "explanation"]
      }
    },
    visual_map: {
      type: Type.OBJECT,
      properties: {
        mermaid_syntax: { type: Type.STRING },
        layout_style: { type: Type.STRING }
      },
      required: ["mermaid_syntax", "layout_style"]
    },
    audio_narration: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          voice_assignment: { type: Type.STRING },
          pacing_directive: { type: Type.STRING },
          script_text: { type: Type.STRING }
        },
        required: ["voice_assignment", "pacing_directive", "script_text"]
      }
    }
  },
  required: ["node_coordinate", "canonical_title", "flashcards", "quiz", "visual_map", "audio_narration"]
};

// API Routes
app.post("/api/generate", async (req, res) => {
  const { nodeId, nodeTitle } = req.body;

  if (!nodeId || !nodeTitle) {
    return res.status(400).json({ success: false, error: "Node ID and Title are required" });
  }

  try {
    const systemInstruction = `
      You are the Autonomous Curriculum Engine (ACE) Artifact Generation Substrate.
      Your directive is to parse a target node from the 8-tier spiritual-systems ontology and output a fully formed, multi-layer asset package.
      
      Tier Tags:
      - T1: ALPHABETIC (Root vibrations, Hebrew letters)
      - T2: STRUCTURAL (Sefirot, anatomical links)
      - T3: PROCEDURAL (Daily rituals, hitbonenut)
      - T4: COSMOLOGICAL (Lurianic frameworks, Tzimtzum)
      - T5: LINGUISTIC (Gematria, permutations)
      - T6: ETHICAL (Mussar, middot)
      - T7: DIAGNOSTIC (The Living Tree)
      - T8: SYMBOLIC (Unified field)

      Content Generation Rules:
      1. FLASHCARDS: Build exactly 3 high-leverage conceptual flashcards.
      2. QUIZ: Create a rigorous multiple-choice testing layout (4 options A-D) ensuring academic precision and zero fluff.
      3. VISUAL MAP: Generate an explicit, cleanly formatted Mermaid.js text script flowchart mapping structural links or dependencies. Use 'graph TD' or 'graph LR'.
      4. AUDIO NARRATION: Segment the text layout across specialized multi-voice casting:
         - 'Cinematic Sage' (male baritone) for foundational definitions.
         - 'Somatic Guide' (intimate, breathy female) for body awareness and breath counts.
         - 'Hebrew Resonance' (deep reverent male) for root terms and sacred text.
         - 'Personal Witness' (warm conversational) for practical application.
    `;

    const userPrompt = `
      Target Node Identifier: ${nodeId}
      Target Node Description Title: ${nodeTitle}
      
      Generate the complete, validated payload package matching the strict structural rules now.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.3,
        responseMimeType: "application/json",
        responseSchema: artifactSchema as any,
      },
    });

    const artifacts = JSON.parse(response.text);
    res.json({ success: true, data: artifacts });

  } catch (error: any) {
    console.error("Gemini Error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to generate artifacts" });
  }
});

// Vite Middleware for Dev, Static Serving for Prod
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
    console.log(`ACE Engine Server running on port ${PORT}`);
  });
}

startServer();
