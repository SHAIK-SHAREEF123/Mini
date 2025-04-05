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

  if (status === "loading")
    return <p className="text-center text-gray-600">Loading auctions...</p>;
  if (status === "failed")
    return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-6">Live Auctions</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {auctions.length > 0 ? (
          auctions.map((auction) => (
            <div
              key={auction._id}
              className="bg-white p-5 rounded-lg shadow-lg border transition-transform transform hover:scale-105"
            >
              <h3 className="text-xl font-semibold truncate">{auction.title}</h3>
              <p className="text-gray-600 mt-1 truncate">{auction.description}</p>

              {/* Auction Status Indicator */}
              <p
                className={`mt-3 text-sm font-semibold px-3 py-1 inline-block rounded-full ${
                  auction.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {auction.isActive ? "Active" : "Closed"}
              </p>

              <p className="mt-2 text-lg font-bold text-blue-700">
                {!auction.isActive ?"LastBid" : "Current Bid"}: ₹{auction.currentBid}
              </p>

              <Link
                to={`/auction/${auction._id}`}
                className={`block mt-4 px-4 py-2 text-white text-center rounded-lg transition-all shadow-md ${
                  auction.isActive
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {auction.isActive ? "View Auction" : "Auction Closed"}
              </Link>
            </div>
          ))
        ) : (
          <p className="text-center col-span-3 text-gray-600">
            No live auctions available.
          </p>
        )}
      </div>
    </div>
  );
};

export default LiveAuctions;
