import OpenAI from "openai";
import { z } from "zod";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define strict schema (VERY IMPORTANT)
const EmailSchema = z.object({
  name: z.string().nullable(),
  company: z.string().nullable(),
  intent: z.enum(["lead", "support", "complaint", "other"]),
  summary: z.string(),
});

export async function processEmail(emailText) {
  const prompt = `
Extract structured data from this email.

Return JSON with:
- name
- company
- intent (lead, support, complaint, other)
- summary

Email:
${emailText}
`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0,
  });

  let raw = response.choices[0].message.content;

  try {
    const parsed = JSON.parse(raw);
    return EmailSchema.parse(parsed);
  } catch (err) {
    console.error("Parsing failed:", raw);
    throw new Error("Invalid AI response");
  }
}
