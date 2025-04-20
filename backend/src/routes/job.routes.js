import express from 'express';
import {
  postJob,
  getAllJobs,
  updateJob,
  deleteJob
} from '../controllers/job.controller.js';
import verifyToken from '../middlewares/verifyToken.middlewares.js';

const router = express.Router();

// GET all jobs
router.get('/', getAllJobs);

// POST a new job
router.post('/', verifyToken, postJob);

// ✅ UPDATE a job by ID
router.put('/:id', verifyToken, updateJob);

// ✅ DELETE a job by ID
router.delete('/:id', verifyToken, deleteJob);

export default router;
