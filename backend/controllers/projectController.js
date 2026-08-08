const Project = require('../models/Project');
const Proposal = require('../models/Proposal');

// @desc    Create a project
// @route   POST /api/projects
// @access  Private (Client / Admin)
const createProject = async (req, res) => {
  try {
    const { title, description, category, requiredSkills, budget, budgetType, deadline } = req.body;

    if (!title || !description || !category || !budget || !deadline) {
      return res.status(400).json({ message: 'Please provide all required project fields' });
    }

    const parsedSkills = Array.isArray(requiredSkills)
      ? requiredSkills
      : typeof requiredSkills === 'string'
      ? requiredSkills.split(',').map((s) => s.trim())
      : [];

    const attachments = req.files
      ? req.files.map((file) => ({
          filename: file.originalname,
          path: `/uploads/${file.filename}`
        }))
      : [];

    const project = await Project.create({
      title,
      description,
      category,
      requiredSkills: parsedSkills,
      budget: Number(budget),
      budgetType: budgetType || 'fixed',
      deadline: new Date(deadline),
      clientId: req.user._id,
      attachments
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all projects with filtering
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res) => {
  try {
    const { category, skill, search, minBudget, maxBudget, status, clientId, freelancerId } = req.query;

    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (clientId) {
      query.clientId = clientId;
    }

    if (freelancerId) {
      query.hiredFreelancerId = freelancerId;
    }

    if (skill) {
      query.requiredSkills = { $in: [new RegExp(skill, 'i')] };
    }

    if (minBudget || maxBudget) {
      query.budget = {};
      if (minBudget) query.budget.$gte = Number(minBudget);
      if (maxBudget) query.budget.$lte = Number(maxBudget);
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    const projects = await Project.find(query)
      .populate('clientId', 'name email profileImage companyName rating')
      .populate('hiredFreelancerId', 'name email profileImage skills rating')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Public
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('clientId', 'name email profileImage companyName rating bio createdDate')
      .populate('hiredFreelancerId', 'name email profileImage skills title hourlyRate rating');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const proposalCount = await Proposal.countDocuments({ projectId: project._id });

    res.json({
      ...project.toObject(),
      proposalCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Owner / Admin)
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check ownership
    if (project.clientId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }

    const { title, description, category, requiredSkills, budget, budgetType, deadline, status } = req.body;

    if (title) project.title = title;
    if (description) project.description = description;
    if (category) project.category = category;
    if (budget !== undefined) project.budget = Number(budget);
    if (budgetType) project.budgetType = budgetType;
    if (deadline) project.deadline = new Date(deadline);
    if (status) project.status = status;

    if (requiredSkills) {
      project.requiredSkills = Array.isArray(requiredSkills)
        ? requiredSkills
        : requiredSkills.split(',').map((s) => s.trim());
    }

    if (req.files && req.files.length > 0) {
      const newFiles = req.files.map((file) => ({
        filename: file.originalname,
        path: `/uploads/${file.filename}`
      }));
      project.attachments = [...project.attachments, ...newFiles];
    }

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Owner / Admin)
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.clientId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }

    await Project.deleteOne({ _id: project._id });
    await Proposal.deleteMany({ projectId: project._id });

    res.json({ message: 'Project removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject
};
