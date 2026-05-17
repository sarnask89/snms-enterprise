import "dotenv/config";
import { AppDataSource, databasePath, initDatabase } from "./database.js";
import { getSchemaMigrationStatus, runSchemaMigrations } from "./schema_migrations.js";
async function main() {
    const command = process.argv[2] ?? "run";
    await initDatabase();
    try {
        if (command === "status") {
            const status = await getSchemaMigrationStatus(AppDataSource);
            console.log(JSON.stringify({ databasePath, ...status }, null, 2));
            return;
        }
        if (command === "run") {
            const status = await runSchemaMigrations(AppDataSource);
            console.log(JSON.stringify({ databasePath, ...status }, null, 2));
            return;
        }
        throw new Error(`Unsupported migrate command: ${command}`);
    }
    finally {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
    }
}
main().catch((error) => {
    console.error("Migration command failed:", error);
    process.exit(1);
});
//# sourceMappingURL=migrate.js.map