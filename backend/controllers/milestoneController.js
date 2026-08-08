const Milestone = require('../models/Milestone');
const Project = require('../models/Project');
const User = require('../models/User');
const EscrowTransaction = require('../models/EscrowTransaction');

// @desc    Create project milestone
// @route   POST /api/milestones
// @access  Private (Client / Freelancer)
const createMilestone = async (req, res) => {
  try {
    const { projectId, title, description, amount, dueDate } = req.body;

    if (!projectId || !title || !amount || !dueDate) {
      return res.status(400).json({ message: 'Please provide all required milestone fields' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const milestone = await Milestone.create({
      projectId,
      title,
      description: description || '',
      amount: Number(amount),
      dueDate: new Date(dueDate),
      status: 'pending'
    });

    res.status(201).json(milestone);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get milestones for a project
// @route   GET /api/milestones/project/:id
// @access  Private
const getProjectMilestones = async (req, res) => {
  try {
    const milestones = await Milestone.find({ projectId: req.params.id }).sort({ dueDate: 1 });
    res.json(milestones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fund milestone (Mock Escrow deposit)
// @route   POST /api/milestones/:id/fund
// @access  Private (Client)
const fundMilestone = async (req, res) => {
  try {
    const milestone = await Milestone.findById(req.params.id);
    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }

    const project = await Project.findById(milestone.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.clientId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to fund this milestone' });
    }

    if (milestone.status !== 'pending') {
      return res.status(400).json({ message: `Milestone is already in '${milestone.status}' status` });
    }

    milestone.status = 'funded';
    milestone.fundedAt = new Date();
    await milestone.save();

    // Update project escrow total
    project.escrowTotal = (project.escrowTotal || 0) + milestone.amount;
    await project.save();

    // Update client total spent & escrow balance
    const client = await User.findById(req.user._id);
    client.escrowBalance = (client.escrowBalance || 0) + milestone.amount;
    client.spent = (client.spent || 0) + milestone.amount;
    await client.save();

    // Record Escrow transaction
    await EscrowTransaction.create({
      projectId: project._id,
      milestoneId: milestone._id,
      senderId: client._id,
      receiverId: project.hiredFreelancerId,
      amount: milestone.amount,
      type: 'deposit',
      status: 'completed',
      description: `Funded milestone "${milestone.title}" into Escrow`
    });

    res.json({ message: 'Milestone funded successfully in Mock Escrow', milestone, project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit milestone work
// @route   PUT /api/milestones/:id/submit
// @access  Private (Freelancer)
const submitMilestoneWork = async (req, res) => {
  try {
    const milestone = await Milestone.findById(req.params.id);
    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }

    milestone.status = 'submitted';
    milestone.submissionNotes = req.body.submissionNotes || 'Deliverables submitted for review.';

    if (req.file) {
      milestone.submissionFile = `/uploads/${req.file.filename}`;
    }

    await milestone.save();
    res.json(milestone);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Release milestone payment (Release Escrow to Freelancer)
// @route   POST /api/milestones/:id/release
// @access  Private (Client / Admin)
const releaseMilestone = async (req, res) => {
  try {
    const milestone = await Milestone.findById(req.params.id);
    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }

    const project = await Project.findById(milestone.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.clientId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to release milestone payment' });
    }

    if (!['funded', 'submitted'].includes(milestone.status)) {
      return res.status(400).json({ message: 'Milestone must be funded or submitted to release payment' });
    }

    milestone.status = 'released';
    milestone.releasedAt = new Date();
    await milestone.save();

    // Deduct from project escrow
    project.escrowTotal = Math.max(0, (project.escrowTotal || 0) - milestone.amount);

    // Check if all milestones released -> auto-complete project
    const allMilestones = await Milestone.find({ projectId: project._id });
    const allReleased = allMilestones.every((m) => m.status === 'released');
    if (allReleased) {
        project.status = 'completed';
        project.completedAt = new Date();
      }

    // Deduct from Client escrow balance
    const client = await User.findById(project.clientId);
    if (client) {
        client.escrowBalance = Math.max(0, (client.escrowBalance || 0) - milestone.amount);
        await client.save();
      }

      // Credit freelancer earnings
      const freelancer = await User.findById(project.hiredFreelancerId);
      if (freelancer) {
        freelancer.earnings = (freelancer.earnings || 0) + milestone.amount;
        await freelancer.save();
      }

    // Record Escrow transaction
    await EscrowTransaction.create({
      projectId: project._id,
      milestoneId: milestone._id,
      senderId: project.clientId,
      receiverId: project.hiredFreelancerId,
      amount: milestone.amount,
      type: 'release',
      status: 'completed',
      description: `Released $${milestone.amount} payment for milestone "${milestone.title}"`
    });

    res.json({ message: 'Milestone payment released successfully', milestone, project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createMilestone,
  getProjectMilestones,
  fundMilestone,
  submitMilestoneWork,
  releaseMilestone
};
