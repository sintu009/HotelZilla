require("dotenv").config({ path: require("path").join(__dirname, "../../../.env") });
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET env variable is required");

const server = http.createServer();
const io = new Server(server, {
  cors: { origin: process.env.ALLOWED_ORIGINS?.split(",") || "*" },
  // Limit message size to prevent abuse
  maxHttpBufferSize: 1e5, // 100 KB
});

const onlineUsers = new Map();

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("Unauthorized"));
  try {
    socket.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    next(new Error("Invalid token"));
  }
});

io.on("connection", (socket) => {
  const userId = socket.user.id;
  onlineUsers.set(userId, socket.id);
  console.log(`[realtime] user ${userId} connected`);

  socket.on("join_room", (roomId) => {
    if (typeof roomId === "string" && roomId.length <= 100)
      socket.join(roomId);
  });

  socket.on("send_message", ({ roomId, message }) => {
    if (typeof message !== "string" || message.length > 2000) return;
    io.to(roomId).emit("new_message", {
      from: userId,
      message,
      timestamp: new Date().toISOString(),
    });
  });

  socket.on("notify_user", ({ targetUserId, notification }) => {
    const targetSocket = onlineUsers.get(targetUserId);
    if (targetSocket) io.to(targetSocket).emit("notification", notification);
  });

  socket.on("booking_update", ({ bookingId, status }) => {
    io.emit(`booking_${bookingId}`, { status });
  });

  socket.on("disconnect", () => {
    onlineUsers.delete(userId);
    console.log(`[realtime] user ${userId} disconnected`);
  });
});

const PORT = process.env.PORT || 4004;
server.listen(PORT, () => console.log(`[realtime-service] WebSocket running on port ${PORT}`));

const shutdown = () => { server.close(() => process.exit(0)); };
process.on("SIGTERM", shutdown);
process.on("SIGINT",  shutdown);
