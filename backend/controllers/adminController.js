const User = require('../models/User');
const Project = require('../models/Project');
const Dispute = require('../models/Dispute');
const Proposal = require('../models/Proposal');
const EscrowTransaction = require('../models/EscrowTransaction');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const freelancersCount = await User.countDocuments({ role: 'freelancer' });
    const clientsCount = await User.countDocuments({ role: 'client' });
    const totalProjects = await Project.countDocuments();
    const activeProjects = await Project.countDocuments({ status: 'in_progress' });
    const openProjects = await Project.countDocuments({ status: 'open' });
    const completedProjects = await Project.countDocuments({ status: 'completed' });
    const pendingVerifications = await User.countDocuments({ verificationStatus: 'pending' });
    const openDisputes = await Dispute.countDocuments({ status: { $in: ['open', 'under_review'] } });

    // Sum total escrow locked
    const projects = await Project.find({ status: 'in_progress' });
    const totalEscrowLocked = projects.reduce((sum, p) => sum + (p.escrowTotal || 0), 0);

    res.json({
      totalUsers,
      freelancersCount,
      clientsCount,
      totalProjects,
      activeProjects,
      openProjects,
      completedProjects,
      pendingVerifications,
      openDisputes,
      totalEscrowLocked
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users for management
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify or reject user identity
// @route   PUT /api/admin/users/:id/verify
// @access  Private (Admin)
const verifyUserIdentity = async (req, res) => {
  try {
    const { status, notes } = req.body; // status: 'verified' or 'rejected'

    if (!['verified', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be verified or rejected' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.verificationStatus = status;
    if (notes) user.verificationNotes = notes;

    await user.save();
    res.json({ message: `User identity ${status}`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Resolve a dispute with refund/release percentages
// @route   PUT /api/admin/disputes/:id/resolve
// @access  Private (Admin)
const resolveDispute = async (req, res) => {
  try {
    const { refundClientPercentage, payFreelancerPercentage, adminNotes } = req.body;

    const dispute = await Dispute.findById(req.params.id);
    if (!dispute) {
      return res.status(404).json({ message: 'Dispute not found' });
    }

    const project = await Project.findById(dispute.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Associated project not found' });
    }

    const escrowAmount = project.escrowTotal || 0;
    const clientRefund = Math.round((escrowAmount * (refundClientPercentage || 0)) / 100);
    const freelancerPayment = Math.round((escrowAmount * (payFreelancerPercentage || 0)) / 100);

    // Update Project and User accounts
    if (clientRefund > 0) {
      const client = await User.findById(project.clientId);
      if (client) {
        client.escrowBalance = Math.max(0, (client.escrowBalance || 0) - clientRefund);
        await client.save();
      }
    }

    if (freelancerPayment > 0 && project.hiredFreelancerId) {
      const freelancer = await User.findById(project.hiredFreelancerId);
      if (freelancer) {
        freelancer.earnings = (freelancer.earnings || 0) + freelancerPayment;
        await freelancer.save();
      }
    }

    project.escrowTotal = 0;
    project.status = 'completed';
    await project.save();

    dispute.status = 'resolved';
    dispute.resolution = {
      refundClientPercentage,
      payFreelancerPercentage,
      adminNotes: adminNotes || 'Dispute resolved by Admin.',
      resolvedAt: new Date()
    };

    await dispute.save();

    // Record Escrow transaction
    await EscrowTransaction.create({
      projectId: project._id,
      senderId: req.user._id,
      amount: escrowAmount,
      type: 'dispute_split',
      status: 'completed',
      description: `Dispute resolved: ${refundClientPercentage}% refunded to client ($${clientRefund}), ${payFreelancerPercentage}% paid to freelancer ($${freelancerPayment})`
    });

    res.json({ message: 'Dispute resolved successfully', dispute });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  verifyUserIdentity,
  resolveDispute
};
