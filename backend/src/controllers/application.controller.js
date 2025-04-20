import Application from '../models/application.model.js';
import Job from '../models/job.model.js';
import { User } from '../models/user.model.js';

// Apply for a job
export const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const userId = req.user._id;

    console.log('Applying for job:', jobId, 'by user:', userId);

    // Prevent duplicate applications
    const existingApp = await Application.findOne({ userId, jobId });
    if (existingApp) {
      return res.status(400).json({ message: 'Already applied for this job' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Resume file is required' });
    }

    const resumeUrl = `/public/uploads/${req.file.filename}`;

    const application = await Application.create({
      jobId,
      userId,
      resumeUrl,
    });

    console.log('Application saved:', application);

    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (err) {
    console.error('Apply Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get logged-in user's applications
export const getMyApplications = async (req, res) => {
  try {
    const userId = req.user._id;
    const applications = await Application.find({ userId }).populate('jobId');
    res.status(200).json({ applications });
  } catch (err) {
    console.error('Get My Applications Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all applicants for a job (if posted by current user)
export const getApplicantsForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const currentUserId = req.user._id;

    console.log('Fetching applicants for job:', jobId, 'by user:', currentUserId);

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.postedBy.toString() !== currentUserId.toString()) {
      return res.status(403).json({ message: 'Not authorized to view applicants' });
    }

    const applications = await Application.find({ jobId })
      .populate('userId', 'fullName email avatar')
      .select('resumeUrl userId appliedAt');

    res.status(200).json({ applications });
  } catch (err) {
    console.error('Get Applicants Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Update resume for a specific application
export const updateApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const userId = req.user._id;

    console.log('Updating application:', applicationId, 'by user:', userId);

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Resume file is required for update' });
    }

    const resumeUrl = `/public/uploads/${req.file.filename}`;
    application.resumeUrl = resumeUrl;
    await application.save();

    res.status(200).json({ message: 'Application updated successfully', application });
  } catch (err) {
    console.error('Update Application Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
