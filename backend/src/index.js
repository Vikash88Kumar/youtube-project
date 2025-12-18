import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import { initSocket } from "./socket.js";
import connect from "./db/index.js";
import {app} from "./app.js";


dotenv.config({
    path:"./.env"
});

const startServer = async () => {
  await connect();
  console.log("✅ MongoDB connected");

  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: "https://youtube-project-1-5m0w.onrender.com",
      credentials: true
    }
  });

  // 🔥 make io available to controllers
  initSocket(io);

  io.on("connection", (socket) => {
    console.log("✅ Socket connected:", socket.id);

    socket.on("join-room", (roomId) => {
      socket.join(roomId);
      console.log("joined room:", roomId);
    });
  });

  const port=process.env.PORT || 5000
  server.listen(port, () => {
    console.log(` Server running on ${port}`);
  });
};

startServer();

