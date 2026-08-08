const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  submitVerification,
  toggleSaveProject,
  getUserById
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../config/multer');

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, upload.single('profileImage'), updateUserProfile);
router.post('/verify-identity', protect, upload.single('verificationDocument'), submitVerification);
router.post('/save-project/:id', protect, toggleSaveProject);
router.get('/:id', getUserById);

module.exports = router;
