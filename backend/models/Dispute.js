const mongoose = require('mongoose');

const disputeSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    raisedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    reason: {
      type: String,
      required: [true, 'Dispute reason is required']
    },
    details: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['open', 'under_review', 'resolved', 'dismissed'],
      default: 'open'
    },
    resolution: {
      refundClientPercentage: { type: Number, default: 0 },
      payFreelancerPercentage: { type: Number, default: 0 },
      adminNotes: { type: String, default: '' },
      resolvedAt: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Dispute', disputeSchema);
