import BlogPaper from '../models/blogpapers.model.js';

// Controller to fetch all blogs and research papers
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await BlogPaper.find();  // Fetching all blogs or research papers from DB
    res.json(blogs);
  } catch (err) {
    console.error('Error fetching blogs:', err);
    res.status(500).json({ message: 'Server error, please try again later.' });
  }
};

// Controller to fetch a specific blog or research paper by ID
export const getBlogById = async (req, res) => {
  const { id } = req.params;  // Get the ID from URL parameters
  console.log("hello2")
  try {
    const blog = await BlogPaper.findById(id);  // Fetch the blog by its ID

    if (!blog) {
      console.log("problem here")
      return res.status(404).json({ message: 'Blog or paper not found' });
    }

    res.json(blog);  // Send the blog details in the response
  } catch (err) {
    console.error('Error fetching the blog by ID:', err);
    res.status(500).json({ message: 'Error fetching the blog, please try again later.' });
  }
};

// Controller to add a new blog or research paper
export const addBlogOrPaper = async (req, res) => {
  const { title, description, content, author, authorId, type, fileLink } = req.body;

  // Validation checks for required fields
  if (!author || !authorId) {
    return res.status(400).json({ message: 'Author name and Author ID are required.' });
  }

  try {
    const newBlogOrPaper = new BlogPaper({
      title,
      description,
      content,
      author,
      authorId,
      type,
      fileLink,
      date: new Date().toISOString(),  // Save the current timestamp
    });

    // Save to the database
    await newBlogOrPaper.save();
    res.status(201).json({ message: 'Blog or research paper submitted successfully!' });
  } catch (err) {
    console.error('Error submitting the blog or paper:', err);
    res.status(500).json({ message: 'Error submitting the blog or paper, please try again.' });
  }
};

// Controller to edit an existing blog or research paper
export const editBlogOrPaper = async (req, res) => {
  // console.log(req.body)

  const { id } = req.params;  // Blog/Paper ID from URL params
  const { title, description, content, type, fileLink } = req.body;  // New data to update
  const userId = req.body.userId;  // Logged-in user's ID (sent from frontend)
  console.log(userId)

  try {
    // Find the blog/paper by ID
    const blog = await BlogPaper.findById(id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog or paper not found' });
    }

    // Check if the logged-in user is the author of the blog/paper
    if (blog.authorId.toString() !== userId) {
      console.log("hello25")
      return res.status(403).json({ message: 'Unauthorized: Only the author can edit this post.' });
    }

    // Update the blog/paper fields (ensure only allowed fields are updated)
    blog.title = title || blog.title;
    blog.description = description || blog.description;
    blog.content = content || blog.content;
    blog.type = type || blog.type;
    blog.fileLink = fileLink || blog.fileLink;
    blog.date = new Date().toISOString();  // Update the date to current timestamp

    // Save the updated blog/paper
    const updatedBlog = await blog.save();

    res.json({
      message: 'Blog or research paper updated successfully!',
      updatedBlog,
    });
  } catch (err) {
    console.error('Error updating the blog or paper:', err);
    res.status(500).json({ message: 'Error updating the blog or paper, please try again.' });
  }
};
