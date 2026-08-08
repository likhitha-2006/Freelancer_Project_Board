const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Project description is required']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Web Development',
        'Mobile Development',
        'UI/UX Design',
        'Data Science & AI',
        'Writing & Translation',
        'Digital Marketing',
        'Graphics & Design',
        'Other'
      ]
    },
    requiredSkills: {
      type: [String],
      required: true
    },
    budget: {
      type: Number,
      required: [true, 'Budget amount is required']
    },
    budgetType: {
      type: String,
      enum: ['fixed', 'hourly'],
      default: 'fixed'
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline date is required']
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    hiredFreelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'completed', 'disputed', 'cancelled'],
      default: 'open'
    },
    attachments: [
      {
        filename: String,
        path: String,
        uploadedAt: { type: Date, default: Date.now }
      }
    ],
    escrowTotal: {
      type: Number,
      default: 0
    },
    completedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Project', projectSchema);
