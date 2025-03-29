const express = require("express");
const Auction = require("../models/Auction");
const { verifyToken } = require("../middleware/authMiddleware");

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
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get all active auctions
router.get("/", async (req, res) => {
  try {
    const auctions = await Auction.find({ isActive: true }).populate("createdBy", "email");
    res.status(200).json(auctions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get auction by ID
router.get("/:id", async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id).populate("bids.user", "email");
    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }
    res.status(200).json(auction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Place a bid
router.post("/:id/bid", verifyToken, async (req, res) => {
  try {
    const { amount } = req.body;
    const auction = await Auction.findById(req.params.id);

    if (!auction || !auction.isActive) {
      return res.status(404).json({ message: "Auction not found or ended" });
    }

    if (amount <= auction.currentBid) {
      return res.status(400).json({ message: "Bid must be higher than the current bid" });
    }

    auction.bids.push({ user: req.user.id, amount });
    auction.currentBid = amount;
    await auction.save();

    res.status(200).json({ message: "Bid placed successfully", auction });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Close an auction (Admin/Owner)
router.patch("/:id/close", verifyToken, async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);

    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    if (auction.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to close this auction" });
    }

    auction.isActive = false;
    await auction.save();

    res.status(200).json({ message: "Auction closed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
