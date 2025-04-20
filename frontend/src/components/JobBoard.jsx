import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const JobBoard = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
  });
  const [editingJobId, setEditingJobId] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [resumeFiles, setResumeFiles] = useState({});
  const [filterCompany, setFilterCompany] = useState("");
  const [filterTitle, setFilterTitle] = useState("");
  const [filterPostedByMe, setFilterPostedByMe] = useState(false);
  const [filterAvailableOnly, setFilterAvailableOnly] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
    fetchAppliedJobs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [jobs, filterCompany, filterTitle, filterPostedByMe, filterAvailableOnly]);

  const fetchJobs = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/jobs");
      setJobs(res.data.jobs);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  const fetchAppliedJobs = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/applications/mine", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const appliedIds = res.data.applications.map((app) => app.jobId);
      setAppliedJobs(appliedIds);
    } catch (err) {
      console.error("Error fetching applied jobs:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingJobId
        ? `http://localhost:8000/api/v1/jobs/${editingJobId}`
        : `http://localhost:8000/api/v1/jobs`;
      const method = editingJobId ? "put" : "post";

      await axios[method](url, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await fetchJobs();
      setForm({ title: "", company: "", location: "", description: "" });
      setEditingJobId(null);
      setShowForm(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save job");
    }
  };

  const handleEdit = (job) => {
    setForm(job);
    setEditingJobId(job._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchJobs();
    } catch (err) {
      console.error("Error deleting job:", err);
    }
  };

  const handleApply = async (jobId) => {
    try {
      const resumeFile = resumeFiles[jobId];
      if (!resumeFile) return alert("Please upload your resume before applying.");

      const formData = new FormData();
      formData.append("jobId", jobId);
      formData.append("resume", resumeFile);

      await axios.post("http://localhost:8000/api/v1/applications", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setAppliedJobs((prev) => [...prev, jobId]);
      setResumeFiles((prev) => {
        const updated = { ...prev };
        delete updated[jobId];
        return updated;
      });

      alert("Applied successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Already applied or error occurred");
    }
  };

  const handleResumeChange = (jobId, file) => {
    setResumeFiles({ ...resumeFiles, [jobId]: file });
  };

  const handleRemoveResume = (jobId) => {
    const updated = { ...resumeFiles };
    delete updated[jobId];
    setResumeFiles(updated);
  };

  const goToApplicants = (jobId) => {
    navigate(`/jobs/${jobId}/applicants`);
  };

  const applyFilters = () => {
    let filtered = [...jobs];

    if (filterCompany) {
      filtered = filtered.filter((job) => job.company === filterCompany);
    }

    if (filterTitle) {
      filtered = filtered.filter((job) => job.title === filterTitle);
    }

    if (filterPostedByMe) {
      filtered = filtered.filter((job) => job.postedBy?._id === user?._id);
    }

    if (filterAvailableOnly) {
      filtered = filtered.filter(
        (job) => !appliedJobs.includes(job._id) && job.postedBy?._id !== user?._id
      );
    }

    setFilteredJobs(filtered);
  };

  const uniqueCompanies = [...new Set(jobs.map((job) => job.company))];
  const uniqueTitles = [...new Set(jobs.map((job) => job.title))];

  return (
    <div className="bg-gradient-to-br from-blue-100 via-blue-100 to-blue-100 min-h-screen p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-800">🎯 Job Opportunities</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setForm({ title: "", company: "", location: "", description: "" });
            setEditingJobId(null);
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition"
        >
          {showForm ? "Cancel" : "Post a Job"}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-4 items-center">
          <select
            value={filterCompany}
            onChange={(e) => setFilterCompany(e.target.value)}
            className="px-4 py-2 border rounded bg-white"
          >
            <option value="">Filter by Company</option>
            {uniqueCompanies.map((company, idx) => (
              <option key={idx} value={company}>
                {company}
              </option>
            ))}
          </select>

          <select
            value={filterTitle}
            onChange={(e) => setFilterTitle(e.target.value)}
            className="px-4 py-2 border rounded bg-white"
          >
            <option value="">Filter by Position</option>
            {uniqueTitles.map((title, idx) => (
              <option key={idx} value={title}>
                {title}
              </option>
            ))}
          </select>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={filterPostedByMe}
              onChange={() => setFilterPostedByMe(!filterPostedByMe)}
            />
            Posted by Me
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={filterAvailableOnly}
              onChange={() => setFilterAvailableOnly(!filterAvailableOnly)}
            />
            Available to Apply
          </label>
        </div>

        {(filterCompany || filterTitle || filterPostedByMe || filterAvailableOnly) && (
          <button
            onClick={() => {
              setFilterCompany("");
              setFilterTitle("");
              setFilterPostedByMe(false);
              setFilterAvailableOnly(false);
            }}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded transition"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Job Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md p-6 mb-8 space-y-4"
        >
          <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="Job Title" className="w-full p-3 border rounded" required />
          <input type="text" name="company" value={form.company} onChange={handleChange} placeholder="Company Name" className="w-full p-3 border rounded" required />
          <input type="text" name="location" value={form.location} onChange={handleChange} placeholder="Location" className="w-full p-3 border rounded" required />
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Job Description" rows={4} className="w-full p-3 border rounded" required />
          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded transition-transform hover:scale-105">
            {editingJobId ? "Update Job" : "Post Job"}
          </button>
        </form>
      )}

      {/* Job Listings */}
      {filteredJobs.map((job) => (
        <div key={job._id} className="bg-white rounded-lg shadow-md p-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center transition-transform hover:scale-[1.02] hover:shadow-lg hover:bg-blue-50">
          <div className="w-full md:w-3/4">
            <h2 className="text-xl font-semibold text-blue-700">{job.title}</h2>
            <p className="text-gray-600 mt-1">{job.company} — {job.location}</p>
            <p className="mt-3 text-gray-700">{job.description}</p>
            <p className="text-sm mt-2 text-gray-500">Posted by: {job.postedBy?.fullName}</p>
          </div>

          <div className="mt-4 md:mt-0 md:ml-6 flex flex-col gap-2 items-end">
            {job.postedBy?._id === user?._id ? (
              <>
                <button onClick={() => handleEdit(job)} className="text-blue-600 hover:text-blue-800">✏️ Edit</button>
                <button onClick={() => handleDelete(job._id)} className="text-red-600 hover:text-red-800">🗑️ Delete</button>
                <button onClick={() => goToApplicants(job._id)} className="text-green-600 hover:text-green-800">👥 View Applicants</button>
              </>
            ) : appliedJobs.includes(job._id) ? (
              <span className="text-green-600 font-semibold">✅ Applied</span>
            ) : (
              <div className="flex items-center gap-2">
                {!resumeFiles[job._id] ? (
                  <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-sm text-gray-700 px-3 py-1 rounded shadow">
                    Upload Resume
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleResumeChange(job._id, e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded shadow max-w-xs truncate">
                    <span className="text-sm text-gray-700 truncate">
                      {resumeFiles[job._id].name}
                    </span>
                    <button
                      onClick={() => handleRemoveResume(job._id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                      title="Remove file"
                    >
                      ❌
                    </button>
                  </div>
                )}

                <button
                  onClick={() => handleApply(job._id)}
                  disabled={!resumeFiles[job._id]}
                  className={`${
                    !resumeFiles[job._id]
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 hover:scale-105 text-white"
                  } text-sm px-4 py-1 rounded shadow transition-transform duration-200`}
                >
                  Apply
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobBoard;
