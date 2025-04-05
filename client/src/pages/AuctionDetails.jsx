import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const AuctionDetails = () => {
    const { id } = useParams();
    const [auction, setAuction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [placingBid, setPlacingBid] = useState(false);
    const [closing, setClosing] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { user, token } = useSelector((state) => state.auth);

    // Pagination for Bid History (Show More / Show Less)
    const [bidsToShow, setBidsToShow] = useState(5);

    // Calculate the minimum bid increment
    const getMinBidIncrease = (currentBid) => {
        if (currentBid < 1000) return 50;
        if (currentBid < 5000) return 100;
        return 500;
    };

    // Get the highest bidder from bid history
    const getHighestBidder = (bids) => {
        if (bids.length === 0) return null;
        return bids.reduce((maxBid, currentBid) =>
            currentBid.amount > maxBid.amount ? currentBid : maxBid
        );
    };

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

    if (loading) return <p className="text-center text-gray-600">Loading auction details...</p>;
    if (!auction) return <p className="text-center text-red-500">Auction not found.</p>;

    const minBidAmount = auction.currentBid + getMinBidIncrease(auction.currentBid);
    const currentBidder = getHighestBidder(auction.bids);

    const isOwner = auction?.createdBy?.email === user?.email;
    const isAuctionClosed = !auction.isActive;
    const isLoggedIn = !!user;

    // Place a bid
    const handleBid = async () => {
        if (!user) {
            setErrorMessage("You must be logged in to bid.");
            return;
        }

        try {
            setPlacingBid(true);
            const res = await axios.post(
                `http://localhost:5000/api/auctions/${id}/bid`,
                { amount: minBidAmount },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setAuction(res.data.auction);
            setErrorMessage("");
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Error placing bid");
        } finally {
            setPlacingBid(false);
        }
    };

    // Close the auction (Only for creator)
    const handleCloseAuction = async () => {
        if (!isOwner) return;

        try {
            setClosing(true);
            const res = await axios.post(
                `http://localhost:5000/api/auctions/${id}/close`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setAuction(res.data.auction);
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Error closing auction");
        } finally {
            setClosing(false);
        }
    };

    // Show More Bids
    const showMoreBids = () => {
        setBidsToShow((prev) => prev + 5);
    };

    // Show Less Bids
    const showLessBids = () => {
        setBidsToShow((prev) => Math.max(5, prev - 5));
    };

    return (
        <div className="max-w-lg mx-auto mt-8 p-6 bg-gray-200 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-center">{auction.title}</h1>
            <p className="text-gray-800 text-center mt-2"><strong>{auction.description}</strong></p>
            <p className="text-gray-800 text-center mt-2"><strong>Starting Price : {auction.startingPrice}</strong></p>

            {/* Current Bid & Place Bid Section */}
            <div className="mt-4 p-6 bg-blue-50 border-b-cyan-300 rounded-lg text-center shadow-md">
                <p className="text-2xl text-blue-700 font-bold">{!auction.isActive?"Last Bid" : "Current Bid"}: ₹{auction.currentBid}</p>
                {currentBidder ? (
                    <p className="mt-2 text-lg font-semibold text-green-600">
                        {!auction.isActive? "Last Bidder" : "Current Bidder"}: {currentBidder.user?.name || "Anonymous"}
                    </p>
                ) : (
                    <p className="text-gray-500">No bids yet.</p>
                )}

                <button
                    onClick={handleBid}
                    className={`mt-4 px-6 py-2 font-bold text-white rounded-lg transition-all shadow-md ${
                        isOwner || isAuctionClosed || !isLoggedIn
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                    }`}
                    disabled={isOwner || isAuctionClosed || !isLoggedIn || placingBid}
                >
                    {placingBid ? "Placing..." : isAuctionClosed ? "Auction Closed" : "Place Bid"}
                </button>
            </div>

            {isOwner && auction.isActive && (
                <p className="text-center text-sm text-red-500 mt-2">You cannot bid on your own auction.</p>
            )}
            {!isLoggedIn && (
                <p className="text-center text-sm text-red-500 mt-2">You must be logged in to place a bid.</p>
            )}

            {/* Close Auction Button (Only for Creator) */}
            {isOwner && auction.isActive && (
                <div className="flex justify-center mt-6">
                    <button
                        onClick={handleCloseAuction}
                        className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-all"
                        disabled={closing}
                    >
                        {closing ? "Closing..." : "Close Auction"}
                    </button>
                </div>
            )}

            {/* Error Message */}
            {errorMessage && <p className="text-center text-sm text-red-500 mt-2">{errorMessage}</p>}

            {/* Bid History with "Show More" & "Show Less" */}
            <h2 className="text-xl font-semibold mt-6">Bids History:</h2>
            {auction.bids.length > 0 ? (
                <div className="border rounded-lg p-4 bg-gray-50">
                    <ul>
                        {auction.bids
                            .slice()
                            .reverse()
                            .slice(0, bidsToShow)
                            .map((bid, index) => (
                                <li key={index} className="border-b last:border-0 py-2">
                                    ₹{bid.amount} by {bid.user?.email || "Unknown"} at{" "}
                                    {new Date(bid.timestamp).toLocaleString()}
                                </li>
                            ))}
                    </ul>

                    <div className="flex justify-between mt-4">
                        {bidsToShow < auction.bids.length && (
                            <button className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition" onClick={showMoreBids}>
                                Show More
                            </button>
                        )}
                        {bidsToShow > 5 && (
                            <button className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition" onClick={showLessBids}>
                                Show Less
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <p className="text-gray-500">No bids yet.</p>
            )}
        </div>
    );
};

export default AuctionDetails;
