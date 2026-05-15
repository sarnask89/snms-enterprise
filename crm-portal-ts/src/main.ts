import { startServer } from "./app.js";

const port = Number(process.env.PORT ?? "8080");

startServer(port).catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
});
