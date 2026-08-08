const EscrowTransaction = require('../models/EscrowTransaction');
const Milestone = require('../models/Milestone');
const Project = require('../models/Project');
const User = require('../models/User');

// @desc    Fund milestone into Escrow (Client deposits funds)
// @route   POST /api/escrow/deposit
// @access  Private (Client)
const depositEscrow = async (req, res) => {
  try {
    const { milestoneId } = req.body;

    const milestone = await Milestone.findById(milestoneId);
    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found.' });
    }

    const project = await Project.findById(milestone.projectId);
    if (!project || project.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only client can fund escrow.' });
    }

    if (!project.assignedFreelancerId) {
      return res.status(400).json({ message: 'Cannot fund escrow without an assigned freelancer.' });
    }

    const client = await User.findById(req.user._id);
    if (client.walletBalance < milestone.amount) {
      return res.status(400).json({
        message: `Insufficient wallet balance. Balance: $${client.walletBalance}, Required: $${milestone.amount}. Please top up your wallet.`,
      });
    }

    // Deduct from client balance
    client.walletBalance -= milestone.amount;
    client.totalSpent += milestone.amount;
    await client.save();

    // Mark milestone as funded
    milestone.status = 'funded';
    await milestone.save();

    // Log transaction
    const transaction = await EscrowTransaction.create({
      projectId: project._id,
      milestoneId: milestone._id,
      clientId: client._id,
      freelancerId: project.assignedFreelancerId,
      amount: milestone.amount,
      type: 'deposit',
      status: 'held',
      notes: `Escrow deposit for milestone: "${milestone.title}"`,
    });

    res.json({ message: 'Funds deposited into escrow successfully.', transaction, milestone });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Release Escrow funds to Freelancer
// @route   POST /api/escrow/release
// @access  Private (Client or Admin)
const releaseEscrow = async (req, res) => {
  try {
    const { milestoneId } = req.body;

    const milestone = await Milestone.findById(milestoneId);
    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found.' });
    }

    const project = await Project.findById(milestone.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    if (project.clientId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to release funds.' });
    }

    const freelancer = await User.findById(project.assignedFreelancerId);
    if (!freelancer) {
      return res.status(404).json({ message: 'Assigned freelancer not found.' });
    }

    // Add funds to freelancer wallet balance
    freelancer.walletBalance += milestone.amount;
    freelancer.totalEarnings += milestone.amount;
    await freelancer.save();

    // Mark milestone as released
    milestone.status = 'released';
    await milestone.save();

    // Log transaction
    const transaction = await EscrowTransaction.create({
      projectId: project._id,
      milestoneId: milestone._id,
      clientId: project.clientId,
      freelancerId: freelancer._id,
      amount: milestone.amount,
      type: 'release',
      status: 'completed',
      notes: `Escrow released to freelancer for milestone: "${milestone.title}"`,
    });

    // Check if all milestones are released -> mark project as completed
    const allMilestones = await Milestone.find({ projectId: project._id });
    const unreleased = allMilestones.filter((m) => m.status !== 'released');
    if (unreleased.length === 0) {
      project.status = 'completed';
      await project.save();
    }

    res.json({ message: 'Funds released to freelancer balance.', transaction, milestone, projectStatus: project.status });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's escrow transaction history
// @route   GET /api/escrow/history
// @access  Private
const getEscrowHistory = async (req, res) => {
  try {
    const query =
      req.user.role === 'admin'
        ? {}
        : { $or: [{ clientId: req.user._id }, { freelancerId: req.user._id }] };

    const transactions = await EscrowTransaction.find(query)
      .populate('projectId', 'title')
      .populate('clientId', 'name email')
      .populate('freelancerId', 'name email')
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  depositEscrow,
  releaseEscrow,
  getEscrowHistory,
};
