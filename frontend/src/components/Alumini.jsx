import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FindAlumni = () => {
  const [alumniList, setAlumniList] = useState([]);
  const [search, setSearch] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [unreadCounts, setUnreadCounts] = useState({});

  const navigate = useNavigate();
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/user/all");
        const filtered = res.data.users.filter(
          (alumni) => alumni._id !== loggedInUser?._id
        );
        setAlumniList(filtered);
      } catch (error) {
        console.error("Error fetching alumni:", error);
      }
    };

    fetchAlumni();
  }, [loggedInUser?._id]);

  useEffect(() => {
    const fetchUnreadCounts = async () => {
      console.log(loggedInUser)
      try {
        console.log("calling request")
        const res = await axios.get(
          `http://localhost:8000/api/v1/message/unread/${loggedInUser._id}/hello`
        );
        console.log(res)
        setUnreadCounts(res.data.unreadCounts || {});
      } catch (error) {
        console.error("Error fetching unread message counts:", error);
      }
    };

    if (loggedInUser?._id) {
      fetchUnreadCounts();
    }
  }, [alumniList, loggedInUser?._id]);

  const resetFilters = () => {
    setSearch("");
    setCompanyFilter("");
    setYearFilter("");
    setLocationFilter("");
  };

  const uniqueCompanies = [...new Set(alumniList.map(a => a.company).filter(Boolean))];
  const uniqueYears = [...new Set(alumniList.map(a => a.year).filter(Boolean))];
  const uniqueLocations = [...new Set(alumniList.map(a => a.location).filter(Boolean))];

  const filteredAlumni = alumniList.filter((alumni) =>
    alumni?.fullName?.toLowerCase().includes(search.toLowerCase()) &&
    (companyFilter === "" || alumni?.company?.toLowerCase() === companyFilter.toLowerCase()) &&
    (yearFilter === "" || alumni?.year?.toString() === yearFilter) &&
    (locationFilter === "" || alumni?.location?.toLowerCase() === locationFilter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-100 to-blue-100 p-6">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-8 tracking-wide">
        🎓 Find Alumni
      </h1>

      {/* Filters Panel */}
      <div className="bg-white/70 backdrop-blur-lg border border-white/30 rounded-3xl shadow-xl p-6 mb-10">
        <input
          type="text"
          placeholder="Search by name..."
          className="w-full p-3 mb-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            className="p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
          >
            <option value="">Filter by Company</option>
            {uniqueCompanies.map((company, idx) => (
              <option key={idx} value={company}>{company}</option>
            ))}
          </select>

          <select
            className="p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
          >
            <option value="">Filter by Year</option>
            {uniqueYears.map((year, idx) => (
              <option key={idx} value={year}>{year}</option>
            ))}
          </select>

          <select
            className="p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            <option value="">Filter by Location</option>
            {uniqueLocations.map((location, idx) => (
              <option key={idx} value={location}>{location}</option>
            ))}
          </select>
        </div>

        <button
          onClick={resetFilters}
          className="mt-6 w-full md:w-auto bg-gray-600 text-white px-6 py-3 rounded-xl hover:bg-gray-700 transition"
        >
          🔄 Reset Filters
        </button>
      </div>

      {/* Alumni Cards */}
      <div className="grid grid-cols-1 gap-6">
        {filteredAlumni.length > 0 ? (
          filteredAlumni.map((alumni) => {
            const unreadCount = unreadCounts[alumni._id] || 0;

            return (
              <div
                key={alumni._id}
                className="bg-white/80 border border-white/30 backdrop-blur-md p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 hover:scale-[1.01] flex flex-col md:flex-row justify-between items-start md:items-center"
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {alumni.fullName || "Unknown"}
                  </h2>
                  <p className="text-gray-500">
                    {alumni.company || "N/A"} | {alumni.year || "N/A"} | {alumni.location || "N/A"}
                  </p>
                </div>

                <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-3 items-start md:items-center relative">
                  <button
                    onClick={() => navigate(`/profile/${alumni._id}`)}
                    className="px-5 py-2 text-white font-semibold rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transition shadow-md"
                  >
                    View Profile
                  </button>

                  <button
                    onClick={() => navigate(`/chat/${alumni._id}`)}
                    className="relative px-5 py-2 text-white font-semibold rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transition shadow-md"
                  >
                    Chat Now
                    {unreadCount > 0 && (
                      <span className="absolute top-[-6px] right-[-6px] bg-red-400 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500">No alumni found.</p>
        )}
      </div>
    </div>
  );
};

export default FindAlumni;
