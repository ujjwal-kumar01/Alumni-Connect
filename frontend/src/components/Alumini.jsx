import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Search, RefreshCcw, MessageCircle, User } from "lucide-react";

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
        const { data } = await axios.get("http://localhost:8000/api/v1/user/all");
        const filteredAlumni = data.users.filter(
          (alumni) => alumni._id !== loggedInUser?._id
        );
        setAlumniList(filteredAlumni);
      } catch (error) {
        console.error("Error fetching alumni:", error);
      }
    };
    if (loggedInUser?._id) fetchAlumni();
  }, [loggedInUser?._id]);

  useEffect(() => {
    const fetchUnreadCounts = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8000/api/v1/message/unread/${loggedInUser._id}/hello`
        );
        setUnreadCounts(data.unreadCounts || {});
      } catch (error) {
        console.error("Error fetching unread message counts:", error);
      }
    };
    if (loggedInUser?._id) fetchUnreadCounts();
  }, [loggedInUser?._id, alumniList.length]);

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
    (companyFilter ? alumni?.company?.toLowerCase() === companyFilter.toLowerCase() : true) &&
    (yearFilter ? alumni?.year?.toString() === yearFilter : true) &&
    (locationFilter ? alumni?.location?.toLowerCase() === locationFilter.toLowerCase() : true)
  );

  const sortedAlumni = [...filteredAlumni].sort((a, b) => {
    const unreadA = unreadCounts[a._id] || 0;
    const unreadB = unreadCounts[b._id] || 0;
    return unreadB - unreadA;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-10 px-4 md:px-20">
      {/* Filter Box */}
      <div className="bg-white border border-blue-100 rounded-3xl p-6 shadow-md mb-10">
        <h2 className="text-xl font-semibold text-blue-700 mb-4">Find Alumni</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search by name */}
          <div className="relative col-span-2">
            <Search className="absolute top-3 left-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            />
          </div>

          {/* Company filter */}
          <select
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="p-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Company</option>
            {uniqueCompanies.map((company, i) => (
              <option key={i} value={company}>{company}</option>
            ))}
          </select>

          {/* Year filter */}
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="p-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Year</option>
            {uniqueYears.map((year, i) => (
              <option key={i} value={year}>{year}</option>
            ))}
          </select>

          {/* Location filter */}
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="p-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Location</option>
            {uniqueLocations.map((loc, i) => (
              <option key={i} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        <div className="mt-5 text-right">
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-xl transition font-medium"
          >
            <RefreshCcw size={18} /> Reset Filters
          </button>
        </div>
      </div>

      {/* Alumni Cards */}
      {sortedAlumni.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedAlumni.map((alumni) => {
            const unreadCount = unreadCounts[alumni._id] || 0;

            return (
              <div
                key={alumni._id}
                className="bg-white border border-gray-200 rounded-2xl shadow hover:shadow-lg transition overflow-hidden flex flex-col"
              >
                <div className="flex items-center p-4 border-b">
                  <img
                    src={alumni.avatar || "/default-avatar.png"}
                    alt="avatar"
                    className="w-14 h-14 rounded-full border object-cover"
                  />
                  <div className="ml-4">
                    <h2 className="text-lg font-semibold text-gray-800">{alumni.fullName}</h2>
                    <p className="text-sm text-gray-500">{alumni.company || "No company info"}</p>
                  </div>
                </div>

                <div className="px-4 py-3 flex justify-between items-center">
                  <div className="text-sm text-gray-600 space-y-1">
                    <div><span className="font-medium">Year:</span> {alumni.year || "N/A"}</div>
                    <div><span className="font-medium">Location:</span> {alumni.location || "N/A"}</div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => navigate(`/profile/${alumni._id}`)}
                      className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-1.5 rounded-full flex items-center gap-1"
                    >
                      <User size={16} /> Profile
                    </button>
                    <button
                      onClick={() => navigate(`/chat/${alumni._id}`)}
                      className="relative bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-1.5 rounded-full flex items-center gap-1"
                    >
                      <MessageCircle size={16} /> Chat
                      {unreadCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10">No alumni match your criteria.</p>
      )}
    </div>
  );
};

export default FindAlumni;
