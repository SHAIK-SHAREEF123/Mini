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
      alert("All fields are required!");
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
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[85vh] bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white bg-opacity-30 backdrop-blur-md p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center text-black mb-6">Create New Auction</h2>

        <label className="text-black flex justify-start font-medium mb-1">Title</label>
        <input
          type="text"
          placeholder="Auction Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 mb-4 bg-white bg-opacity-80 text-gray-900 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />

        <label className="text-black flex justify-start font-medium mb-1">Description</label>
        <textarea
          placeholder="Auction Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full p-3 mb-4 bg-white bg-opacity-80 text-gray-900 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
        ></textarea>

        <label className="text-black flex justify-start font-medium mb-1">Starting Price (₹)</label>
        <input
          type="number"
          placeholder="Enter Starting Price"
          value={startingPrice}
          onChange={(e) => setStartingPrice(e.target.value)}
          className="w-full p-3 mb-4 bg-white bg-opacity-80 text-gray-900 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />

        <label className="text-black flex justify-start font-medium mb-1">End Time</label>
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="w-full p-3 mb-6 bg-white bg-opacity-80 text-gray-900 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg hover:shadow-xl"
        >
          Create Auction
        </button>
      </form>
    </div>
  );
};

export default CreateAuction;
