import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AuctionDetails from "./pages/AuctionDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import LiveAuctions from "./components/LiveAuctions";
import CreateAuction from './components/CreateAuction';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/" element={<LiveAuctions />} />
        <Route path="/auction/:id" element={<AuctionDetails />} />
        <Route path="/create-auction" element={<CreateAuction />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/auctions" element={<LiveAuctions />} />
        {/* <Route path="/create-auction" element={<CreateAuction />} /> */}
        <Route path="/auction/:id" element={<AuctionDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
