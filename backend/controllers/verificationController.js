const Verification = require('../models/Verification');
const User = require('../models/User');

// @desc    Submit identity verification request
// @route   POST /api/verification
// @access  Private (Freelancer / Client)
const submitVerification = async (req, res) => {
  try {
    const { documentType, documentNumber } = req.body;

    if (!documentType || (!req.file && !req.body.documentUrl)) {
      return res.status(400).json({ message: 'Document type and document file are required.' });
    }

    const documentUrl = req.file ? `/uploads/${req.file.filename}` : req.body.documentUrl;

    const verification = await Verification.create({
      userId: req.user._id,
      documentType,
      documentNumber: documentNumber || '',
      documentUrl,
      status: 'pending',
    });

    // Update user status to pending
    await User.findByIdAndUpdate(req.user._id, { verificationStatus: 'pending' });

    res.status(201).json(verification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's current verification request status
// @route   GET /api/verification/my-status
// @access  Private
const getMyVerificationStatus = async (req, res) => {
  try {
    const verification = await Verification.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(verification || { status: req.user.verificationStatus });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all pending verifications (Admin)
// @route   GET /api/verification/pending
// @access  Private (Admin)
const getPendingVerifications = async (req, res) => {
  try {
    const verifications = await Verification.find({ status: 'pending' })
      .populate('userId', 'name email role profileImage createdAt')
      .sort({ createdAt: -1 });

    res.json(verifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Review verification request (Approve/Reject)
// @route   PUT /api/verification/:id/review
// @access  Private (Admin)
const reviewVerification = async (req, res) => {
  try {
    const { status, adminNotes } = req.body; // 'approved' or 'rejected'
    const verification = await Verification.findById(req.params.id);

    if (!verification) {
      return res.status(404).json({ message: 'Verification request not found.' });
    }

    verification.status = status;
    verification.adminNotes = adminNotes || '';
    await verification.save();

    // Update user status
    await User.findByIdAndUpdate(verification.userId, {
      verificationStatus: status === 'approved' ? 'verified' : 'rejected',
    });

    res.json(verification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitVerification,
  getMyVerificationStatus,
  getPendingVerifications,
  reviewVerification,
};
