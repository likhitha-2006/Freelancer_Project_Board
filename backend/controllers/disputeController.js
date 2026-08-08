const Dispute = require('../models/Dispute');
const Project = require('../models/Project');

// @desc    Raise a dispute
// @route   POST /api/disputes
// @access  Private (Client / Freelancer)
const raiseDispute = async (req, res) => {
  try {
    const { projectId, reason, details } = req.body;

    if (!projectId || !reason) {
      return res.status(400).json({ message: 'Project and dispute reason are required' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Update project status to disputed
    project.status = 'disputed';
    await project.save();

    const dispute = await Dispute.create({
      projectId,
      raisedBy: req.user._id,
      reason,
      details: details || ''
    });

    res.status(201).json(dispute);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all disputes
// @route   GET /api/disputes
// @access  Private
const getDisputes = async (req, res) => {
  try {
    const query = {};
    if (req.user.role !== 'admin') {
      query.raisedBy = req.user._id;
    }

    const disputes = await Dispute.find(query)
      .populate('projectId', 'title budget status clientId hiredFreelancerId')
      .populate('raisedBy', 'name email role profileImage')
      .sort({ createdAt: -1 });

    res.json(disputes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { raiseDispute, getDisputes };
