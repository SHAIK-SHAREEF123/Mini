const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db"); // MongoDB connection
const authRoutes = require("./routes/authRoutes");
const auctionRoutes = require("./routes/auctionRoutes");

dotenv.config();
connectDB(); // Connect to MongoDB

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Test route
app.get("/", (req, res) => {
  res.send("Auction API is running...");
});

// API Routes
app.use("/api/auth", authRoutes);        // Auth routes
app.use("/api/auctions", auctionRoutes); // Auction routes

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
