import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../redux/slices/authSlice";

const ProfileSettings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    password: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.currentPassword) {
      toast.error("Current password is required for updates.");
      return;
    }

    try {
      const res = await axios.put(
        "http://localhost:5000/api/user/update",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.setItem("token", res.data.token);
      dispatch(setUser(res.data.user)); // update Redux store
      toast.success("Profile updated successfully!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-indigo-100 to-purple-200 px-6 py-12">
      <div className="bg-white bg-opacity-95 backdrop-blur-sm shadow-2xl rounded-3xl p-10 w-full max-w-md border border-gray-100 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-blue-100 rounded-full opacity-60"></div>
        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-purple-100 rounded-full opacity-60"></div>
        
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text mb-2">
            Update Profile
          </h2>
          <p className="text-center text-gray-500 mb-8">Change your account settings</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-indigo-600 transition-colors duration-200">
                Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  className="w-full p-4 pl-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-gray-50 hover:bg-gray-100 transition-all duration-300"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-indigo-600 transition-colors duration-200">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  className="w-full p-4 pl-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-gray-50 hover:bg-gray-100 transition-all duration-300"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-indigo-600 transition-colors duration-200">
                Current Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="currentPassword"
                  placeholder="Enter current password"
                  className="w-full p-4 pl-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-gray-50 hover:bg-gray-100 transition-all duration-300"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-indigo-600 transition-colors duration-200">
                New Password <span className="text-gray-400 text-xs font-normal ml-1">(optional)</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  placeholder="Leave blank to keep same password"
                  className="w-full p-4 pl-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-gray-50 hover:bg-gray-100 transition-all duration-300"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium py-4 px-6 rounded-xl transition-all duration-300 transform hover:translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 relative overflow-hidden group"
              >
                <span className="relative z-10">Update Profile</span>
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </button>
            </div>
            
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;