import { createApp } from "./app";
import { disconnectPrisma } from "./config/database";

const PORT = process.env.PORT || 3001;

const app = createApp();

const server = app.listen(PORT, () => {
  console.log("🚀 IPI Smart Academic System API");
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Auth endpoint: http://localhost:${PORT}/api/auth/login`);
});

// NEED IMPLEMENTATION OF SOCKETS LATER

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(async () => {
    console.log("HTTP server closed");
    await disconnectPrisma();
    process.exit(0);
  });
});

process.on("SIGINT", async () => {
  console.log("SIGINT signal received: closing HTTP server");
  server.close(async () => {
    console.log("HTTP server closed");
    await disconnectPrisma();
    process.exit(0);
  });
});
