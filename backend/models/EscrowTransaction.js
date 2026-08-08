const mongoose = require('mongoose');

const escrowTransactionSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    milestoneId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Milestone',
      default: null
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    amount: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      enum: ['deposit', 'release', 'refund', 'dispute_split'],
      required: true
    },
    status: {
      type: String,
      enum: ['completed', 'pending', 'failed'],
      default: 'completed'
    },
    description: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('EscrowTransaction', escrowTransactionSchema);
