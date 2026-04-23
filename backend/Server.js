const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./db");

const authRoute = require("./authen");
const messageRoute = require("./routes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/messages", messageRoute);

app.get("/", (req, res) => {
  res.send("Backend working ✅");
});

async function startServer() {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  try {
    await connectDB();
    console.log("API mode: MongoDB connected");
  } catch (error) {
    console.error("Database connection failed. Continuing in local in-memory mode.");
  }
}

startServer();
