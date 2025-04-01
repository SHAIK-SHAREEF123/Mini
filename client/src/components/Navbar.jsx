import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="bg-blue-600 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">Auction Hub</Link>
                <div className="space-x-4">
                    <Link to="/" className="hover:underline">Home</Link>
                    <Link to="/create-auction" className="hover:underline">Create Auction</Link>
                    <Link to="/login" className="hover:underline">Login</Link>
                    <Link to="/signup" className="hover:underline">Signup</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
