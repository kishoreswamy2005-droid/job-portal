const Job = require('../models/Job');
const User = require('../models/User');
const { recommendJobs } = require('../utils/recommendJobs');

// @route   POST /api/jobs (admin)
const createJob = async (req, res, next) => {
  try {
    const { title, description, skillsRequired, location, salary, jobType, experienceLevel } = req.body;

    const job = await Job.create({
      title,
      description,
      skillsRequired: typeof skillsRequired === 'string' ? JSON.parse(skillsRequired) : skillsRequired,
      location,
      salary,
      jobType,
      experienceLevel,
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, message: 'Job created successfully.', job });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/jobs (public with filters)
const getJobs = async (req, res, next) => {
  try {
    const { search, location, jobType, skills, experienceLevel, page = 1, limit = 12 } = req.query;

    const query = { isActive: true };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (location) query.location = { $regex: location, $options: 'i' };
    if (jobType) query.jobType = jobType;
    if (experienceLevel) query.experienceLevel = { $in: [experienceLevel, 'Any'] };
    if (skills) {
      const skillArr = skills.split(',').map((s) => s.trim());
      query.skillsRequired = { $in: skillArr.map((s) => new RegExp(s, 'i')) };
    }

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      jobs,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/jobs/recommended (authenticated user)
const getRecommendedJobs = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const allJobs = await Job.find({ isActive: true }).populate('createdBy', 'name email');
    const recommended = recommendJobs(user.skills, allJobs);
    res.json({ success: true, jobs: recommended.slice(0, 6) });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/jobs/:id (public)
const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate('createdBy', 'name email');
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }
    res.json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/jobs/:id (admin)
const updateJob = async (req, res, next) => {
  try {
    const { skillsRequired, ...rest } = req.body;
    const updateData = { ...rest };
    if (skillsRequired) {
      updateData.skillsRequired =
        typeof skillsRequired === 'string' ? JSON.parse(skillsRequired) : skillsRequired;
    }

    const job = await Job.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    res.json({ success: true, message: 'Job updated successfully.', job });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/jobs/:id (admin)
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }
    res.json({ success: true, message: 'Job deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createJob, getJobs, getJobById, updateJob, deleteJob, getRecommendedJobs };
