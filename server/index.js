import express, { json } from "express";
import cors from "cors";
import axios from "axios";
import { Server } from "socket.io";
import { createServer } from "http";
import dotenv from "dotenv";
dotenv.config();

const apikey = process.env.apikey;

const app = express();
const PORT = 5000;
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
app.use(cors());
app.use(json());

const userSocketMap = {};
const roomCodeMap = {}; // A new object to store the code for each room

const getAllConnectedClients = (roomId) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return { socketId, username: userSocketMap[socketId] };
    }
  );
};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join", ({ roomId, username }) => {
    console.log(`${username} joined room: ${roomId}`);
    userSocketMap[socket.id] = username;
    socket.join(roomId);

    const clients = getAllConnectedClients(roomId);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit("joined", {
        clients,
        username,
        socketId: socket.id,
      });
    });

    // Send the current code to the new user
    const currentCode = roomCodeMap[roomId] || ""; // Get the current code for the room
    socket.emit("code-change", { newCode: currentCode }); // Emit the current code to the new user
  });

  socket.on("code-change", ({ roomId, newCode }) => {
    console.log(`Code change in room ${roomId}: ${newCode}`);
    roomCodeMap[roomId] = newCode; // Store the new code for the room
    socket.in(roomId).emit("code-change", { newCode }); // Broadcast the code change to all clients in the room
  });

  socket.on("sync-code", ({ socketId, code }) => {
    io.to(socketId).emit("sync-code", { code });
  });

  socket.on("disconnecting", () => {
    console.log(`User disconnected: ${socket.id}`);
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.to(roomId).emit("disconnected", {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });

    delete userSocketMap[socket.id];
    socket.leave();
  });
});

app.post("/run", async (req, res) => {
  const { source_code, language_id, stdin } = req.body;

  if (!apikey) {
    return res.status(500).json({ error: "Missing API Key" });
  }

  try {
    const response = await axios.request({
      method: "POST",
      url: "https://judge0-ce.p.rapidapi.com/submissions",
      params: {
        base64_encoded: "true",
        wait: "true",
        fields: "*",
      },
      headers: {
        "x-rapidapi-key": apikey,
        "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      data: {
        language_id,
        source_code: Buffer.from(source_code).toString("base64"),
        stdin: Buffer.from(stdin || "").toString("base64"),
      },
    });

    const { stdout, stderr, compile_output } = response.data;

    res.json({
      stdout: stdout ? Buffer.from(stdout, "base64").toString("utf-8") : "",
      stderr: stderr ? Buffer.from(stderr, "base64").toString("utf-8") : "",
      compile_output: compile_output
        ? Buffer.from(compile_output, "base64").toString("utf-8")
        : "",
    });
  } catch (error) {
    console.error(
      "Error calling Judge0 API:",
      error.response?.data || error.message
    );
    res.status(500).json({
      error: "Internal Server Error",
      details: error.response?.data || error.message,
    });
  }
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
