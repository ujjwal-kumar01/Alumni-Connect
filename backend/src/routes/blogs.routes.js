import express from 'express';
import { addBlogOrPaper, getAllBlogs, getBlogById, editBlogOrPaper } from '../controllers/blogs.controller.js';

const router = express.Router();

// Route to add a new blog or paper
router.post('/add', addBlogOrPaper);

// Route to get all blogs or papers
router.get('/get', getAllBlogs);

// Route to fetch a blog by its ID (if you want to edit it or view it)
router.get('/:id', getBlogById); // Optional: Fetch a single blog/paper by ID

// Route to edit an existing blog or paper
router.put('/edit/:id', editBlogOrPaper);

export default router;
