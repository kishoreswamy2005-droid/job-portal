const Application = require('../models/Application');
const Job = require('../models/Job');
const Notification = require('../models/Notification');

// @route   POST /api/apply/:jobId
const applyForJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { coverLetter } = req.body;

    const job = await Job.findById(jobId);
    if (!job || !job.isActive) {
      return res.status(404).json({ success: false, message: 'Job not found or no longer active.' });
    }

    // Check duplicate application
    const existing = await Application.findOne({ userId: req.user._id, jobId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already applied for this job.' });
    }

    const application = await Application.create({
      userId: req.user._id,
      jobId,
      coverLetter,
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      application,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/applications/user
const getUserApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ userId: req.user._id })
      .populate('jobId', 'title location jobType salary skillsRequired')
      .sort({ createdAt: -1 });

    res.json({ success: true, applications });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/applications/job/:jobId (admin)
const getJobApplicants = async (req, res, next) => {
  try {
    const applications = await Application.find({ jobId: req.params.jobId })
      .populate('userId', 'name email phone skills experienceLevel profileImage resume education projects')
      .sort({ createdAt: -1 });

    res.json({ success: true, applications });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/applications/:id/status (admin)
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['applied', 'under_review', 'accepted', 'rejected'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('jobId', 'title').populate('userId', 'name');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    // Send notification to user
    const statusMessages = {
      under_review: `Your application for "${application.jobId.title}" is now under review.`,
      accepted: `🎉 Congratulations! Your application for "${application.jobId.title}" has been accepted!`,
      rejected: `Your application for "${application.jobId.title}" was not shortlisted this time.`,
      applied: `Your application for "${application.jobId.title}" has been received.`,
    };

    await Notification.create({
      userId: application.userId._id,
      message: statusMessages[status],
      type: 'status_update',
      relatedJob: application.jobId._id,
    });

    res.json({ success: true, message: 'Status updated.', application });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/applications/:id/interview (admin)
const scheduleInterview = async (req, res, next) => {
  try {
    const { date, time, meetingLink, notes } = req.body;

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      {
        interviewDetails: { date, time, meetingLink, notes },
        status: 'under_review',
      },
      { new: true }
    ).populate('jobId', 'title').populate('userId', 'name');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    // Notify user about interview
    await Notification.create({
      userId: application.userId._id,
      message: `📅 Interview scheduled for "${application.jobId.title}" on ${date} at ${time}. Join: ${meetingLink}`,
      type: 'interview_scheduled',
      relatedJob: application.jobId._id,
    });

    res.json({ success: true, message: 'Interview scheduled.', application });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/applications/all (admin)
const getAllApplications = async (req, res, next) => {
  try {
    const applications = await Application.find()
      .populate('userId', 'name email')
      .populate('jobId', 'title location jobType')
      .sort({ createdAt: -1 });
    res.json({ success: true, applications });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyForJob,
  getUserApplications,
  getJobApplicants,
  updateApplicationStatus,
  scheduleInterview,
  getAllApplications,
};
