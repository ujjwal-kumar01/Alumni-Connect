import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Make sure your User model name matches this
    required: true
  }
}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);

export default Job;
