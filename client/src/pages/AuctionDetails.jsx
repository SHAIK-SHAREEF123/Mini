// import React, { useEffect, useMemo, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import { toast, ToastContainer } from "react-toastify";
// import socket from "../socket";
// import "react-toastify/dist/ReactToastify.css";

// const AuctionDetails = () => {
//   const { id } = useParams();
//   const [auction, setAuction] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [placingBid, setPlacingBid] = useState(false);
//   const [closing, setClosing] = useState(false);
//   const [bidsToShow, setBidsToShow] = useState(5);

//   const { user, token } = useSelector((state) => state.auth);

//   const getMinBidIncrease = (currentBid) => {
//     if (currentBid < 1000) return 50;
//     if (currentBid < 5000) return 100;
//     return 500;
//   };

//   const getHighestBidder = (bids) => {
//     if (bids.length === 0) return null;
//     return bids.reduce((maxBid, currentBid) =>
//       currentBid.amount > maxBid.amount ? currentBid : maxBid
//     );
//   };

//   const minBidAmount = useMemo(() => {
//     const base = auction?.currentBid ?? auction?.startingPrice ?? 0;
//     return base + getMinBidIncrease(base);
//   }, [auction]);

//   useEffect(() => {
//     // Fetch auction
//     const fetchAuctionDetails = async () => {
//       try {
//         const res = await axios.get(`http://localhost:5000/api/auctions/${id}`);
//         setAuction(res.data);
//       } catch (error) {
//         toast.error("Error fetching auction details");
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     fetchAuctionDetails();
  
//     // SOCKET: Listen to newBid
//     socket.on("newBid", (data) => {
//       if (data.auctionId === id) {
//         // console.log("📡 New bid received via socket:", data);
//         setAuction((prev) => ({
//           ...prev,
//           currentBid: data.bid.amount,
//           bids: [...prev.bids, data.bid],
//         }));
//       }
//     });
  
//     return () => {
//       socket.off("newBid");
//     };
//   }, [id]);
  

//   if (loading) return <p className="text-center text-gray-600">Loading auction details...</p>;
//   if (!auction) return <p className="text-center text-red-500">Auction not found.</p>;

//   const currentBidder = getHighestBidder(auction.bids);
//   const isOwner = auction?.createdBy?.email === user?.email;
//   const isAuctionClosed = !auction.isActive;
//   const isLoggedIn = !!user;

//   const handleBid = async () => {
//     if (!user) {
//       toast.error("You must be logged in to bid.");
//       return;
//     }

//     try {
//       setPlacingBid(true);
//       const res = await axios.post(
//         `http://localhost:5000/api/auctions/${id}/bid`,
//         { amount: minBidAmount },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setAuction(res.data.auction);
//       toast.success("Bid placed successfully!");
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Error placing bid");
//     } finally {
//       setPlacingBid(false);
//     }
//   };

//   const handleCloseAuction = async () => {
//     if (!isOwner) return;

//     try {
//       setClosing(true);
//       const res = await axios.post(
//         `http://localhost:5000/api/auctions/${id}/close`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setAuction(res.data.auction);
//       toast.success("Auction closed successfully!");
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Error closing auction");
//     } finally {
//       setClosing(false);
//     }
//   };

//   const showMoreBids = () => setBidsToShow((prev) => prev + 5);
//   const showLessBids = () => setBidsToShow((prev) => Math.max(5, prev - 5));

//   return (
//     <div className="max-w-lg mx-auto p-6 bg-gray-200 rounded-lg shadow-lg mt-5">
//       <ToastContainer position="top-center" />
//       <h1 className="text-3xl font-bold text-center">{auction.title}</h1>
//       <p className="text-gray-800 text-center mt-2">
//         <strong>{auction.description}</strong>
//       </p>
//       <p className="text-gray-800 text-center mt-2">
//         <strong>Starting Price : ₹{auction.startingPrice}</strong>
//       </p>

//       <div className="mt-4 p-6 bg-white rounded-xl shadow-md border text-center border-gray-200">
//         {auction.isActive ? (
//           <>
//             <p className="text-2xl text-blue-700 font-bold">
//               {auction.bids.length > 0 ? `Current Bid: ₹${auction.currentBid}` : `Starting Price: ₹${auction.startingPrice}`}
//             </p>
//             {auction.bids.length > 0 && currentBidder && (
//               <p className="mt-2 text-lg font-semibold text-green-600">
//                 Current Bidder: {currentBidder.user?.name || "Anonymous"}
//               </p>
//             )}
//           </>
//         ) : (
//           <>
//             <p className="text-2xl text-blue-700 font-bold">
//               Last Bid: ₹{auction.currentBid}
//             </p>
//             {currentBidder && (
//               <p className="mt-2 text-lg font-semibold text-green-600">
//                 Last Bidder: {currentBidder.user?.name || "Anonymous"}
//               </p>
//             )}
//           </>
//         )}
//       </div>

//       {isOwner && auction.isActive && (
//         <p className="text-center text-md text-red-500 mt-2">
//           You cannot bid on your own auction.
//         </p>
//       )}
//       {!isLoggedIn && (
//         <p className="text-center text-md text-red-500 mt-2">
//           You must be logged in to place a bid.
//         </p>
//       )}

//       {isOwner && auction.isActive && (
//         <div className="flex justify-center mt-6">
//           <button
//             onClick={handleCloseAuction}
//             className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-all"
//             disabled={closing}
//           >
//             {closing ? "Closing..." : "Close Auction"}
//           </button>
//         </div>
//       )}

//       {isLoggedIn && !isOwner && auction.isActive && (
//         <div className="flex justify-center mt-4">
//           <button
//             onClick={handleBid}
//             disabled={placingBid}
//             className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-all shadow-md"
//           >
//             {placingBid ? "Placing Bid..." : `Place Bid ₹${minBidAmount}`}
//           </button>
//         </div>
//       )}

//       <h2 className="text-xl font-semibold mt-6">Bids History:</h2>
//       {auction.bids.length > 0 ? (
//         <div className="border rounded-lg p-4 bg-gray-50">
//           <ul>
//             {auction.bids
//               .slice()
//               .reverse()
//               .slice(0, bidsToShow)
//               .map((bid, index) => (
//                 <li key={index} className="border-b last:border-0 py-2">
//                   ₹{bid.amount} by {bid.user?.name || "Unknown"} at{" "}
//                   {new Date(bid.timestamp).toLocaleString()}
//                 </li>
//               ))}
//           </ul>
//           <div className="flex justify-between mt-4">
//             {bidsToShow < auction.bids.length && (
//               <button
//                 className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
//                 onClick={showMoreBids}
//               >
//                 Show More
//               </button>
//             )}
//             {bidsToShow > 5 && (
//               <button
//                 className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
//                 onClick={showLessBids}
//               >
//                 Show Less
//               </button>
//             )}
//           </div>
//         </div>
//       ) : (
//         <p className="text-gray-500">No bids yet.</p>
//       )}
//     </div>
//   );
// };

// export default AuctionDetails;



import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import socket from "../socket";
import "react-toastify/dist/ReactToastify.css";
import { Clock, User, ChevronDown, ChevronUp } from 'lucide-react';

// Improved BidsHistory component
const BidsHistory = ({ auction, bidsToShow, showMoreBids, showLessBids }) => {
  if (!auction || !auction.bids) {
    return null;
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mt-6 flex items-center">
        <span>Bids History</span>
        {auction.bids.length > 0 && (
          <span className="ml-2 bg-gray-700 text-gray-200 text-xs px-2 py-1 rounded-full">
            {auction.bids.length}
          </span>
        )}
      </h2>
      
      {auction.bids.length > 0 ? (
        <div className="mt-3 rounded-lg bg-gray-900 text-gray-100 p-4 shadow-lg border border-gray-700">
          {/* Table header */}
          <div className="grid grid-cols-3 gap-2 px-3 py-2 border-b border-gray-700 mb-2 text-gray-400 text-sm font-medium">
            <div>Bidder</div>
            <div className="text-center">Amount</div>
            <div className="text-right">Time</div>
          </div>
          
          {/* Bids list */}
          <ul className="space-y-2">
            {auction.bids
              .slice()
              .reverse()
              .slice(0, bidsToShow)
              .map((bid, index) => (
                <li
                  key={index}
                  className="grid grid-cols-3 gap-2 items-center hover:bg-gray-800 px-3 py-2 rounded transition-colors"
                >
                  {/* Bidder name */}
                  <div className="flex items-center">
                    <User size={14} className="mr-2 text-gray-400" />
                    <span className="text-gray-200 truncate">
                      {bid.user?.name || "anonymous"}
                    </span>
                  </div>
                  
                  {/* Bid amount */}
                  <div className="text-center">
                    <span className="text-green-400 font-semibold">
                      ₹ {bid.amount.toFixed(2)}
                    </span>
                  </div>
                  
                  {/* Timestamp */}
                  <div className="flex items-center justify-end text-gray-400 text-sm">
                    <Clock size={12} className="mr-1" />
                    <span>{formatTime(bid.timestamp)}</span>
                  </div>
                </li>
              ))}
          </ul>

          <div className="flex justify-center gap-4 mt-4 pt-2 border-t border-gray-700">
            {bidsToShow < auction.bids.length && (
              <button
                className="px-4 py-2 bg-gray-800 border border-gray-600 hover:bg-gray-700 rounded-md text-sm text-gray-200 transition flex items-center"
                onClick={showMoreBids}
              >
                <span>Show More</span>
                <ChevronDown size={16} className="ml-1" />
              </button>
            )}
            {bidsToShow > 5 && (
              <button
                className="px-4 py-2 bg-gray-800 border border-gray-600 hover:bg-gray-700 rounded-md text-sm text-gray-200 transition flex items-center"
                onClick={showLessBids}
              >
                <span>Show Less</span>
                <ChevronUp size={16} className="ml-1" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-3 bg-gray-900 text-gray-300 rounded-lg p-6 text-center border border-gray-700">
          <p className="text-lg font-medium">No bids yet</p>
          <p className="text-sm text-gray-500 mt-1">Be the first to place a bid on this auction!</p>
        </div>
      )}
    </div>
  );
};

const AuctionDetails = () => {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placingBid, setPlacingBid] = useState(false);
  const [closing, setClosing] = useState(false);
  const [bidsToShow, setBidsToShow] = useState(5);

  const { user, token } = useSelector((state) => state.auth);

  const getMinBidIncrease = (currentBid) => {
    if (currentBid < 1000) return 50;
    if (currentBid < 5000) return 100;
    return 500;
  };

  const getHighestBidder = (bids) => {
    if (bids.length === 0) return null;
    return bids.reduce((maxBid, currentBid) =>
      currentBid.amount > maxBid.amount ? currentBid : maxBid
    );
  };

  const minBidAmount = useMemo(() => {
    const base = auction?.currentBid ?? auction?.startingPrice ?? 0;
    return base + getMinBidIncrease(base);
  }, [auction]);

  useEffect(() => {
    // Fetch auction
    const fetchAuctionDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/auctions/${id}`);
        setAuction(res.data);
      } catch (error) {
        toast.error("Error fetching auction details");
      } finally {
        setLoading(false);
      }
    };

    fetchAuctionDetails();

    // SOCKET: Listen to newBid
    socket.on("newBid", (data) => {
      if (data.auctionId === id) {
        setAuction((prev) => ({
          ...prev,
          currentBid: data.bid.amount,
          bids: [...prev.bids, data.bid],
        }));
      }
    });

    return () => {
      socket.off("newBid");
    };
  }, [id]);

  if (loading) 
    return (
      <div className="max-w-lg mx-auto p-6 bg-gray-100 rounded-lg shadow-lg mt-5 flex justify-center">
        <div className="animate-pulse flex space-x-4">
          <div className="h-10 w-10 rounded-full bg-gray-300"></div>
          <div className="flex-1 space-y-6 py-1">
            <div className="h-2 bg-gray-300 rounded"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-gray-300 rounded col-span-2"></div>
                <div className="h-2 bg-gray-300 rounded col-span-1"></div>
              </div>
              <div className="h-2 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
    
  if (!auction) 
    return (
      <div className="max-w-lg mx-auto p-6 bg-red-50 rounded-lg shadow-lg mt-5 border border-red-200">
        <p className="text-center text-red-500 font-medium">Auction not found.</p>
      </div>
    );

  const currentBidder = getHighestBidder(auction.bids);
  const isOwner = auction?.createdBy?.email === user?.email;
  const isAuctionClosed = !auction.isActive;
  const isLoggedIn = !!user;

  const handleBid = async () => {
    if (!user) {
      toast.error("You must be logged in to bid.");
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
      toast.success("Bid placed successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error placing bid");
    } finally {
      setPlacingBid(false);
    }
  };

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
      toast.success("Auction closed successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error closing auction");
    } finally {
      setClosing(false);
    }
  };

  const showMoreBids = () => setBidsToShow((prev) => prev + 5);
  const showLessBids = () => setBidsToShow((prev) => Math.max(5, prev - 5));

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-100 rounded-lg shadow-lg mt-5">
      <ToastContainer position="top-center" />
      
      {/* Status badge */}
      <div className="flex justify-center mb-2">
        <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${
          auction.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {auction.isActive ? 'Active' : 'Closed'}
        </span>
      </div>
      
      <h1 className="text-3xl font-bold text-center text-gray-800">{auction.title}</h1>
      
      <p className="text-gray-700 text-center mt-3 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
        {auction.description}
      </p>
      
      {/* Main auction info card */}
      <div className="mt-6 p-6 bg-white rounded-xl shadow-md border border-gray-200">
        <div className="flex flex-col items-center">
          {auction.isActive ? (
            <>
              <p className="text-sm uppercase tracking-wide text-gray-500 font-semibold">
                {auction.bids.length > 0 ? 'Current Bid' : 'Starting Price'}
              </p>
              <p className="text-3xl text-blue-700 font-bold mt-1">
                ₹{auction.bids.length > 0 ? auction.currentBid : auction.startingPrice}
              </p>
              {auction.bids.length > 0 && currentBidder && (
                <div className="mt-3 flex items-center bg-green-50 px-4 py-2 rounded-full">
                  <span className="text-green-700 font-medium">
                    Current Bidder: {currentBidder.user?.name || "Anonymous"}
                  </span>
                </div>
              )}
            </>
          ) : (
            <>
              <p className="text-sm uppercase tracking-wide text-gray-500 font-semibold">
                Final Bid
              </p>
              <p className="text-3xl text-blue-700 font-bold mt-1">
                ₹{auction.currentBid}
              </p>
              {currentBidder && (
                <div className="mt-3 flex items-center bg-blue-50 px-4 py-2 rounded-full">
                  <span className="text-blue-700 font-medium">
                    Winning Bidder: {currentBidder.user?.name || "Anonymous"}
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Starting price info */}
        {auction.isActive && auction.bids.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Starting Price: <span className="font-medium">₹{auction.startingPrice}</span>
            </p>
          </div>
        )}
      </div>

      {/* User status messages */}
      {isOwner && auction.isActive && (
        <div className="mt-3 px-4 py-2 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200">
          <p className="text-center text-sm font-medium">
            You cannot bid on your own auction.
          </p>
        </div>
      )}
      
      {!isLoggedIn && (
        <div className="mt-3 px-4 py-2 bg-blue-50 text-blue-800 rounded-lg border border-blue-200">
          <p className="text-center text-sm font-medium">
            You must be logged in to place a bid.
          </p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex justify-center mt-6 gap-4">
        {isOwner && auction.isActive && (
          <button
            onClick={handleCloseAuction}
            className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-all shadow-md disabled:opacity-70"
            disabled={closing}
          >
            {closing ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Closing...
              </span>
            ) : "Close Auction"}
          </button>
        )}

        {isLoggedIn && !isOwner && auction.isActive && (
          <button
            onClick={handleBid}
            disabled={placingBid}
            className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-all shadow-md disabled:opacity-70"
          >
            {placingBid ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Placing Bid...
              </span>
            ) : `Place Bid ₹${minBidAmount}`}
          </button>
        )}
      </div>

      {/* Updated Bids History section with improved component */}
      <div className="mt-6">
        <BidsHistory 
          auction={auction} 
          bidsToShow={bidsToShow} 
          showMoreBids={showMoreBids} 
          showLessBids={showLessBids} 
        />
      </div>
    </div>
  );
};

export default AuctionDetails;