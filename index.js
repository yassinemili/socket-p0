app.post("/internal/emit", (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }
    try {
        const io = getIO();
        const timestamp = new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
        io.emit("notification", { message, timestamp });
        return res.json({ success: true, message, timestamp });
    } catch (err) {
        console.error("Emit failed:", err);
        return res.status(500).json({ error: err.message });
    }
});

const server = http.createServer(app);
initSocket(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));