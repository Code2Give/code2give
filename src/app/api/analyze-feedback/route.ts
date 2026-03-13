import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Feedback text is required." },
        { status: 400 }
      );
    }

    let sentiment = "Neutral";
    let tags: string[] = [];

    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (geminiApiKey) {
      // --- REAL GEMINI AI CALL ---
      const prompt = `You are an AI categorizer for a food pantry feedback system called Lemontree InsightEngine.
Analyze the following user feedback and return a JSON object with:
- "sentiment": one of "Positive", "Negative", or "Neutral"
- "tags": an array of 1-3 short category tags (e.g., "Wait Time", "Food Quality", "Transportation", "Staff", "Hours", "Inventory", "Accessibility", "Cleanliness")

User Feedback: "${text}"

Respond ONLY with valid JSON, no markdown fences.`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        try {
          // Strip markdown fences if Gemini wraps it
          const cleaned = rawText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
          const parsed = JSON.parse(cleaned);
          sentiment = parsed.sentiment || sentiment;
          tags = parsed.tags || tags;
        } catch {
          console.warn("Gemini response wasn't valid JSON, using fallback:", rawText);
        }
      }
    } else {
      // --- FALLBACK: Smart keyword-based classification ---
      const lowerText = text.toLowerCase();
      if (lowerText.includes("love") || lowerText.includes("thank") || lowerText.includes("great") || lowerText.includes("kind")) {
        sentiment = "Positive";
      } else if (lowerText.includes("wait") || lowerText.includes("long") || lowerText.includes("hard") || lowerText.includes("ran out") || lowerText.includes("bad")) {
        sentiment = "Negative";
      }

      if (lowerText.includes("wait") || lowerText.includes("line")) tags.push("Wait Time");
      if (lowerText.includes("food") || lowerText.includes("fresh") || lowerText.includes("produce")) tags.push("Food Quality");
      if (lowerText.includes("subway") || lowerText.includes("bus") || lowerText.includes("drive") || lowerText.includes("stroller")) tags.push("Transportation");
      if (lowerText.includes("staff") || lowerText.includes("volunteer")) tags.push("Staff");
      if (lowerText.includes("hour") || lowerText.includes("evening") || lowerText.includes("morning")) tags.push("Hours");
      if (lowerText.includes("ran out") || lowerText.includes("milk") || lowerText.includes("bread")) tags.push("Inventory");
      if (tags.length === 0) tags.push("General");
    }

    // Save to database
    const id = Math.random().toString(36).substring(2, 9);
    const tagsArrayStr = `{${tags.join(",")}}`;
    await pool.query(
      'INSERT INTO "Feedback" (id, text, sentiment, tags, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, NOW(), NOW())',
      [id, text, sentiment, tagsArrayStr]
    );

    return NextResponse.json({
      success: true,
      feedback: { id, text, sentiment, tags, createdAt: new Date().toISOString() },
    });
  } catch (error) {
    console.error("Error analyzing feedback:", error);
    return NextResponse.json(
      { error: "Failed to analyze feedback" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM "Feedback" ORDER BY "createdAt" DESC LIMIT 20');
    return NextResponse.json({ feedback: result.rows });
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return NextResponse.json({ feedback: [] }, { status: 500 });
  }
}
