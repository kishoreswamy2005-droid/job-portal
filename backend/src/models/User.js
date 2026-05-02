const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  link: String,
});

const educationSchema = new mongoose.Schema({
  degree: String,
  institution: String,
  year: String,
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },
    phone: { type: String, default: '' },
    education: { type: educationSchema, default: {} },
    skills: { type: [String], default: [] },
    projects: { type: [projectSchema], default: [] },
    experienceLevel: {
      type: String,
      enum: ['Fresher', 'Experienced'],
      default: 'Fresher',
    },
    profileImage: { type: String, default: '' },
    resume: { type: String, default: '' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Virtual: profile completeness %
userSchema.virtual('profileCompleteness').get(function () {
  const fields = [
    this.name,
    this.email,
    this.phone,
    this.education?.degree,
    this.skills?.length > 0,
    this.projects?.length > 0,
    this.profileImage,
    this.resume,
    this.experienceLevel,
  ];
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
});

userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', userSchema);
