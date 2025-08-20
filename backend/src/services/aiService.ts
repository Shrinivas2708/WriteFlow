// src/services/aiService.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export const aiService = {
  async generateEmbedding(content: string): Promise<number[]> {
    try {
      const model = genAI.getGenerativeModel({ model: "embedding-001" });
      const result = await model.embedContent(content);
      return result.embedding.values; // 768-dimensional vector
    } catch (error) {
      throw new Error(`Failed to generate embedding: ${error}`);
    }
  },

  async generateImage(prompt: string): Promise<string> {
    // Placeholder: Gemini doesn't generate images directly
    // Replace with another service (e.g., Stable Diffusion) or mock
    return `https://example.com/cover-${prompt.replace(/\s+/g, '-').toLowerCase()}.png`;
  },

  async summarize(content: string): Promise<string> {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Summarize the following content in 100 words or less:\n${content}`;
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      throw new Error(`Failed to summarize content: ${error}`);
    }
  },

  async recommendTags(content: string): Promise<string[]> {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Extract 3-5 relevant tags from the following content. Return as a comma-separated list:\n${content}`;
      const result = await model.generateContent(prompt);
      return result.response.text().split(",").map(tag => tag.trim());
    } catch (error) {
      throw new Error(`Failed to recommend tags: ${error}`);
    }
  },

  async chat(query: string, context: string): Promise<string> {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Answer the query "${query}" using the context:\n${context}`;
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      throw new Error(`Failed to process chat query: ${error}`);
    }
  },
};