import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true }, // Author name (e.g., "Ujjwal Kumar")
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Author user ID
  date: { type: Date, default: Date.now },
  type: { type: String, enum: ['blog', 'paper'], required: true }, // blog or research paper
  fileLink: { type: String }, // Optional for blogs, required for papers
});

const BlogPaper = mongoose.model('BlogPaper', blogSchema);

export default BlogPaper;
