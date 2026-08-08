const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false
    },
    role: {
      type: String,
      enum: ['freelancer', 'client', 'admin'],
      default: 'freelancer'
    },
    profileImage: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      default: ''
    },
    skills: {
      type: [String],
      default: []
    },
    experience: {
      type: String,
      default: ''
    },
    hourlyRate: {
      type: Number,
      default: 0
    },
    companyName: {
      type: String,
      default: ''
    },
    verificationStatus: {
      type: String,
      enum: ['unverified', 'pending', 'verified', 'rejected'],
      default: 'unverified'
    },
    verificationDocument: {
      type: String,
      default: ''
    },
    verificationNotes: {
      type: String,
      default: ''
    },
    rating: {
      type: Number,
      default: 0
    },
    reviewsCount: {
      type: Number,
      default: 0
    },
    earnings: {
      type: Number,
      default: 0
    },
    spent: {
      type: Number,
      default: 0
    },
    escrowBalance: {
      type: Number,
      default: 0
    },
    savedProjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
      }
    ]
  },
  {
    timestamps: true
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
