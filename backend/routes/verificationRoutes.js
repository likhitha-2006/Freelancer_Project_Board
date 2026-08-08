const express = require('express');
const router = express.Router();
const {
  submitVerification,
  getMyVerificationStatus,
  getPendingVerifications,
  reviewVerification,
} = require('../controllers/verificationController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', protect, upload.single('document'), submitVerification);
router.get('/my-status', protect, getMyVerificationStatus);
router.get('/pending', protect, authorizeRoles('admin'), getPendingVerifications);
router.put('/:id/review', protect, authorizeRoles('admin'), reviewVerification);

module.exports = router;
