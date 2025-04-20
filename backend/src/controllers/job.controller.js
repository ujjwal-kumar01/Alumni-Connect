import Job from '../models/job.model.js';

// ✅ POST /jobs - Create a new job post
export const postJob = async (req, res) => {
  try {
    const { title, company, location, description } = req.body;
    const postedBy = req.user._id;

    const job = await Job.create({
      title,
      company,
      location,
      description,
      postedBy,
    });

    res.status(201).json({
      success: true,
      message: 'Job posted successfully',
      job,
    });
  } catch (err) {
    console.error('Error posting job:', err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// ✅ GET /jobs - Fetch all job posts
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('postedBy', 'fullName email');
    res.status(200).json({ success: true, jobs });
  } catch (err) {
    console.error('Error fetching jobs:', err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// ✅ PUT /jobs/:id - Update a job post
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this job' });
    }

    Object.assign(job, req.body);
    await job.save();

    res.json({ success: true, message: 'Job updated successfully', job });
  } catch (err) {
    console.error('Error updating job:', err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// ✅ DELETE /jobs/:id - Delete a job post
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this job' });
    }

    await job.deleteOne();

    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (err) {
    console.error('Error deleting job:', err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
