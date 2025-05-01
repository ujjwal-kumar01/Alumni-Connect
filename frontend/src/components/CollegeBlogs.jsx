import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CollegeBlogs = () => {
  const [blogsAndPapers, setBlogsAndPapers] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchBlogsAndPapers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/blogs/get');
        setBlogsAndPapers(response.data);
      } catch (err) {
        console.error('Error fetching blogs and papers:', err);
      }
    };

    fetchBlogsAndPapers();
  }, []);

  return (
    <div className="relative max-w-7xl mx-auto mt-16 px-6">
      <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-4 drop-shadow-sm">
        College Blogs & Research Papers
      </h1>

      <div className="flex justify-end mb-10">
        <Link
          to="/add-blog-paper"
          className="bg-blue-500 hover:bg-coral-600 text-white px-6 py-2 rounded-lg font-medium shadow transition"
        >
          + Add New Blog/Paper
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogsAndPapers.map((item, index) => (
          <div
            key={index}
            className="flex flex-col justify-between h-full p-6 border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-all bg-gradient-to-tr from-mint-100 to-blue-50"
          >
            <div>
              <h3 className="text-2xl font-semibold text-blue-800 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 mb-1">
                By <span className="font-medium">{item.author}</span> |{' '}
                {new Date(item.date).toLocaleDateString()}
              </p>
              <p className="text-gray-700 mb-4 text-sm">
                {item.description?.length > 120
                  ? item.description.slice(0, 120) + '...'
                  : item.description}
              </p>
            </div>

            <div className="mt-auto flex justify-between items-end pt-4">
              {item.type === 'paper' ? (
                <a
                  href={item.fileLink}
                  download
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium shadow"
                >
                  Download Paper
                </a>
              ) : (
                <button
                  onClick={() => setSelectedBlog(item)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow"
                >
                  Read More
                </button>
              )}

              {currentUser && currentUser._id === item.authorId && (
                <Link
                  to={`/edit-blog-paper/${item._id}`}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium shadow"
                >
                  Edit
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Blog Preview */}
      {selectedBlog && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-60 z-50 flex justify-center items-center px-4">
          <div className="bg-white max-w-3xl w-full max-h-[85vh] overflow-y-auto p-8 rounded-2xl shadow-xl relative">
            <h2 className="text-3xl font-bold text-blue-700 mb-2">{selectedBlog.title}</h2>
            <p className="text-sm text-gray-600 mb-2">
              By {selectedBlog.author} | {new Date(selectedBlog.date).toLocaleDateString()}
            </p>
            <p className="text-gray-700 mb-4">{selectedBlog.description}</p>
            <div className="text-gray-800 whitespace-pre-wrap text-sm">{selectedBlog.content}</div>

            <button
              onClick={() => setSelectedBlog(null)}
              className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-full shadow"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollegeBlogs;
