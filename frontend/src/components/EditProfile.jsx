import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const EditProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    location: "",
    company: "",
    year: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`http://localhost:8000/api/v1/user/${id}`);
      const user = res.data.user;
      setFormData({
        fullName: user.fullName,
        email: user.email,
        location: user.location,
        company: user.company,
        year: user.year,
      });
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.put(`http://localhost:8000/api/v1/user/update/${id}`, formData);
    navigate(`/Profile/${id}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md p-8 rounded-lg w-full max-w-xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Update Profile</h2>

        {["fullName", "email", "location", "company", "year"].map((field) => (
          <div key={field} className="mb-4">
            <label className="block text-gray-700 mb-1 capitalize">{field}</label>
            <input
              type="text"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg mt-4"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
