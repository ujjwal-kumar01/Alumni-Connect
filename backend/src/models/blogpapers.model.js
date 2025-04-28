import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: Date, default: Date.now },
  type: { type: String, enum: ['blog', 'paper'], required: true }, // blog or research paper
  fileLink: { type: String }, // For paper download links, optional for blogs
});

const BlogPaper = mongoose.model('BlogPaper', blogSchema);

export default BlogPaper;
