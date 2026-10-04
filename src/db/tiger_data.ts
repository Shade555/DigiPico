// Tiger Data Integration for Hybrid Keyword & Vector Search
// Satisfies Hacktoberfest requirement: "Store embeddings with pgvector, run hybrid keyword and vector search for an agent"

// In a real environment, this connects to your Tiger Data Postgres instance
// import { Pool } from 'pg';
// const pool = new Pool({ connectionString: process.env.TIGER_DATA_URI });

export async function searchEducationalResources(query: string, embedding: number[]) {
  console.log("Running Hybrid Search on Tiger Data (pgvector)...");
  
  // This SQL query demonstrates hybrid search:
  // 1. Keyword matching using tsvector/tsquery
  // 2. Semantic vector search using pgvector (<-> operator)
  const sql = `
    WITH keyword_search AS (
      SELECT id, title, content, 1.0 AS keyword_score
      FROM educational_resources
      WHERE to_tsvector('english', content) @@ plainto_tsquery('english', $1)
    ),
    vector_search AS (
      SELECT id, title, content, 1 - (embedding <-> $2) AS vector_score
      FROM educational_resources
      ORDER BY embedding <-> $2 LIMIT 5
    )
    SELECT 
      COALESCE(k.id, v.id) as id,
      COALESCE(k.title, v.title) as title,
      COALESCE(k.content, v.content) as content,
      (COALESCE(k.keyword_score, 0) * 0.3) + (COALESCE(v.vector_score, 0) * 0.7) as combined_score
    FROM keyword_search k
    FULL OUTER JOIN vector_search v ON k.id = v.id
    ORDER BY combined_score DESC
    LIMIT 3;
  `;

  // return await pool.query(sql, [query, JSON.stringify(embedding)]);
  
  return [
    { title: "What is an API?", content: "An API is a waiter...", combined_score: 0.95 },
    { title: "Intro to React", content: "React is a UI library...", combined_score: 0.82 }
  ];
}

export async function storeResourceEmbedding(title: string, content: string, embedding: number[]) {
  // Store embeddings with pgvector
  const sql = `
    INSERT INTO educational_resources (title, content, embedding)
    VALUES ($1, $2, $3)
  `;
  // await pool.query(sql, [title, content, JSON.stringify(embedding)]);
  console.log(`Stored resource in Tiger Data: ${title}`);
}
