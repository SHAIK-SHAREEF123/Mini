import React,{ useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";

const CreateAuction = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [endTime, setEndTime] = useState("");
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate(); // Initialize navigate

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

      alert("Auction Created Successfully!");
      navigate("/"); // Redirect to auction list
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Create Auction</h2>

        <input
          type="text"
          placeholder="Auction Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        ></textarea>

        <input
          type="number"
          placeholder="Starting Price"
          value={startingPrice}
          onChange={(e) => setStartingPrice(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />

        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        <button type="submit" className="bg-blue-600 text-white p-2 rounded w-full">
          Create Auction
        </button>
      </form>
    </div>
  );
};

export default CreateAuction;
