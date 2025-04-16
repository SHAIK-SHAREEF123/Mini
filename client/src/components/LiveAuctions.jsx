import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuctions } from "../redux/slices/auctionSlice";
import { Link } from "react-router-dom";

const LiveAuctions = () => {
  const dispatch = useDispatch();
  const { auctions, status, error } = useSelector((state) => state.auctions);

  useEffect(() => {
    dispatch(fetchAuctions());
  }, [dispatch]);

  // // Log status, auctions, and error for debugging
  // console.log("Status:", status);
  // console.log("Auctions:", auctions);
  // console.log("Error:", error);

  if (status === "loading") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-lg text-gray-600 animate-pulse">Loading auctions...</p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-lg text-red-600 font-semibold">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pt-8 px-4 py-10">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">
        Live Auctions
      </h2>

      {auctions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {auctions.map((auction) => (
            <div
              key={auction._id}
              className="bg-white bg-opacity-30 backdrop-blur-md border-2 border-gray-200 rounded-2xl shadow-lg p-6 transition-transform hover:scale-105"
            >
              <h3 className="text-2xl font-semibold text-black truncate">{auction.title}</h3>
              <p className="text-gray-700 mt-2 line-clamp-2">{auction.description}</p>

              {/* Status Pill */}
              <p
                className={`mt-4 text-sm font-semibold w-fit px-3 py-1 rounded-full ${auction.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
                  }`}
              >
                {auction.isActive ? "Active" : "Closed"}
              </p>

              {/* Current or Last Bid */}
              {auction.isActive ? (
                <p className="mt-2 text-lg font-bold text-blue-700">
                  Current Bid : ₹{auction.currentBid}
                </p>
              ) : auction.bids.length > 0 ? (
                <p className="mt-2">
                  <span className="text-green-700 font-bold text-xl">Winner: </span>
                  <span className="text-green-700 font-bold text-lg">
                    {auction?.bids[0]?.user?.name || "Unknown"} at ₹{auction?.bids[0]?.amount}
                  </span>
                </p>
              ) : (
                <p className="mt-2 text-red-600 font-bold text-xl">Not Sold</p>
              )}

              {/* View Auction Button */}
              <Link
                to={`/auction/${auction._id}`}
                className={`block mt-5 px-4 py-2 rounded-lg font-semibold text-white text-center shadow-md transition-all ${auction.isActive
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
                  }`}
              >
                {auction.isActive ? "View Auction" : "Auction Closed"}
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 text-lg">
          No live auctions available at the moment.
        </p>
      )}
    </div>
  );
};

export default LiveAuctions;
