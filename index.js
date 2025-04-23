const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:5173", // Local dev (frontend)
            "https://elec-frontend.vercel.app", // Vercel frontend
            "https://socket-p0.vercel.app", // Another backend instance if needed
            "https://socket-p0.onrender.com" // Another backend if needed
        ],
        methods: ["GET", "POST"],
        credentials: true,
    },
});

// CORS middleware
app.use(cors({
    origin: [
        "http://localhost:5173", // Local dev (frontend)
        "https://elec-frontend.vercel.app", // Vercel frontend
        "https://socket-p0.vercel.app", // Another backend if needed
        "https://socket-p0.onrender.com" // Another backend if needed
    ],
    credentials: true, // Allow cookies or credentials
}));

app.get("/", (req, res) => {
    res.send("Socket server is running.");
});

io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("sendMessage", (data) => {
        console.log("Message received:", data);
        io.emit("receiveMessage", data);
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});