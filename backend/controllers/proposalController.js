const Proposal = require('../models/Proposal');
const Project = require('../models/Project');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// @desc    Submit proposal
// @route   POST /api/proposals
// @access  Private (Freelancer)
const submitProposal = async (req, res) => {
  try {
    const { projectId, coverLetter, bidAmount, estimatedDays } = req.body;

    if (!projectId || !coverLetter || !bidAmount || !estimatedDays) {
      return res.status(400).json({ message: 'Please provide all proposal details' });
    }

    const project = await Project.findById(projectId).populate('clientId');
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.status !== 'open') {
      return res.status(400).json({ message: 'Project is no longer accepting proposals' });
    }

    // Check if freelancer already submitted a proposal
    const existingProposal = await Proposal.findOne({
      projectId,
      freelancerId: req.user._id,
      status: { $ne: 'withdrawn' }
    });

    if (existingProposal) {
      return res.status(400).json({ message: 'You have already submitted an active proposal for this project' });
    }

    const attachments = req.files
      ? req.files.map((file) => ({
          filename: file.originalname,
          path: `/uploads/${file.filename}`
        }))
      : [];

    const proposal = await Proposal.create({
      projectId,
      freelancerId: req.user._id,
      coverLetter,
      bidAmount: Number(bidAmount),
      estimatedDays: Number(estimatedDays),
      attachments
    });

    // Notify client via email
    if (project.clientId && project.clientId.email) {
      await sendEmail({
        to: project.clientId.email,
        subject: `New Proposal Received: ${project.title}`,
        text: `Freelancer ${req.user.name} submitted a proposal of $${bidAmount} for your project "${project.title}".`
      });
    }

    res.status(201).json(proposal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get proposals for a project
// @route   GET /api/proposals/project/:id
// @access  Private (Client owner or Admin)
const getProjectProposals = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Ensure user is the client who posted the job or an admin
    if (project.clientId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view proposals for this project' });
    }

    const proposals = await Proposal.find({ projectId: req.params.id })
      .populate('freelancerId', 'name email profileImage title skills experience rating earnings verificationStatus')
      .sort({ createdAt: -1 });

    res.json(proposals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current freelancer proposals
// @route   GET /api/proposals/my-proposals
// @access  Private (Freelancer)
const getUserProposals = async (req, res) => {
  try {
    const proposals = await Proposal.find({ freelancerId: req.user._id })
      .populate({
        path: 'projectId',
        select: 'title category budget deadline status clientId',
        populate: { path: 'clientId', select: 'name companyName profileImage' }
      })
      .sort({ createdAt: -1 });

    res.json(proposals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update proposal status (Accept/Reject)
// @route   PUT /api/proposals/:id/status
// @access  Private (Client / Admin)
const updateProposalStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be either accepted or rejected' });
    }

    const proposal = await Proposal.findById(req.params.id).populate('freelancerId');
    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    const project = await Project.findById(proposal.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.clientId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update proposal status for this project' });
    }

    proposal.status = status;
    await proposal.save();

    if (status === 'accepted') {
      // Update Project status & set hired freelancer
      project.status = 'in_progress';
      project.hiredFreelancerId = proposal.freelancerId._id;
      await project.save();

      // Reject all other pending proposals for this project
      await Proposal.updateMany(
        { projectId: project._id, _id: { $ne: proposal._id }, status: 'pending' },
        { status: 'rejected' }
      );

      // Email notification
      if (proposal.freelancerId.email) {
        await sendEmail({
          to: proposal.freelancerId.email,
          subject: `Proposal Accepted! ${project.title}`,
          text: `Congratulations! Your proposal for "${project.title}" has been accepted. Log in to start working!`
        });
      }
    }

    res.json(proposal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Withdraw proposal
// @route   DELETE /api/proposals/:id
// @access  Private (Freelancer owner)
const withdrawProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);

    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    if (proposal.freelancerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to withdraw this proposal' });
    }

    if (proposal.status === 'accepted') {
      return res.status(400).json({ message: 'Cannot withdraw an accepted proposal' });
    }

    proposal.status = 'withdrawn';
    await proposal.save();

    res.json({ message: 'Proposal withdrawn successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitProposal,
  getProjectProposals,
  getUserProposals,
  updateProposalStatus,
  withdrawProposal
};
