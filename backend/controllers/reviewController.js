const Review = require('../models/Review');
const User = require('../models/User');
const Project = require('../models/Project');

// @desc    Create review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
  try {
    const { reviewedUserId, projectId, rating, comment } = req.body;

    if (!reviewedUserId || !projectId || !rating || !comment) {
      return res.status(400).json({ message: 'Please provide all review details' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const existingReview = await Review.findOne({
      reviewerId: req.user._id,
      projectId
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already submitted a review for this project' });
    }

    const review = await Review.create({
      reviewerId: req.user._id,
      reviewedUserId,
      projectId,
      rating: Number(rating),
      comment
    });

    // Recalculate rating average for reviewed user
    const reviews = await Review.find({ reviewedUserId });
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = Number((totalRating / reviews.length).toFixed(1));

    await User.findByIdAndUpdate(reviewedUserId, {
      rating: avgRating,
      reviewsCount: reviews.length
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user reviews
// @route   GET /api/reviews/user/:id
// @access  Public
const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewedUserId: req.params.id })
      .populate('reviewerId', 'name profileImage companyName role')
      .populate('projectId', 'title')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createReview, getUserReviews };
