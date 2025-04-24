// index.js
const express = require("express");
const http = require("http");
const { init: initSocket, getIO } = require("./config/socket"); // adjust path as needed

const app = express();

// parse JSON bodies
app.use(express.json());

// Health-check
app.get("/", (req, res) => {
    res.send("Socket server is running.");
});

// Internal emit endpoint
app.post("/internal/emit", (req, res) => {
    const { message } = req.body;
    if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required and must be a string" });
    }

    try {
        const io = getIO();
        const timestamp = new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });

        io.emit("notification", { message, timestamp });
        console.log("🔔 Emitted:", { message, timestamp });

        return res.json({ success: true, message, timestamp });
    } catch (err) {
        console.error("Emit failed:", err);
        return res.status(500).json({ error: err.message });
    }
});

// Create HTTP server & attach Socket.IO
const server = http.createServer(app);
initSocket(server);

// Start listening
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
