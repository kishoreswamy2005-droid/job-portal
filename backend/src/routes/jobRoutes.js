const express = require('express');
const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getRecommendedJobs,
} = require('../controllers/jobController');
const { protect } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

router.get('/recommended', protect, getRecommendedJobs);
router.get('/', getJobs);
router.get('/:id', getJobById);
router.post('/', protect, roleCheck('admin'), createJob);
router.put('/:id', protect, roleCheck('admin'), updateJob);
router.delete('/:id', protect, roleCheck('admin'), deleteJob);

module.exports = router;
