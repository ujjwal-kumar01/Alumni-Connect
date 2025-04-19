import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaUserPlus } from "react-icons/fa";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    year: "",
    company: "",
    location: "",
    image: null,
  });

  const [previewImage, setPreviewImage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Graduation year validation
    if (parseInt(formData.year) <= 2007) {
      setError("Graduation year must be greater than 2007.");
      return;
    }

    try {
      const form = new FormData();
      form.append("fullName", formData.name);
      form.append("email", formData.email);
      form.append("password", formData.password);
      form.append("year", formData.year);
      form.append("company", formData.company);
      form.append("location", formData.location);

      if (formData.image) {
        form.append("avatar", formData.image);
      } else {
        setError("Please upload a profile image.");
        return;
      }

      const res = await fetch("http://localhost:8000/api/v1/user/register", {
        method: "POST",
        body: form,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Something went wrong");
      }

      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl border border-gray-200">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <FaUserPlus className="text-blue-600 text-3xl" />
          <h2 className="text-3xl font-bold text-gray-800">Sign Up</h2>
        </div>
        <p className="text-center text-gray-500 mb-4">Join our alumni network today!</p>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 text-center">
            <label className="block text-gray-600 mb-1">Profile Image</label>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-full border shadow-sm"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 border text-sm shadow-sm">
                  No Image
                </div>
              )}
              <label className="cursor-pointer bg-blue-100 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-200 transition shadow-sm">
                Choose Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-gray-600">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter your name"
            />
          </div>

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
              placeholder="Create a password"
            />
          </div>

          <div>
            <label className="block text-gray-600">Graduation Year</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter year"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-600">Company (Optional)</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter company name"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-600">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter your location"
            />
          </div>

          <div className="md:col-span-2 flex justify-center">
            <button
              type="submit"
              className="w-full md:w-1/2 bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition duration-300 shadow-md"
            >
              Sign Up
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
