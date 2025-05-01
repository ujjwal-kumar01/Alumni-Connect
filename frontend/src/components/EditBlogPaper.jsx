import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditBlogPaper = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [type, setType] = useState('blog');
  const [fileLink, setFileLink] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogPaper = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/v1/blogs/${id}`);
        const blogPaperData = response.data;
        setTitle(blogPaperData.title);
        setDescription(blogPaperData.description);
        setContent(blogPaperData.content);
        setAuthor(blogPaperData.author);
        setType(blogPaperData.type);
        setFileLink(blogPaperData.fileLink || '');
      } catch (error) {
        console.error('Error fetching blog/paper data', error);
      }
    };

    fetchBlogPaper();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user?._id;

      if (!userId) {
        alert('User not logged in');
        return;
      }

      const response = await axios.put(`http://localhost:8000/api/v1/blogs/edit/${id}`, {
        title,
        description,
        content,
        author,
        type,
        fileLink,
        userId, // ✅ Sending userId for authorization
      });

      alert(response.data.message);
      navigate('/collegeBlogs');
    } catch (err) {
      console.error('Error updating blog/paper:', err);
      alert('Failed to update blog or paper.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-8 bg-white rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-3xl font-semibold text-center text-blue-700 mb-8">Edit Blog or Research Paper</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col">
          <label htmlFor="title" className="font-medium text-gray-700">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter the title"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="description" className="font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter a short description"
            required
          ></textarea>
        </div>

        <div className="flex flex-col">
          <label htmlFor="content" className="font-medium text-gray-700">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter the main content"
            required
          ></textarea>
        </div>

        <div className="flex flex-col">
          <label htmlFor="author" className="font-medium text-gray-700">Author Name</label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter author name"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="type" className="font-medium text-gray-700">Type</label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="blog">Blog</option>
            <option value="paper">Research Paper</option>
          </select>
        </div>

        {type === 'paper' && (
          <div className="flex flex-col">
            <label htmlFor="fileLink" className="font-medium text-gray-700">Paper PDF Link (Optional)</label>
            <input
              type="url"
              id="fileLink"
              value={fileLink}
              onChange={(e) => setFileLink(e.target.value)}
              className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter the paper PDF link (optional)"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          {loading ? 'Updating...' : 'Update'}
        </button>
      </form>
    </div>
  );
};

export default EditBlogPaper;
