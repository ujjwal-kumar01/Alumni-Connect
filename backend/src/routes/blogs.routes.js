import express from 'express';
import { addBlogOrPaper, getAllBlogs } from '../controllers/blogs.controller.js';

const router = express.Router();

router.post('/add', addBlogOrPaper);
router.get('/get', getAllBlogs); // New route to fetch a blog by title

export default router;
