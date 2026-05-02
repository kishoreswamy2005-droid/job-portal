const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    skillsRequired: { type: [String], default: [] },
    location: { type: String, required: true },
    salary: { type: String, default: 'Not disclosed' },
    jobType: {
      type: String,
      enum: ['Job', 'Internship'],
      default: 'Job',
    },
    experienceLevel: {
      type: String,
      enum: ['Fresher', 'Experienced', 'Any'],
      default: 'Any',
    },
    isActive: { type: Boolean, default: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Full-text search index
jobSchema.index({ title: 'text', description: 'text', location: 'text' });

module.exports = mongoose.model('Job', jobSchema);
