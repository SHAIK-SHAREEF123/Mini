import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const AuctionDetails = () => {
    const { id } = useParams();
    const [auction, setAuction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [placingBid, setPlacingBid] = useState(false);

    useEffect(() => {
        const fetchAuctionDetails = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/auctions/${id}`);
                setAuction(res.data);
            } catch (error) {
                console.error("Error fetching auction details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAuctionDetails();
    }, [id]);

    const calculateBidIncrement = (currentBid) => {
        if (currentBid < 10000) return 500;
        if (currentBid < 50000) return 1000;
        return 5000;
    };

    const handlePlaceBid = async () => {
        if (!auction) return;

        setPlacingBid(true);
        const newBidAmount = auction.currentBid + calculateBidIncrement(auction.currentBid);

        try {
            const res = await axios.post(
                `http://localhost:5000/api/auctions/${id}/bid`,
                { amount: newBidAmount },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );

            setAuction(res.data.auction);
        } catch (error) {
            console.error("Error placing bid:", error.response?.data?.message || error.message);
        } finally {
            setPlacingBid(false);
        }
    };

    if (loading) return <p className="text-center text-gray-600">Loading auction details...</p>;
    if (!auction) return <p className="text-center text-red-500">Auction not found.</p>;

    return (
        <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
            {/* Auction Title & Description */}
            <h1 className="text-3xl font-bold text-center mb-4">{auction.title}</h1>
            <p className="text-gray-700 text-center mb-6">{auction.description}</p>

            {/* Bid Box (Highlighted) */}
            <div className="w-[350px] mx-auto bg-blue-50 border border-blue-300 p-6 rounded-lg shadow-md">
                <p className="text-2xl font-semibold text-blue-600 mb-3">
                    Current Bid: ₹{auction.currentBid}
                </p>
                <button
                    onClick={handlePlaceBid}
                    disabled={placingBid}
                    className="px-6 py-3 bg-blue-600 text-white font-bold text-lg rounded-lg hover:bg-blue-700 transition-all disabled:bg-gray-400"
                >
                    {placingBid ? "Placing Bid..." : "Place a Bid"}
                </button>
            </div>

            {/* Other Auction Details */}
            <div className="mt-6 space-y-3 text-gray-700 text-center">
                <p><strong>Starting Price:</strong> ₹{auction.startingPrice}</p>
                <p><strong>End Time:</strong> {new Date(auction.endTime).toLocaleString()}</p>
                <p><strong>Created By:</strong> {auction.createdBy?.email || "Unknown"}</p>
            </div>

            {/* Bids History (Placed at the Bottom) */}
            <div className="mt-10">
                <h2 className="text-xl font-semibold mb-3">Bids History:</h2>
                {auction.bids.length > 0 ? (
                    <ul className="border rounded-lg p-4 bg-gray-50">
                        {auction.bids.map((bid, index) => (
                            <li key={index} className="border-b last:border-0 py-2">
                                ₹{bid.amount} by {bid.user?.email || "Unknown"} at {new Date(bid.timestamp).toLocaleString()}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No bids yet.</p>
                )}
            </div>
        </div>
    );
};

export default AuctionDetails;
