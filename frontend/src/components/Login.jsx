import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaSignInAlt } from "react-icons/fa";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8000/api/v1/user/login", formData);

      if (res.data.success) {
        const user = res.data.user;
        const token = res.data.token;

        // Debug logs
        console.log("Login successful:");
        console.log("User:", user);
        console.log("Token:", token);

        // Store in localStorage before navigating
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);

        navigate("/"); // navigate AFTER storage
      } else {
        setError(res.data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Server error. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-200">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <FaSignInAlt className="text-blue-600 text-3xl" />
          <h2 className="text-3xl font-bold text-gray-800">Login</h2>
        </div>
        <p className="text-center text-gray-500 mb-4">Welcome back! Please login to continue.</p>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter your password"
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition duration-300 shadow-md"
            >
              Login
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
