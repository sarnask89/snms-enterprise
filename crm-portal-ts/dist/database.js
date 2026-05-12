import "reflect-metadata";
import { DataSource } from "typeorm";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const AppDataSource = new DataSource({
    type: "sqlite",
    database: path.resolve(__dirname, "../../test.db"),
    synchronize: false, // Set to true if you want to auto-create tables, but we have existing data
    logging: false,
    entities: [path.join(__dirname, "models/**/*.{ts,js}")],
    migrations: [],
    subscribers: [],
});
export const initDatabase = async () => {
    if (AppDataSource.isInitialized)
        return AppDataSource;
    try {
        await AppDataSource.initialize();
        console.log("Data Source has been initialized!");
        return AppDataSource;
    }
    catch (err) {
        console.error("Error during Data Source initialization", err);
        throw err;
    }
};
//# sourceMappingURL=database.js.map