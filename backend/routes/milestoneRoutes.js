const express = require('express');
const router = express.Router();
const {
  createMilestone,
  getProjectMilestones,
  fundMilestone,
  submitMilestoneWork,
  releaseMilestone
} = require('../controllers/milestoneController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../config/multer');

router.post('/', protect, createMilestone);
router.get('/project/:id', protect, getProjectMilestones);
router.post('/:id/fund', protect, fundMilestone);
router.put('/:id/submit', protect, upload.single('submissionFile'), submitMilestoneWork);
router.post('/:id/release', protect, releaseMilestone);

module.exports = router;
