const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    coverLetter: {
      type: String,
      required: [true, 'Cover letter is required']
    },
    bidAmount: {
      type: Number,
      required: [true, 'Bid amount is required']
    },
    estimatedDays: {
      type: Number,
      required: [true, 'Estimated delivery days is required']
    },
    attachments: [
      {
        filename: String,
        path: String
      }
    ],
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Proposal', proposalSchema);
