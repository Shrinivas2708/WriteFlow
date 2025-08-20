// src/services/pineconeService.ts
import { Pinecone } from "@pinecone-database/pinecone";

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const indexName = "blog-embeddings";
const dimension = 768; // For gemini-embedding-001
const metric = "cosine";

// Function to create index if it doesn't exist
async function createIndexIfNotExists() {
  const indexList = await pinecone.listIndexes();
  const indexExists = indexList.indexes?.some(index => index.name === indexName) || false;
  if (!indexExists) {
    await pinecone.createIndex({
      name: indexName,
      dimension,
      metric,
      spec: {
        serverless: {
          cloud: "aws", // Adjust to your preferred cloud (e.g., "gcp", "azure")
          region: "us-east-1", // Adjust to your preferred region
        },
      },
    });
    console.log(`Created Pinecone index: ${indexName}`);
  }
}

export const pineconeService = {
  async upsertBlogEmbedding(blogId: string, embedding: number[], metadata: { authorId: string; status: string; publishedAt?: string }) {
    await createIndexIfNotExists(); // Auto-create if missing
    const index = pinecone.index(indexName);
    await index.upsert([
      {
        id: blogId,
        values: embedding,
        metadata,
      },
    ]);
  },

  async deleteBlogEmbedding(blogId: string) {
    await createIndexIfNotExists(); // Optional, but safe
    const index = pinecone.index(indexName);
    await index.deleteOne(blogId);
  },

  async querySimilarBlogs(queryEmbedding: number[], topK: number, filter?: any) {
    await createIndexIfNotExists(); // Auto-create if missing
    const index = pinecone.index(indexName);
    const results = await index.query({
      vector: queryEmbedding,
      topK,
      includeMetadata: true,
      filter,
    });
    return results.matches?.map(match => ({
      id: match.id,
      score: match.score,
      metadata: match.metadata,
    })) || [];
  },

   
};
export async function   getEmbeddingFromPinecone(blogId: string): Promise<number[] | null> {
    await createIndexIfNotExists(); // Auto-create if missing
    const index = pinecone.index(indexName);
    const result = await index.fetch([blogId]);
    return result.records[blogId]?.values || null;
}
export function averageVectors(vectors: number[][]): number[] {
  if (vectors.length === 0) return [];
  const dim = vectors[0].length;
  const avg = Array(dim).fill(0);
  vectors.forEach(vec => {
    for (let i = 0; i < dim; i++) {
      avg[i] += vec[i];
    }
  });
  return avg.map(v => v / vectors.length);
}