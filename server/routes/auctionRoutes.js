const express = require("express");
const Auction = require("../models/Auction");
const { verifyToken } = require("../middleware/authMiddleware");

const createAuctionRoutes = (io) => {
  const router = express.Router();

  // ✅ Create a new auction
  router.post("/", verifyToken, async (req, res) => {
    try {
      const { title, description, startingPrice, endTime } = req.body;

      if (!title || !description || !startingPrice || !endTime) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const newAuction = new Auction({
        title,
        description,
        startingPrice,
        currentBid: startingPrice,
        createdBy: req.user.id,
        endTime,
      });

      await newAuction.save();
      res.status(201).json(newAuction);
    } catch (err) {
      console.error("Error creating auction:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ✅ Get all auctions
  router.get("/", async (req, res) => {
    try {
      const auctions = await Auction.find({})
        .populate("createdBy", "name email")
        .populate("bids.user", "name email")
        .exec();

      res.status(200).json(auctions);
    } catch (err) {
      console.error("Error fetching auctions:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ✅ Get auction by ID
  router.get("/:id", async (req, res) => {
    try {
      const auction = await Auction.findById(req.params.id)
        .populate("createdBy", "name email")
        .populate("bids.user", "name email")
        .exec();

      if (!auction) {
        return res.status(404).json({ message: "Auction not found" });
      }

      res.status(200).json(auction);
    } catch (err) {
      console.error("Error fetching auction:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ✅ Place a bid with WebSocket broadcast
  router.post("/:id/bid", verifyToken, async (req, res) => {
    try {
      const { amount } = req.body;

      if (amount <= 0) {
        return res
          .status(400)
          .json({ message: "Bid amount must be greater than 0" });
      }

      const auction = await Auction.findById(req.params.id);

      if (!auction || !auction.isActive) {
        return res
          .status(404)
          .json({ message: "Auction not found or has ended" });
      }

      if (auction.createdBy.toString() === req.user.id) {
        return res
          .status(403)
          .json({ message: "You cannot bid on your own auction" });
      }

      // Minimum increment logic
      const minIncrease =
        auction.currentBid < 1000 ? 50 : auction.currentBid < 5000 ? 100 : 500;
      const minBidAmount = auction.currentBid + minIncrease;

      if (amount < minBidAmount) {
        return res
          .status(400)
          .json({ message: `Your bid must be at least ₹${minBidAmount}` });
      }

      // Add the bid
      auction.bids.push({ user: req.user.id, amount });
      auction.currentBid = amount;
      await auction.save();

      // Repopulate for latest bid info
      const updatedAuction = await Auction.findById(req.params.id).populate(
        "bids.user",
        "name email"
      );

      const populatedBid = updatedAuction.bids[updatedAuction.bids.length - 1];

      // ✅ Emit bid to all connected clients
      io.emit("newBid", {
        auctionId: auction._id.toString(),
        bid: {
          _id: populatedBid._id,
          amount: populatedBid.amount,
          timestamp: populatedBid.timestamp,
          user: {
            name: populatedBid.user.name,
            email: populatedBid.user.email,
          },
        },
      });

      res.status(200).json({
        message: "Bid placed successfully",
        auction: updatedAuction,
      });
    } catch (err) {
      console.error("Error placing bid:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ✅ Close an auction (Only for creator)
  router.post("/:id/close", verifyToken, async (req, res) => {
    try {
      const auction = await Auction.findById(req.params.id);
      if (!auction) {
        return res.status(404).json({ message: "Auction not found" });
      }

      if (auction.createdBy.toString() !== req.user.id) {
        return res
          .status(403)
          .json({ message: "Only the auction creator can close the auction" });
      }

      auction.isActive = false;
      await auction.save();

      res.status(200).json({ message: "Auction closed successfully", auction });
    } catch (err) {
      console.error("Error closing auction:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return router;
};

module.exports = createAuctionRoutes;