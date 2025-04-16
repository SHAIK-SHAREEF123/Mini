  import React, { useState, useEffect, useRef } from "react";
  import { Link, useLocation, useNavigate } from "react-router-dom";
  import { useSelector, useDispatch } from "react-redux";
  import { logout } from "../redux/slices/authSlice";
  import { toast } from "react-toastify";
  import { FaGavel } from "react-icons/fa";
  import { Menu, UserCircle, LogOut, Settings, LogIn, User, Plus, Home } from 'lucide-react';

  const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useSelector((state) => state.auth);
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef(null);
    const mobileMenuRef = useRef(null);

    const handleLogout = () => {
      dispatch(logout());
      toast.success("Logout successful");
      navigate("/");
      setProfileOpen(false);
    };

    const handleCreateAuctionClick = (e) => {
      if (!user) {
        e.preventDefault();
        toast.warning("Please login to create an auction");
        navigate("/auth");
      }
    };

    const toggleMenu = () => {
      setMenuOpen(!menuOpen);
    };

    // Close profile dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (profileRef.current && !profileRef.current.contains(event.target)) {
          setProfileOpen(false);
        }
        if (menuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('[data-menu-toggle]')) {
          setMenuOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [user, menuOpen]);

    // Close menu when route changes
    useEffect(() => {
      setMenuOpen(false);
      setProfileOpen(false);
    }, [location.pathname]);

    return (
      <nav className="sticky top-0 bg-gradient-to-r from-blue-900 to-indigo-900 shadow-md px-4 sm:px-6 py-3 flex justify-between items-center text-white relative z-50">
        {/* Left Side: Logo */}
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-white">
          <FaGavel className="text-yellow-400" />
          <span className="hidden sm:block">Auction Hub</span>
        </Link>

        {/* Right Side: Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <NavLink to="/" text="Home" location={location} icon={<Home size={16} />} />
          <Link
            to="/create-auction"
            onClick={handleCreateAuctionClick}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
              location.pathname === "/create-auction"
                ? "bg-white text-blue-600 shadow-sm border-b-2 border-blue-500"
                : "bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-800 hover:shadow-md hover:from-yellow-500 hover:to-yellow-600"
            }`}
          >
            <Plus size={16} /> Create Auction
          </Link>

          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                {/* <span className="hidden sm:block text-sm font-medium">{user.name || "User"}</span> */}
                <UserCircle className="w-8 h-8" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-xl rounded-md py-1 z-50 overflow-hidden border border-gray-100">
                  {/* <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-800">{user.name || "User"}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email || ""}</p>
                  </div> */}
                  <Link to="/profile" className="block px-4 py-2 hover:bg-gray-50 text-gray-700 flex gap-2 items-center text-sm">
                    <User className="w-4 h-4 text-blue-500" /> Profile
                  </Link>
                  <Link to="/settings" className="block px-4 py-2 hover:bg-gray-50 text-gray-700 flex gap-2 items-center text-sm">
                    <Settings className="w-4 h-4 text-blue-500" /> Settings
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-red-500 text-sm"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/auth"
              className="flex items-center gap-2 bg-white text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              <LogIn className="w-4 h-4" /> Login
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button onClick={toggleMenu} data-menu-toggle>
            <Menu className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {menuOpen && (
          <div 
            ref={mobileMenuRef}
            className="absolute top-full right-0 w-64 bg-white shadow-xl rounded-b-lg flex flex-col py-2 md:hidden z-40 transform transition-transform duration-200 ease-in-out"
          >
            <div className="px-4 py-2 mb-2 border-b border-gray-100">
              {user ? (
                <div className="flex items-center gap-3">
                  <UserCircle className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{user.name || "User"}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email || ""}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm font-medium text-gray-800">Guest User</p>
              )}
            </div>

            <Link to="/" className="px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center gap-3">
              <Home size={16} className="text-blue-500" /> Home
            </Link>
            
            <Link
              to="/create-auction"
              onClick={handleCreateAuctionClick}
              className="px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center gap-3"
            >
              <Plus size={16} className="text-blue-500" /> Create Auction
            </Link>
            
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                >
                  <User size={16} className="text-blue-500" /> Profile
                </Link>
                <Link
                  to="/settings"
                  className="px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                >
                  <Settings size={16} className="text-blue-500" /> Settings
                </Link>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  className="px-4 py-2 text-red-500 hover:bg-gray-50 w-full text-left flex items-center gap-3"
                  onClick={handleLogout}
                >
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                >
                  <LogIn size={16} className="text-blue-500" /> Login
                </Link>
                <Link 
                  to="/signup" 
                  className="px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                >
                  <User size={16} className="text-blue-500" /> Signup
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
    );
  };

  // NavLink for desktop active styling
  const NavLink = ({ to, text, location, icon }) => (
    <Link
      to={to}
      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
        location.pathname === to
          ? "bg-white text-blue-600 font-semibold border-b-2 border-blue-500"
          : "hover:bg-white/10 hover:text-blue-100"
      }`}
    >
      {icon} {text}
    </Link>
  );

  export default Navbar;