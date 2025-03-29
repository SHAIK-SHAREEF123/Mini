const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db"); // Import MongoDB connection function
const authRoutes = require("./routes/authRoutes");
const auctionRoutes = require("./routes/auctionRoutes");

dotenv.config();
connectDB(); // Call the function to connect to MongoDB

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Auction API is running...");
});
// Routes
app.use("/api/auth", authRoutes); // Authentication routes
app.use("/api/auctions", auctionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
