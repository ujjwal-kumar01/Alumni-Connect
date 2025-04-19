import express from 'express';
import {
  applyForJob,
  getMyApplications,
  getApplicantsForJob,
  updateApplication, // ✅ newly added
} from '../controllers/application.controller.js';
import { protect } from '../middlewares/auth.middlewares.js';
import upload from '../middlewares/multer.middlewares.js'; // make sure you have this

const router = express.Router();

// Apply for a job
router.post('/', protect, upload.single('resume'), applyForJob);

// Get logged-in user's applications
router.get('/mine', protect, getMyApplications);

// Get all applicants for a specific job (posted by the current user)
router.get('/job/:jobId', protect, getApplicantsForJob);

// ✅ Update resume for a specific application (by user who applied)
router.put('/:applicationId', protect, upload.single('resume'), updateApplication);

export default router;
