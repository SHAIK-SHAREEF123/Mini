import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice"; // Import logout action
import { FiMenu, FiX } from "react-icons/fi"; // Icons for mobile menu

const Navbar = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth); // Get user from Redux state
    const location = useLocation(); // Get current route location
    const [menuOpen, setMenuOpen] = useState(false); // Mobile menu state

    const handleLogout = () => {
        dispatch(logout()); // Dispatch logout action
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <nav className="bg-blue-600 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold tracking-wide">Auction Hub</Link>

                {/* Mobile Menu Button */}
                <button className="md:hidden text-white text-2xl" onClick={toggleMenu}>
                    {menuOpen ? <FiX /> : <FiMenu />}
                </button>

                {/* Navigation Links */}
                <div className={`md:flex items-center space-x-6 ${menuOpen ? "block mt-4" : "hidden md:flex"}`}>
                    <NavLink to="/" text="Home" location={location} />
                    <NavLink to="/create-auction" text="Create Auction" location={location} />

                    {user ? (
                        // If logged in, show Logout button
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 px-5 py-2 rounded-lg hover:bg-red-600 transition"
                        >
                            Logout
                        </button>
                    ) : (
                        // If not logged in, show Login & Signup links
                        <>
                            <NavLink to="/login" text="Login" location={location} />
                            <NavLink to="/signup" text="Signup" location={location} />
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

// Custom NavLink Component for Active Styling
const NavLink = ({ to, text, location }) => (
    <Link
        to={to}
        className={`px-4 py-2 rounded-lg transition-all ${
            location.pathname === to ? "bg-white text-blue-600 font-semibold" : "hover:bg-white hover:text-blue-600"
        }`}
    >
        {text}
    </Link>
);

export default Navbar;
