import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [alumni, setAlumni] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/v1/user/${id}`);
        if (res.data.success && res.data.user) {
          setAlumni(res.data.user);
        } else {
          setNotFound(true);
        }
      } catch (err) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center mt-10 text-xl text-gray-600">
        Loading...
      </div>
    );
  }

  if (notFound || !alumni) {
    return (
      <div className="text-center mt-10 text-2xl text-red-500">
        Alumni Not Found
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-100 to-blue-100 px-4 pt-10 pb-20">
      <div className="bg-white p-8 rounded-2xl shadow-lg flex flex-col md:flex-row items-center md:items-start gap-8 w-full max-w-4xl border border-gray-200">
        
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-blue-200 shadow-md">
            {alumni.avatar ? (
              <img
                src={alumni.avatar}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <svg
                className="w-full h-full text-blue-400 p-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-4.418 0-8 3.582-8 8h16c0-4.418-3.582-8-8-8z" />
              </svg>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-blue-700 mb-2">
            {alumni.fullName}
          </h1>
          <p className="text-lg text-gray-700 mb-1">
            {alumni.company || "Company Unknown"} | Class of {alumni.year || "N/A"}
          </p>
          <p className="text-md text-gray-500 mb-1">
            {alumni.location || "Location Unknown"}
          </p>
          <p className="text-md text-gray-600 mb-4">
            📧 {alumni.email}
          </p>

          <div className="flex flex-wrap gap-4 mt-4">
            <button
              onClick={() => navigate(-1)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
            >
              ← Back
            </button>

            <button
              onClick={() => navigate(`/update-profile/${alumni._id}`)}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition"
            >
              ✏️ Update Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
