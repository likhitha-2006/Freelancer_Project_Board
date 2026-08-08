const express = require('express');
const router = express.Router();
const { depositEscrow, releaseEscrow, getEscrowHistory } = require('../controllers/escrowController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.post('/deposit', protect, authorizeRoles('client'), depositEscrow);
router.post('/release', protect, releaseEscrow);
router.get('/history', protect, getEscrowHistory);

module.exports = router;
