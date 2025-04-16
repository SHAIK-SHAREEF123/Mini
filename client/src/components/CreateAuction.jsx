import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateAuction = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [endTime, setEndTime] = useState("");
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !startingPrice || !endTime) {
      toast.error("All fields are required!");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/auctions",
        { title, description, startingPrice, endTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Auction Created Successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-50 to-indigo-100 px-4 py-10">
      <div className="w-full max-w-md">
        <ToastContainer position="top-right" autoClose={3000} />
        
        <form
          onSubmit={handleSubmit}
          className="bg-white bg-opacity-90 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-gray-100"
        >
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
              Create New Auction
            </h2>
            <p className="text-gray-500 mt-2">Fill out the details to list your item</p>
          </div>

          <div className="space-y-5">
            <div className="group">
              <label className="block text-gray-700 text-sm font-medium mb-2 group-focus-within:text-blue-600 transition-colors">
                Auction Title
              </label>
              <input
                type="text"
                placeholder="Enter a compelling title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 bg-gray-50 text-gray-900 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:bg-gray-100"
                required
              />
            </div>

            <div className="group">
              <label className="block text-gray-700 text-sm font-medium mb-2 group-focus-within:text-blue-600 transition-colors">
                Description
              </label>
              <textarea
                placeholder="Describe your item in detail"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full p-3 bg-gray-50 text-gray-900 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:bg-gray-100 resize-none"
                required
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">
                Include condition, features, and any other relevant details
              </p>
            </div>

            <div className="group">
              <label className="block text-gray-700 text-sm font-medium mb-2 group-focus-within:text-blue-600 transition-colors flex items-center">
                Starting Price
                <span className="ml-1 text-lg font-semibold text-blue-600">₹</span>
              </label>
              <input
                type="number"
                placeholder="0.00"
                value={startingPrice}
                onChange={(e) => setStartingPrice(e.target.value)}
                className="w-full p-3 bg-gray-50 text-gray-900 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:bg-gray-100"
                required
              />
            </div>

            <div className="group">
              <label className="block text-gray-700 text-sm font-medium mb-2 group-focus-within:text-blue-600 transition-colors">
                Auction End Date & Time
              </label>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full p-3 bg-gray-50 text-gray-900 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:bg-gray-100"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Your auction will automatically close at this time
              </p>
            </div>

            <div className="mt-8">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create Auction
              </button>
              
              <button
                type="button"
                onClick={() => navigate("/")}
                className="w-full mt-4 bg-transparent hover:bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-lg transition-all border border-gray-200 hover:border-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAuction;