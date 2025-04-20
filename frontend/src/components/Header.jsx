import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import college from "./college.jpg";

export default function Header() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // 👈 Detect route changes

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setLoggedInUser(storedUser ? JSON.parse(storedUser) : null);
  }, [location]); // 👈 Re-run this on every route change

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setLoggedInUser(null);
    navigate("/login");
  };

  return (
    <header className="shadow sticky top-0 z-50 bg-white">
      <nav className="border-gray-200 px-4 lg:px-6 py-3">
        <div className="flex justify-between items-center mx-auto max-w-screen-xl">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={college} className="h-12" alt="Logo" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex flex-1 justify-center">
            <ul className="flex space-x-8">
              <li><Link to="/" className="text-gray-700 hover:text-orange-700 text-lg font-medium">Home</Link></li>
              <li><Link to="/About" className="text-gray-700 hover:text-orange-700 text-lg font-medium">About</Link></li>
              <li><Link to="/Contact" className="text-gray-700 hover:text-orange-700 text-lg font-medium">Contact</Link></li>
              <li><Link to="/Alumini" className="text-gray-700 hover:text-orange-700 text-lg font-medium">Alumni</Link></li>
            </ul>
          </div>

          {/* Desktop User Area */}
          <div className="hidden lg:flex items-center space-x-4">
            {loggedInUser ? (
              <>
                <button
                  onClick={() => navigate(`/Profile/${loggedInUser._id}`)}
                  className="flex items-center space-x-2 text-gray-800 hover:text-orange-700"
                >
                  <FaUserCircle className="text-2xl" />
                  <span className="font-medium text-sm text-black">
                    {loggedInUser.fullName || "User"}
                  </span>
                </button>
                <button
                  onClick={handleLogout}
                  className="text-white bg-orange-600 hover:bg-orange-700 rounded-lg text-sm px-4 py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/Login"
                className="text-white bg-orange-700 hover:bg-orange-800 rounded-lg text-sm px-4 py-2"
              >
                Sign in
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-gray-800 text-2xl"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden fixed top-16 left-0 w-full bg-white border-t shadow-md transition-all duration-300 ${menuOpen ? "block" : "hidden"}`}
        >
          <ul className="flex flex-col items-center space-y-4 py-4">
            <li><Link to="/" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-orange-700 text-lg font-medium">Home</Link></li>
            <li><Link to="/About" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-orange-700 text-lg font-medium">About</Link></li>
            <li><Link to="/Contact" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-orange-700 text-lg font-medium">Contact</Link></li>
            <li><Link to="/Alumini" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-orange-700 text-lg font-medium">Alumni</Link></li>
          </ul>

          {/* Mobile User Section */}
          <div className="flex flex-col items-center mt-4 pb-4 space-y-2">
            {loggedInUser ? (
              <>
                <button
                  onClick={() => {
                    navigate(`/Profile/${loggedInUser._id}`);
                    setMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 text-gray-800 hover:text-orange-700"
                >
                  <FaUserCircle className="text-2xl" />
                  <span className="font-medium text-sm">
                    {loggedInUser.fullName || "User"}
                  </span>
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="text-white bg-orange-600 hover:bg-orange-700 rounded-lg text-sm px-4 py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/Login"
                className="text-white bg-orange-700 hover:bg-orange-800 rounded-lg text-sm px-4 py-2 w-32 text-center"
                onClick={() => setMenuOpen(false)}
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
