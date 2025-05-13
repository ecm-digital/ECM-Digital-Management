import { db } from "../server/db";
import { notionSyncStatus, notionItemMapping } from "../shared/schema";
import { sql } from "drizzle-orm";

async function createNotionTables() {
    try {
        console.log("Tworzenie tabel dla integracji z Notion...");

        // Sprawdź, czy tabela notionSyncStatus już istnieje
        const syncStatusExists = await checkIfTableExists("notion_sync_status");
        if (!syncStatusExists) {
            // Utwórz tabelę notionSyncStatus
            await db.execute(sql`
                CREATE TABLE IF NOT EXISTS notion_sync_status (
                    id SERIAL PRIMARY KEY,
                    resource_type VARCHAR(50) NOT NULL,
                    notion_database_id VARCHAR(100) NOT NULL,
                    last_synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    status VARCHAR(20) DEFAULT 'active' NOT NULL,
                    error_message TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);
            console.log("✅ Tabela notion_sync_status utworzona pomyślnie");
        } else {
            console.log("⚠️ Tabela notion_sync_status już istnieje");
        }

        // Sprawdź, czy tabela notionItemMapping już istnieje
        const itemMappingExists = await checkIfTableExists("notion_item_mapping");
        if (!itemMappingExists) {
            // Utwórz tabelę notionItemMapping
            await db.execute(sql`
                CREATE TABLE IF NOT EXISTS notion_item_mapping (
                    id SERIAL PRIMARY KEY,
                    resource_type VARCHAR(50) NOT NULL,
                    local_id INTEGER NOT NULL,
                    notion_page_id VARCHAR(100) NOT NULL,
                    last_synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    sync_direction VARCHAR(20) DEFAULT 'notion_to_local' NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);
            console.log("✅ Tabela notion_item_mapping utworzona pomyślnie");
        } else {
            console.log("⚠️ Tabela notion_item_mapping już istnieje");
        }

        // Utwórz indeksy dla lepszej wydajności
        await db.execute(sql`
            CREATE INDEX IF NOT EXISTS idx_notion_item_mapping_resource_local
            ON notion_item_mapping (resource_type, local_id)
        `);

        await db.execute(sql`
            CREATE INDEX IF NOT EXISTS idx_notion_item_mapping_notion_page
            ON notion_item_mapping (notion_page_id)
        `);

        await db.execute(sql`
            CREATE UNIQUE INDEX IF NOT EXISTS idx_notion_sync_status_resource_db
            ON notion_sync_status (resource_type, notion_database_id)
        `);

        console.log("✅ Indeksy utworzone pomyślnie");
        console.log("✅ Konfiguracja tabel Notion zakończona pomyślnie!");

    } catch (error) {
        console.error("❌ Błąd podczas tworzenia tabel dla integracji z Notion:", error);
        throw error;
    }
}

// Sprawdź czy tabela istnieje
async function checkIfTableExists(tableName: string): Promise<boolean> {
    const result = await db.execute(sql`
        SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public'
            AND table_name = ${tableName}
        )
    `);
    return result.rows[0]?.exists || false;
}

// Uruchom migrację
createNotionTables()
    .then(() => {
        console.log("Migracja zakończona pomyślnie!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("Migracja nie powiodła się:", error);
        process.exit(1);
    });