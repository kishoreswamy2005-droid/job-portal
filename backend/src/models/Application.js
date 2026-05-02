const mongoose = require('mongoose');

const interviewDetailsSchema = new mongoose.Schema({
  date: String,
  time: String,
  meetingLink: String,
  notes: String,
});

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    status: {
      type: String,
      enum: ['applied', 'under_review', 'accepted', 'rejected'],
      default: 'applied',
    },
    interviewDetails: { type: interviewDetailsSchema, default: null },
    coverLetter: { type: String, default: '' },
  },
  { timestamps: true }
);

// Prevent duplicate applications
applicationSchema.index({ userId: 1, jobId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
