import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";

// Create a express server and HTTP server
const app = express();
const server = http.createServer(app);

// Middleware setup
app.use(express.json({ limit: "4mb" }));
app.use(cors());

// Route setups
app.use("/api/v1/status", (_, res) => res.send("Server is Live....!!!"));
app.use("/api/v1/auth", userRouter);
app.use("/api/v1/messages", messageRouter);

// Connect to DB
await connectDB();

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
