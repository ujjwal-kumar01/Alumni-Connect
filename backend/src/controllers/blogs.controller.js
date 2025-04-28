import BlogPaper from '../models/blogpapers.model.js'; // Assuming BlogPaper is the model for your blogs and papers

// Controller to fetch all blogs and research papers
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await BlogPaper.find(); // Fetch all blogs and papers from the database
    res.json(blogs); // Return the blogs as a JSON response
  } catch (err) {
    console.error('Error fetching blogs:', err);
    res.status(500).json({ message: 'Server error, please try again later.' }); // Send error response if something goes wrong
  }
};

// Controller to add a new blog or research paper
export const addBlogOrPaper = async (req, res) => {
  const { title, description, content, author, type, fileLink } = req.body; // Destructure the request body

  try {
    // Create a new BlogPaper instance with the provided data
    const newBlogOrPaper = new BlogPaper({
      title,
      description,
      content,
      author,
      type,
      fileLink,
      date: new Date().toISOString(), // Store the current date in ISO format
    });

    // Save the new blog or paper to the database
    await newBlogOrPaper.save();

    // Respond with a success message
    res.status(201).json({ message: 'Blog or research paper submitted successfully!' });
  } catch (err) {
    console.error('Error submitting the blog or paper:', err);
    res.status(500).json({ message: 'Error submitting the blog or paper, please try again.' }); // Send error response if something goes wrong
  }
};
