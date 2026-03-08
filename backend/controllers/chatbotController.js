// Simple rule-based chatbot for navigation and FAQs.
// Can be replaced later with OpenAI API integration.

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
    keywords: ["video", "instagram", "reel"],
    reply:
      "You can watch Instagram training videos on the Videos page: /portfolio/videos",
  },
  {
    keywords: ["order", "track"],
    reply:
      "You can track your orders in your account under Orders: /store/orders",
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

export const chatWithBot = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const lower = message.toLowerCase();
    const intent =
      intents.find((i) =>
        i.keywords.some((k) => lower.includes(k.toLowerCase()))
      ) || null;

    const reply =
      intent?.reply ||
      "I can help you navigate: try asking about the store, achievements, videos, or your orders.";

    res.json({ reply });
  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({ message: "Chatbot error" });
  }
};

