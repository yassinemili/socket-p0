// index.js
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["https://elec-frontend.vercel.app"], // allow Vercel frontend
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.use(cors());
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
