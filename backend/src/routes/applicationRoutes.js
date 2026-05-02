const express = require('express');
const {
  applyForJob,
  getUserApplications,
  getJobApplicants,
  updateApplicationStatus,
  scheduleInterview,
  getAllApplications,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

router.post('/apply/:jobId', protect, roleCheck('user'), applyForJob);
router.get('/user', protect, getUserApplications);
router.get('/all', protect, roleCheck('admin'), getAllApplications);
router.get('/job/:jobId', protect, roleCheck('admin'), getJobApplicants);
router.put('/:id/status', protect, roleCheck('admin'), updateApplicationStatus);
router.post('/:id/interview', protect, roleCheck('admin'), scheduleInterview);

module.exports = router;
