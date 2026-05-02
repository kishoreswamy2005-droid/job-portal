const User = require('../models/User');

// @route   GET /api/user/profile
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/user/profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, education, skills, projects, experienceLevel } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (experienceLevel) updateData.experienceLevel = experienceLevel;

    // Parse JSON strings from multipart form
    if (education) {
      updateData.education =
        typeof education === 'string' ? JSON.parse(education) : education;
    }
    if (skills) {
      updateData.skills =
        typeof skills === 'string' ? JSON.parse(skills) : skills;
    }
    if (projects) {
      updateData.projects =
        typeof projects === 'string' ? JSON.parse(projects) : projects;
    }

    // Handle file uploads
    if (req.files) {
      if (req.files.profileImage) {
        updateData.profileImage = `/uploads/profiles/${req.files.profileImage[0].filename}`;
      }
      if (req.files.resume) {
        updateData.resume = `/uploads/resumes/${req.files.resume[0].filename}`;
      }
    }

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/user/all (admin only)
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/user/:id (admin only)
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, getAllUsers, getUserById };
