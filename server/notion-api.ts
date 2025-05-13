import { Express, Request, Response } from "express";
import { db } from "./db";
import { getNotionDatabases, findDatabaseByTitle, syncBlogPostsFromNotion, syncBlogPostToNotion } from "./notion";
import { blogPosts, knowledgeBase, notionSyncStatus, notionItemMapping } from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import { isAdmin } from "./auth";

// Rejestruje trasy API związane z Notion
export function registerNotionRoutes(app: Express) {
  // Pobierz bazy danych z Notion
  app.get("/api/notion/databases", isAdmin, async (req: Request, res: Response) => {
    try {
      // Pobierz listę baz danych
      const databases = await getNotionDatabases();
      
      // Przygotuj dane do odpowiedzi
      const formattedDatabases = databases.map(db => {
        let title = "Bez tytułu";
        
        // Sprawdź, czy to pełny obiekt bazy danych z właściwością title
        if ('title' in db && Array.isArray(db.title) && db.title.length > 0) {
          title = db.title[0]?.plain_text || "Bez tytułu";
        }
          
        return {
          id: db.id,
          title: title
        };
      });
      
      res.json(formattedDatabases);
    } catch (error) {
      console.error("Błąd podczas pobierania baz danych Notion:", error);
      res.status(500).json({ error: "Nie udało się pobrać baz danych Notion" });
    }
  });
  
  // Synchronizuj wpisy z Notion do lokalnej bazy danych
  app.post("/api/notion/sync/blog", isAdmin, async (req: Request, res: Response) => {
    try {
      // Znajdź bazę danych bloga w Notion
      const blogDatabase = await findDatabaseByTitle("Blog");
      
      if (!blogDatabase) {
        return res.status(404).json({ error: "Nie znaleziono bazy danych 'Blog' w Notion" });
      }
      
      // Pobierz wpisy z Notion
      const notionPosts = await syncBlogPostsFromNotion(blogDatabase.id);
      
      // Zapisz status synchronizacji
      const [syncStatus] = await db
        .insert(notionSyncStatus)
        .values({
          resourceType: "blog",
          notionDatabaseId: blogDatabase.id,
          status: "active",
        })
        .onConflictDoUpdate({
          target: [
            notionSyncStatus.resourceType, 
            notionSyncStatus.notionDatabaseId
          ],
          set: {
            lastSyncedAt: new Date(),
            status: "active",
            errorMessage: null
          }
        })
        .returning();
      
      // Tablica do przechowywania identyfikatorów wpisów które zostały zsynchronizowane
      const syncedPostIds: number[] = [];
      
      // Dla każdego wpisu z Notion
      for (const notionPost of notionPosts) {
        // Sprawdź, czy istnieje już mapowanie dla tego wpisu
        const [existingMapping] = await db
          .select()
          .from(notionItemMapping)
          .where(eq(notionItemMapping.notionPageId, notionPost.notionPageId))
          .limit(1);
        
        if (existingMapping) {
          // Aktualizuj istniejący wpis
          const [updatedPost] = await db
            .update(blogPosts)
            .set({
              title: notionPost.title,
              slug: notionPost.slug,
              excerpt: notionPost.excerpt,
              content: notionPost.content,
              thumbnailUrl: notionPost.thumbnailUrl,
              category: notionPost.category,
              status: notionPost.isPublished ? "published" : "draft",
              publishedAt: notionPost.isPublished ? notionPost.publishedDate : null,
              updatedAt: new Date()
            })
            .where(eq(blogPosts.id, existingMapping.localId))
            .returning();
          
          if (updatedPost) {
            syncedPostIds.push(updatedPost.id);
            
            // Aktualizuj mapowanie
            await db
              .update(notionItemMapping)
              .set({
                lastSyncedAt: new Date()
              })
              .where(eq(notionItemMapping.id, existingMapping.id));
          }
        } else {
          // Znajdź domyślnego autora (administrator)
          const [admin] = await db
            .select()
            .from(blogPosts)
            .where(eq(blogPosts.status, "published"))
            .limit(1);
          
          const authorId = admin?.authorId || 1; // Użyj ID autora istniejącego wpisu lub domyślne 1
          
          // Utwórz nowy wpis
          const [newPost] = await db
            .insert(blogPosts)
            .values({
              title: notionPost.title,
              slug: notionPost.slug,
              excerpt: notionPost.excerpt,
              content: notionPost.content,
              authorId: authorId,
              thumbnailUrl: notionPost.thumbnailUrl,
              category: notionPost.category,
              status: notionPost.isPublished ? "published" : "draft",
              publishedAt: notionPost.isPublished ? notionPost.publishedDate : null,
              createdAt: new Date(),
              updatedAt: new Date()
            })
            .returning();
          
          if (newPost) {
            syncedPostIds.push(newPost.id);
            
            // Utwórz mapowanie
            await db
              .insert(notionItemMapping)
              .values({
                resourceType: "blog",
                localId: newPost.id,
                notionPageId: notionPost.notionPageId,
                syncDirection: "notion_to_local"
              });
          }
        }
      }
      
      res.json({
        success: true,
        message: `Zsynchronizowano ${syncedPostIds.length} wpisów z Notion`,
        syncedPostIds
      });
    } catch (error) {
      console.error("Błąd podczas synchronizacji wpisów z Notion:", error);
      res.status(500).json({ error: "Nie udało się zsynchronizować wpisów z Notion" });
    }
  });
  
  // Synchronizuj pojedynczy wpis do Notion
  app.post("/api/notion/sync/blog/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      const postId = parseInt(req.params.id);
      
      if (isNaN(postId)) {
        return res.status(400).json({ error: "Nieprawidłowy identyfikator wpisu" });
      }
      
      // Pobierz wpis z lokalnej bazy danych
      const [post] = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.id, postId))
        .limit(1);
      
      if (!post) {
        return res.status(404).json({ error: "Wpis nie został znaleziony" });
      }
      
      // Znajdź bazę danych bloga w Notion
      const blogDatabase = await findDatabaseByTitle("Blog");
      
      if (!blogDatabase) {
        return res.status(404).json({ error: "Nie znaleziono bazy danych 'Blog' w Notion" });
      }
      
      // Sprawdź, czy istnieje już mapowanie dla tego wpisu
      const [existingMapping] = await db
        .select()
        .from(notionItemMapping)
        .where(eq(notionItemMapping.localId, postId))
        .and(eq(notionItemMapping.resourceType, "blog"))
        .limit(1);
      
      let notionPageId = existingMapping?.notionPageId;
      
      // Przygotuj dane i synchronizuj z Notion
      const notionResponse = await syncBlogPostToNotion(blogDatabase.id, {
        ...post,
        notionPageId
      });
      
      // Jeśli nie ma mapowania, utwórz je
      if (!existingMapping && notionResponse.id) {
        await db
          .insert(notionItemMapping)
          .values({
            resourceType: "blog",
            localId: postId,
            notionPageId: notionResponse.id,
            syncDirection: "local_to_notion"
          });
      } else if (existingMapping) {
        // Aktualizuj istniejące mapowanie
        await db
          .update(notionItemMapping)
          .set({
            lastSyncedAt: new Date()
          })
          .where(eq(notionItemMapping.id, existingMapping.id));
      }
      
      res.json({
        success: true,
        message: "Wpis został zsynchronizowany z Notion",
        notionPageId: notionResponse.id
      });
    } catch (error) {
      console.error("Błąd podczas synchronizacji wpisu do Notion:", error);
      res.status(500).json({ error: "Nie udało się zsynchronizować wpisu do Notion" });
    }
  });
  
  // Pobierz status synchronizacji
  app.get("/api/notion/sync/status", isAdmin, async (req: Request, res: Response) => {
    try {
      const syncStatus = await db
        .select()
        .from(notionSyncStatus)
        .orderBy(desc(notionSyncStatus.lastSyncedAt));
      
      res.json(syncStatus);
    } catch (error) {
      console.error("Błąd podczas pobierania statusu synchronizacji:", error);
      res.status(500).json({ error: "Nie udało się pobrać statusu synchronizacji" });
    }
  });
}