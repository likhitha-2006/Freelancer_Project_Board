const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('savedProjects');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.title = req.body.title !== undefined ? req.body.title : user.title;
      user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
      user.skills = req.body.skills || user.skills;
      user.experience = req.body.experience !== undefined ? req.body.experience : user.experience;
      user.hourlyRate = req.body.hourlyRate !== undefined ? req.body.hourlyRate : user.hourlyRate;
      user.companyName = req.body.companyName !== undefined ? req.body.companyName : user.companyName;

      if (req.file) {
        user.profileImage = `/uploads/${req.file.filename}`;
      }

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        title: updatedUser.title,
        bio: updatedUser.bio,
        skills: updatedUser.skills,
        experience: updatedUser.experience,
        hourlyRate: updatedUser.hourlyRate,
        companyName: updatedUser.companyName,
        profileImage: updatedUser.profileImage,
        verificationStatus: updatedUser.verificationStatus
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit identity verification
// @route   POST /api/users/verify-identity
// @access  Private
const submitVerification = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!req.file && !req.body.documentUrl) {
      return res.status(400).json({ message: 'Please upload an identity document' });
    }

    user.verificationStatus = 'pending';
    user.verificationDocument = req.file ? `/uploads/${req.file.filename}` : req.body.documentUrl;
    user.verificationNotes = req.body.notes || 'Identity document uploaded by user';

    await user.save();
    
    res.json({
      message: 'Verification document submitted successfully. Pending admin review.',
      verificationStatus: user.verificationStatus,
      verificationDocument: user.verificationDocument
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Save/Unsave job
// @route   POST /api/users/save-project/:id
// @access  Private
const toggleSaveProject = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const projectId = req.params.id;

    const index = user.savedProjects.indexOf(projectId);
    let saved = false;

    if (index > -1) {
      user.savedProjects.splice(index, 1);
      saved = false;
    } else {
      user.savedProjects.push(projectId);
      saved = true;
    }

    await user.save();
    res.json({ saved, savedProjects: user.savedProjects });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile by ID
// @route   GET /api/users/:id
// @access  Public
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  submitVerification,
  toggleSaveProject,
  getUserById
};
