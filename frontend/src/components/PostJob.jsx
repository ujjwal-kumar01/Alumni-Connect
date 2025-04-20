import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PostJob = () => {
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    description: ''
  });
  const [myJobs, setMyJobs] = useState([]);
  const [applications, setApplications] = useState({});
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/v1/jobs', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Job posted successfully!');
      setForm({ title: '', company: '', location: '', description: '' });
      fetchMyJobs();
    } catch (err) {
      console.error("Error posting job:", err);
      alert('Failed to post job.');
    }
  };

  const fetchMyJobs = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/v1/jobs', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const jobsPostedByMe = res.data.jobs.filter(job => job.postedBy._id === user._id);
      setMyJobs(jobsPostedByMe);

      // Fetch applicants for each job
      const appData = {};
      for (const job of jobsPostedByMe) {
        const res = await axios.get(`http://localhost:8000/api/v1/applications/job/${job._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        appData[job._id] = res.data.applications;
      }
      setApplications(appData);
    } catch (err) {
      console.error("Error fetching jobs or applications:", err);
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📢 Post a New Job</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mb-10">
        <input type="text" name="title" placeholder="Job Title" value={form.title} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="text" name="company" placeholder="Company Name" value={form.company} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="text" name="location" placeholder="Location" value={form.location} onChange={handleChange} className="w-full p-2 border rounded" required />
        <textarea name="description" placeholder="Job Description" value={form.description} onChange={handleChange} className="w-full p-2 border rounded" rows="4" required />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Post Job</button>
      </form>

      <h2 className="text-xl font-semibold mb-2">📄 Your Posted Jobs & Applicants</h2>
      {myJobs.map(job => (
        <div key={job._id} className="border p-4 mb-6 rounded shadow bg-white">
          <h3 className="text-lg font-bold">{job.title}</h3>
          <p>{job.company} — {job.location}</p>
          <p className="text-gray-600 mt-2">{job.description}</p>

          <div className="mt-4">
            <h4 className="font-semibold">👥 Applicants:</h4>
            {applications[job._id]?.length > 0 ? (
              <ul className="list-disc pl-5">
                {applications[job._id].map((applicant, index) => (
                  <li key={index} className="mt-1">
                    {applicant.applicant.fullName} — 
                    <a href={applicant.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">View Resume</a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No applicants yet.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostJob;
