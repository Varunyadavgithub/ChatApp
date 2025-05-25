import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";

// Create a express server and HTTP server
const app = express();
const server = http.createServer(app);

// <--------------------------------- Socker.io Setup Start --------------------------------->
// Initialize socket.io server
export const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

// Store Online Users
export const userSocketMap = {}; //{userId:sockeId}

// Socket.io connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) userSocketMap[userId] = socket.id;

  // Emit online users to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnected", () => {
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});
// <--------------------------------- Socker.io Setup End --------------------------------->

// Middleware setup
app.use(
  cors({
    origin: "https://chatwithvarun.vercel.app",
    credentials: true,
  })
);
app.use(express.json({ limit: "4mb" }));

// Route setups
app.use("/api/v1/status", (_, res) => res.send("Server is Live....!!!"));
app.use("/api/v1/auth", userRouter);
app.use("/api/v1/messages", messageRouter);

// Connect to DB
await connectDB();

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
}

export default server; //Export server for vercel
