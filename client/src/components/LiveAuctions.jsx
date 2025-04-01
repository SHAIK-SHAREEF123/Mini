import React,{ useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuctions } from "../redux/slices/auctionSlice";
import { Link } from "react-router-dom";

const LiveAuctions = () => {
  const dispatch = useDispatch();
  const { auctions, status, error } = useSelector((state) => state.auctions);

  useEffect(() => {
    dispatch(fetchAuctions());
  }, [dispatch]);

  if (status === "loading") return <p>Loading...</p>;
  if (status === "failed") return <p>Error: {error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-center mb-6">Live Auctions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {auctions.length > 0 ? (
          auctions.map((auction) => (
            <div
              key={auction._id}
              className="p-4 border rounded-lg shadow-lg transition transform hover:scale-105"
            >
              <h3 className="text-xl font-semibold">{auction.title}</h3>
              <p className="text-gray-600">{auction.description}</p>
              <p className="text-blue-500 font-bold mt-2">Current Bid: ₹{auction.currentBid}</p>
              
              <Link
                to={`/auction/${auction._id}`}
                className="block text-center mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                View Auction
              </Link>
            </div>
          ))
        ) : (
          <p className="text-center col-span-3">No live auctions available.</p>
        )}
      </div>
    </div>
  );
};

export default LiveAuctions;
