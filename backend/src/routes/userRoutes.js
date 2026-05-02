const express = require('express');
const { getProfile, updateProfile, getAllUsers, getUserById } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put(
  '/profile',
  protect,
  upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'resume', maxCount: 1 },
  ]),
  updateProfile
);
router.get('/all', protect, roleCheck('admin'), getAllUsers);
router.get('/:id', protect, roleCheck('admin'), getUserById);

module.exports = router;
