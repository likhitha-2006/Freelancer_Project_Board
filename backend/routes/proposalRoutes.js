const express = require('express');
const router = express.Router();
const {
  submitProposal,
  getProjectProposals,
  getUserProposals,
  updateProposalStatus,
  withdrawProposal
} = require('../controllers/proposalController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../config/multer');

router.post('/', protect, authorize('freelancer', 'admin'), upload.array('attachments', 3), submitProposal);
router.get('/my-proposals', protect, authorize('freelancer', 'admin'), getUserProposals);
router.get('/project/:id', protect, getProjectProposals);
router.put('/:id/status', protect, updateProposalStatus);
router.delete('/:id', protect, withdrawProposal);

module.exports = router;
