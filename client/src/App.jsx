import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'; // ✅ Correct
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuctionDetails from "./pages/AuctionDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import LiveAuctions from "./components/LiveAuctions";
import CreateAuction from './components/CreateAuction';
import AuthForm from './pages/AuthForm';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import socket from './socket';
import { loginSuccess } from './redux/slices/authSlice';
import Profile from "./pages/Profile";
import Settings from "./pages/ProfileSettings";

const App = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  // ✅ Hydrate Redux from localStorage
  useEffect(() => {
    if (!user && token) {
      dispatch(loginSuccess({ token }));
    }
  }, [user, token, dispatch]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('✅ Connected to WebSocket server');
    });

    socket.on('disconnect', () => {
      console.log('❌ Disconnected from WebSocket server');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Router>
      <Navbar key={user ? user._id : "guest"} />
      <Routes>
        <Route path="/" element={<LiveAuctions />} />
        <Route path="/auctions" element={<LiveAuctions />} />
        <Route path="/auction/:id" element={<AuctionDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        {/* <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} /> */}
        <Route path="/auth" element={<AuthForm />} />
        <Route
          path="/create-auction"
          element={
            <ProtectedRoute>
              <CreateAuction />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToastContainer position="top-right" autoClose={2000} />
    </Router>
  );
};

export default App;