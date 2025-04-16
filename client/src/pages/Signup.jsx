import React, { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { loginStart, loginSuccess, loginFailure } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      dispatch(loginSuccess(res.data));
      toast.success("Signup successful!");
      navigate("/dashboard");
    } catch (error) {
      console.log(error.message);
      dispatch(loginFailure(error.response?.data?.message || "Signup failed"));
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 mt-10">
      <ToastContainer position="top-center" />
      <div className="bg-white bg-opacity-30 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-96">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-6">Signup</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-black font-medium">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              className="w-full p-3 mt-1 bg-white bg-opacity-80 text-gray-900 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="text-black font-medium">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your college email"
              className="w-full p-3 mt-1 bg-white bg-opacity-80 text-gray-900 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="text-black font-medium">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              className="w-full p-3 mt-1 bg-white bg-opacity-80 text-gray-900 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-bold py-3 rounded-lg transition-all shadow-lg hover:shadow-xl ${
              loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Signing up..." : "Signup"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
