const router = require("express").Router();
const Message = require("./message");
const mongoose = require("mongoose");
const { messages, createMessageId } = require("./localStore");

router.post("/", async (req, res) => {
    try {

        console.log("POST /api/messages - Received:", req.body);
        const { senderId, receiverId, message } = req.body;

        if (!senderId || !receiverId || !message) {
            return res.status(400).json({ error: "senderId, receiverId and message are required" });
        }

        const isDbConnected = mongoose.connection.readyState === 1;

        if (!isDbConnected) {
            const newMessage = {
                _id: createMessageId(),
                senderId,
                receiverId,
                message,
                time: new Date()
            };

            messages.push(newMessage);
            console.log("Message saved locally:", newMessage);
            return res.json(newMessage);
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message
        });

        const savedMessage = await newMessage.save();
        console.log("Message saved successfully:", savedMessage);
        res.json(savedMessage);
    } catch (error) {
        console.error("Error saving message:", error);
        res.status(500).json({ error: error.message });
    }
});

router.get("/:user1/:user2", async (req, res) => {
    try {
        console.log("GET /api/messages - Fetching messages for:", req.params);
        const isDbConnected = mongoose.connection.readyState === 1;

        if (!isDbConnected) {
            const localMessages = messages.filter(
                (msg) =>
                    (msg.senderId === req.params.user1 && msg.receiverId === req.params.user2) ||
                    (msg.senderId === req.params.user2 && msg.receiverId === req.params.user1)
            );

            console.log("Messages fetched from local store:", localMessages.length);
            return res.json(localMessages);
        }

        const messages = await Message.find({
            $or: [
                { senderId: req.params.user1, receiverId: req.params.user2 },
                { senderId: req.params.user2, receiverId: req.params.user1 }
            ]
        });

        console.log("Messages fetched:", messages);
        res.json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
