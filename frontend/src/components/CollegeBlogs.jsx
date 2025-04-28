import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link for routing

const CollegeBlogs = () => {
  const [blogsAndPapers, setBlogsAndPapers] = useState([]);

  useEffect(() => {
    // Fetch blogs and papers from the backend
    const fetchBlogsAndPapers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/blogs/get');
        setBlogsAndPapers(response.data); // Update state with the fetched data
      } catch (err) {
        console.error('Error fetching blogs and papers:', err); // Error handling
      }
    };

    fetchBlogsAndPapers();
  }, []); // Empty dependency array to run only once on mount

  return (
    <div className="max-w-6xl mx-auto mt-12 px-6">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-12">College Blogs & Research Papers</h1>

      {/* Button to Add Blog/Paper */}
      <div className="flex justify-end mb-8">
        <Link to="/add-blog-paper" className="text-white bg-green-600 hover:bg-green-700 px-6 py-2 rounded inline-block">
          Add New Blog/Paper
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-8"> {/* Two-column layout for larger screens */}
        {/* Map through the blogsAndPapers state to display each item */}
        {blogsAndPapers.map((item, index) => (
          <div key={index} className="p-6 border rounded-lg shadow hover:shadow-md transition">
            {/* Display the title */}
            <h3 className="text-xl font-bold text-blue-600 mb-2">{item.title}</h3>

            {/* Display the author and date */}
            <p className="text-sm text-gray-500 mb-2">By {item.author} | {item.date}</p>

            {/* Display the description */}
            <p className="text-gray-700 mb-4">{item.description}</p>

            {/* Conditionally render the Download Paper or Read More button */}
            {item.type === 'paper' && (
              <a href={item.fileLink} download className="text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded inline-block">
                Download Paper
              </a>
            )}
            {item.type === 'blog' && (
              <Link to={`/blogs/${item.title.replace(/\s+/g, '-').toLowerCase()}`} className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded inline-block">
                Read More
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollegeBlogs;
