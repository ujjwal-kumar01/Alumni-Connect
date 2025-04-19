import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Applicants = () => {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/v1/applications/job/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplicants(res.data?.applications || []);
      } catch (err) {
        console.error('Error fetching applicants:', err);
        setApplicants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [jobId, token]);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-blue-700 flex items-center gap-2 backdrop-blur-2xl">
        👥 Applicants
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-black border-dashed rounded-full animate-spin"></div>
        </div>
      ) : applicants.length === 0 ? (
        <p className="text-gray-500 text-center">No applicants yet. 🚫</p>
      ) : (
        <div className="grid gap-6 ">
          {applicants.map((app) => (
            <div
              key={app._id}
              className="p-5 bg-gray-300 rounded-xl transition-all duration-300 group hover:shadow-2xl hover:bg-blue-100"
            >
              <p className="text-lg font-medium text-gray-800 group-hover:text-blue-700 transition">
                <span className="text-gray-500 font-semibold">👤 Name:</span> {app.userId?.fullName || 'N/A'}
              </p>
              <p className="text-gray-700 mt-1 group-hover:text-blue-700 transition">
                <span className="text-gray-500 font-semibold">📧 Email:</span> {app.userId?.email || 'N/A'}
              </p>

              {app.resumeUrl ? (
                <a
                  href={`http://localhost:8000${app.resumeUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 hover:shadow-lg transition-all text-sm"
                >
                  📄 View Resume
                </a>
              ) : (
                <p className="text-sm text-gray-400 mt-2 italic">No resume uploaded</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Applicants;
