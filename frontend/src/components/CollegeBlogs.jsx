import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CollegeBlogs = () => {
  const [blogsAndPapers, setBlogsAndPapers] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);

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
    <div className="relative max-w-6xl mx-auto mt-12 px-6">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-12">College Blogs & Research Papers</h1>

      {/* Add Blog/Paper Button */}
      <div className="flex justify-end mb-8">
        <Link to="/add-blog-paper" className="text-white bg-green-600 hover:bg-green-700 px-6 py-2 rounded inline-block">
          Add New Blog/Paper
        </Link>
      </div>

      {/* Grid of blog/papers */}
      <div className="grid md:grid-cols-2 gap-8">
        {blogsAndPapers.map((item, index) => (
          <div key={index} className="p-6 border rounded-lg shadow hover:shadow-md transition relative bg-white">
            <h3 className="text-xl font-bold text-blue-600 mb-2">{item.title}</h3>
            <p className="text-sm text-gray-500 mb-2">By {item.author} | {item.date}</p>
            <p className="text-gray-700 mb-4">
              {item.description?.length > 100 ? item.description.slice(0, 100) + '...' : item.description}
            </p>

            {item.type === 'paper' ? (
              <a href={item.fileLink} download className="text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded inline-block">
                Download Paper
              </a>
            ) : (
              <button
                onClick={() => setSelectedBlog(item)}
                className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded inline-block"
              >
                Read More
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Popup for full blog */}
      {selectedBlog && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-600 bg-opacity-50 z-50 flex justify-center items-center px-4">
          <div className="bg-white max-w-3xl w-full max-h-[80vh] overflow-auto p-6 rounded-lg shadow-lg relative">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">{selectedBlog.title}</h2>
            <p className="text-sm text-gray-500 mb-2">By {selectedBlog.author} | {selectedBlog.date}</p>
            <p className="text-gray-700 mb-4">{selectedBlog.description}</p>
            <div className="text-gray-800 whitespace-pre-wrap mb-4">{selectedBlog.content}</div>

            <button
              onClick={() => setSelectedBlog(null)}
              className="absolute top-2 right-2 bg-red-400 hover:bg-red-300 text-white px-4 py-2 rounded"
            >
              Show Less
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollegeBlogs;
