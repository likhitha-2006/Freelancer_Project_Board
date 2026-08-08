const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    title: {
      type: String,
      required: [true, 'Milestone title is required'],
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    amount: {
      type: Number,
      required: [true, 'Milestone amount is required']
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required']
    },
    status: {
      type: String,
      enum: ['pending', 'funded', 'submitted', 'released'],
      default: 'pending'
    },
    submissionNotes: {
      type: String,
      default: ''
    },
    submissionFile: {
      type: String,
      default: ''
    },
    fundedAt: Date,
    releasedAt: Date
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Milestone', milestoneSchema);
