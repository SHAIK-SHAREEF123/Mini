import React,{ useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { loginStart, loginSuccess, loginFailure } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);
      dispatch(loginSuccess(res.data));
      // navigate("/dashboard");
      navigate("/auctions");
    } catch (error) {
      dispatch(loginFailure(error.response?.data?.message || "Login failed"));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" name="email" placeholder="Email" className="w-full p-3 border rounded"
            onChange={handleChange} />
          <input type="password" name="password" placeholder="Password" className="w-full p-3 border rounded"
            onChange={handleChange} />
          <button className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
