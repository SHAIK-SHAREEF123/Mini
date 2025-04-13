import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { FiMenu, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import { FaGavel } from "react-icons/fa";


const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logout successful");
    navigate("/");
  };

  const handleCreateAuctionClick = (e) => {
    if (!user) {
      e.preventDefault();
      toast.warning("Please login to create an auction");
      navigate("/login");
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="bg-blue-600/70 backdrop-blur-md fixed w-full top-0 z-50 shadow-md text-white">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-wide">
          <FaGavel className="text-black text-2xl" />
          Auction Hub
        </Link>


        {/* Mobile Menu Button */}
        <button className="md:hidden text-white text-2xl" onClick={toggleMenu}>
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* Navigation Links */}
        <div
          className={`md:flex items-center space-x-6 transition-all duration-300 ease-in-out ${menuOpen ? "block mt-4" : "hidden md:flex"
            }`}
        >
          <NavLink to="/" text="Home" location={location} />

          <Link
            to="/create-auction"
            onClick={handleCreateAuctionClick}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${location.pathname === "/create-auction"
                ? "bg-white text-blue-600 shadow-inner border-b-2 border-blue-600"
                : "bg-yellow-300 text-black hover:bg-yellow-400"
              }`}
          >
            Create Auction
          </Link>

          {user ? (
            <>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleLogout}
                  className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
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
    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${location.pathname === to
        ? "bg-white text-blue-600 font-semibold border-b-2 border-blue-600"
        : "hover:bg-white hover:text-blue-600"
      }`}
  >
    {text}
  </Link>
);

export default Navbar;