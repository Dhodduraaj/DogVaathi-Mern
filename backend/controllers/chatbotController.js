import { GoogleGenerativeAI } from "@google/generative-ai";

// Simple rule-based fallback intents (used if Gemini is not configured or errors)
const intents = [
  {
    keywords: ["store", "shop", "supplement", "products"],
    reply:
      "You can browse all dog supplements in the Store. I can take you there: /store/products",
  },
  {
    keywords: ["achievement", "certificate", "award"],
    reply:
      "Dog Vaathi has multiple training achievements. Check them out here: /portfolio/achievements",
  },
  {
    keywords: ["video", "instagram", "reel", "youtube"],
    reply:
      "You can watch training videos on the Videos page: /portfolio/videos",
  },
  {
    keywords: ["order", "track"],
    reply:
      "You can track your orders under Orders: /store/orders",
  },
  {
    keywords: ["shipping", "delivery"],
    reply:
      "We usually ship within 24-48 hours. Deliveries within India typically take 3-7 business days.",
  },
  {
    keywords: ["recommend", "which", "supplement", "help"],
    reply:
      "For active dogs, joint and coat supplements work great. Always consult your vet before starting new supplements.",
  },
];

function getRuleBasedReply(message) {
  const lower = (message || "").toLowerCase();
  const intent =
    intents.find((i) =>
      i.keywords.some((k) => lower.includes(k.toLowerCase()))
    ) || null;

  return (
    intent?.reply ||
    "I can help you with Dog Vaathi’s store, achievements, videos, or your orders. Try asking about those."
  );
}

// Gemini client (lazy, via env var)
let geminiModel = null;
function getGeminiModel() {
  if (geminiModel) return geminiModel;
  const apiKey = (process.env.GEMINI_API_KEY || "").trim();
  if (!apiKey) return null;
  const genAI = new GoogleGenerativeAI(apiKey);
  geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  return geminiModel;
}

export const chatWithBot = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ message: "Message is required" });
    }

    const model = getGeminiModel();

    // If Gemini is not configured, use simple rule-based reply
    if (!model) {
      const reply = getRuleBasedReply(message);
      return res.json({ reply });
    }

    const systemPrompt =
    "You are Dog Vaathi's website assistant and a helpful dog care guide. " +
    "Answer briefly (1-3 sentences) in a friendly and helpful tone. " +
    "You can answer questions related to dogs, dog care, dog training, dog food, dog supplements, puppy care, and dog health. " +
    "If the question is about this website, you can guide users to these sections: " +
    "/store/products for dog supplements, " +
    "/portfolio/achievements for Dog Vaathi's achievements, " +
    "/portfolio/videos for dog training videos, " +
    "and /store/orders for a user's order history. " +
    "Do NOT invent new URLs. " +
    "If a question is unrelated to dogs, dog care, dog training, dog food, dog supplements, or this website, politely explain that you specialize in helping with Dog Vaathi's website and dog-related topics.";
  
    const result = await model.generateContent([
      systemPrompt,
      `User: ${message}`,
    ]);
    const response = await result.response;
    const text = (response && response.text && response.text()) || "";

    const reply = text.trim() || getRuleBasedReply(message);
    res.json({ reply });
  } catch (error) {
    console.error("Chatbot (Gemini) error:", error);
    const fallback = getRuleBasedReply(req.body?.message || "");
    res.json({ reply: fallback });
  }
};

