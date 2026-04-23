const mongoose = require("mongoose");

async function connectDB() {
    const mongoUrl = process.env.MONGO_CONNECTION;

    if (!mongoUrl) {
        throw new Error("MONGO_CONNECTION is not set in .env");
    }

    try {
        await mongoose.connect(mongoUrl, {
            serverSelectionTimeoutMS: 10000
        });
        console.log("MongoDB Atlas connected successfully");
    } catch (err) {
        console.error("MongoDB connection error:", err.message);
        if (/whitelist|not allowed to access|IP/i.test(err.message)) {
            console.error(
                "Fix this in Atlas: Security > Network Access > Add your current IP (or 0.0.0.0/0 for testing), then restart backend."
            );
        } else {
            console.error(
                "Tip: If your password has special characters like @, :, /, ?, #, encode them in the URI (example: @ -> %40)."
            );
        }
        throw err;
    }
}

module.exports = connectDB;
