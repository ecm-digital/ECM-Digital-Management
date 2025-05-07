import { db, pool } from '../server/db';
import * as schema from '../shared/schema';
import { sql } from 'drizzle-orm';

async function createBlogKnowledgeTables() {
  console.log('Creating blog and knowledge base tables...');

  try {
    // Tworzymy tabelę dla wpisów blogowych
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "blog_posts" (
        "id" SERIAL PRIMARY KEY,
        "slug" TEXT NOT NULL UNIQUE,
        "title" TEXT NOT NULL,
        "excerpt" TEXT NOT NULL,
        "content" TEXT NOT NULL,
        "author_id" VARCHAR REFERENCES "users"("id") NOT NULL,
        "thumbnail_url" TEXT,
        "tags" TEXT[],
        "category" TEXT,
        "status" TEXT DEFAULT 'draft',
        "view_count" INTEGER DEFAULT 0,
        "published_at" TIMESTAMP,
        "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Blog posts table created successfully!');

    // Tworzymy tabelę dla bazy wiedzy
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "knowledge_base" (
        "id" SERIAL PRIMARY KEY,
        "slug" TEXT NOT NULL UNIQUE,
        "title" TEXT NOT NULL,
        "excerpt" TEXT NOT NULL,
        "content" TEXT NOT NULL,
        "category" TEXT NOT NULL,
        "author_id" VARCHAR REFERENCES "users"("id") NOT NULL,
        "thumbnail_url" TEXT,
        "tags" TEXT[],
        "status" TEXT DEFAULT 'draft',
        "view_count" INTEGER DEFAULT 0,
        "published_at" TIMESTAMP,
        "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Knowledge base table created successfully!');

    // Indeksy dla lepszej wydajności wyszukiwania
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS "blog_posts_slug_idx" ON "blog_posts" ("slug");
      CREATE INDEX IF NOT EXISTS "blog_posts_status_idx" ON "blog_posts" ("status");
      CREATE INDEX IF NOT EXISTS "blog_posts_category_idx" ON "blog_posts" ("category");
      CREATE INDEX IF NOT EXISTS "knowledge_base_slug_idx" ON "knowledge_base" ("slug");
      CREATE INDEX IF NOT EXISTS "knowledge_base_status_idx" ON "knowledge_base" ("status");
      CREATE INDEX IF NOT EXISTS "knowledge_base_category_idx" ON "knowledge_base" ("category");
    `);

    console.log('Indeksy dla blog i bazy wiedzy utworzone pomyślnie!');

  } catch (error) {
    console.error('Error creating blog and knowledge base tables:', error);
  } finally {
    // Zamknij połączenie z bazą danych
    await pool.end();
  }
}

// Wywołanie funkcji
createBlogKnowledgeTables()
  .then(() => console.log('Wszystkie tabele zostały utworzone'))
  .catch(err => console.error('Błąd:', err));