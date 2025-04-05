import React,{ useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [auctions, setAuctions] = useState([]);
  
  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auctions");
        const data = await response.json();
        console.log(data);
        setAuctions(data);
      } catch (error) {
        console.error("Error fetching auctions:", error);
      }
    };

    fetchAuctions();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Live Auctions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {auctions.map((auction) => (
          <div key={auction._id} className="border rounded-lg p-4 shadow-lg">
            <h2 className="text-xl font-semibold">{auction.title}</h2>
            <p className="text-gray-700">{auction.description}</p>
            <p className="font-bold mt-2">Current Bid: ₹{auction.currentBid}</p>
            <Link to={`/auction/${auction._id}`} className="block mt-3 bg-blue-600 text-white py-2 rounded-lg text-center">
              View Auction
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
