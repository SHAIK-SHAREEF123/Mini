import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, Shield } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
// import { toast } from 'react-hot-toast';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);

  const navigate = useNavigate();
  const API_URL = "http://localhost:5000"; // Replace with your backend URL

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // Check password match when either password or confirmPassword changes
    if (!isLogin && (e.target.name === "password" || e.target.name === "confirmPassword")) {
      if (e.target.name === "confirmPassword") {
        setPasswordMatch(formData.password === e.target.value);
      } else if (e.target.name === "password") {
        setPasswordMatch(e.target.value === formData.confirmPassword || formData.confirmPassword === "");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setPasswordMatch(false);
      setLoading(false);
      return;
    }

    const endpoint = isLogin ? "/login" : "/signup";
    const requestBody = isLogin
      ? { email: formData.email, password: formData.password }
      : {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };
      
    try {
      const response = await axios.post(`${API_URL}/api/auth/${endpoint}`, requestBody);

      localStorage.setItem("token", response.data.token);
      toast.success(`${isLogin ? "Login" : "Sign Up"} Successful!`, { duration: 2000, position: "bottom-right" });
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });
      // navigate("/");
      window.location.href = "/";
    } catch (err) { 
      setError(err.response?.data?.message || err.response?.data || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (details) => {
    try {
      console.log("in side google login functoon");
      console.log(details);

      // const response = await axios.post(`${API_URL}/googlelogin`, { email:details.email, fullName: details.name });

      const response = await axios.post(`${API_URL}/googlelogin`,
        { email: details.email, name: details.name },
        {
          withCredentials: true, // ✅ This is mandatory for cross-origin cookies
          headers: { "Content-Type": "application/json" }
        }
      );

      console.log('response');
      console.log(response);
      localStorage.setItem("token", response.data.token);

      toast.success(`Login Successful`, { duration: 2000, position: "bottom-right" });

      setFormData({ name: "", email: "", password: "", confirmPassword: "" });
      navigate("/");
    } catch (error) {
      setError("Google login failed");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center"
      style={{
        backgroundImage: "url('/auction.jpg')", // Image in public folder
      }}
    >
      <ToastContainer />
      
      <motion.div
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex justify-between mb-8">
          <button
            className={`text-lg font-semibold flex-1 p-3 transition-all ${isLogin ? "border-b-4 border-[#0077B6] text-[#0077B6]" : "text-gray-500 hover:text-gray-700"
              }`}
            onClick={() => setIsLogin(true)}
          >
            Sign In
          </button>
          <button
            className={`text-lg font-semibold flex-1 p-3 transition-all ${!isLogin ? "border-b-4 border-[#0077B6] text-[#0077B6]" : "text-gray-500 hover:text-gray-700"
              }`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-3 top-3 text-[#0077B6]" size={20} />
              <input
                type="text"
                name="name"
                placeholder="Your Full Name"
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0077B6] focus:ring-2 focus:ring-blue-100 transition-all"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
          )}
          
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-[#0077B6]" size={20} />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0077B6] focus:ring-2 focus:ring-blue-100 transition-all"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-[#0077B6]" size={20} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0077B6] focus:ring-2 focus:ring-blue-100 transition-all"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          {!isLogin && (
            <div className="relative">
              <Shield className="absolute left-3 top-3 text-[#0077B6]" size={20} />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className={`w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${
                  !passwordMatch && formData.confirmPassword 
                    ? "border-red-500 bg-red-50" 
                    : formData.confirmPassword && passwordMatch 
                      ? "border-green-500 bg-green-50" 
                      : "border-gray-300"
                }`}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required={!isLogin}
              />
              {!passwordMatch && formData.confirmPassword && (
                <p className="text-red-500 text-xs mt-1 ml-2">Passwords do not match</p>
              )}
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <motion.button
            type="submit"
            className="w-full bg-gradient-to-r from-[#0077B6] to-[#023E8A] text-white py-3 rounded-lg font-semibold transition-all disabled:opacity-50 mt-4"
            whileHover={{ scale: loading ? 1 : 1.03 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            disabled={loading || (!isLogin && !passwordMatch && formData.confirmPassword)}
          >
            {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
          </motion.button>

          {/* {isLogin && (
            <div className="text-center mt-4">
              <a href="#" className="text-[#0077B6] hover:underline text-sm">
                Forgot your password?
              </a>
            </div>
          )} */}
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            className="text-[#0077B6] font-medium hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </div>

        {/* <div className="mt-4 flex flex-col items-center cursor-pointer">
            <GoogleLogin
              text="continue_with"
              onSuccess={(res)=>{
                let details=jwtDecode(res?.credential);
                handleGoogleLogin(details);
              }}
              onError={() => setError("Google login failed")}
            />
          </div> */}
      </motion.div>
    </div>
  );
};

export default AuthForm;