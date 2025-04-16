const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const createAuctionRoutes = require("./routes/auctionRoutes");
const user = require('./routes/user')

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.set("io", io); // optional but not used in routes currently

io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);

  socket.on("placeBid", (data) => {
    io.emit("newBid", data);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Auction API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/auctions", createAuctionRoutes(io));
app.use("/api/user", require("./routes/user"));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
