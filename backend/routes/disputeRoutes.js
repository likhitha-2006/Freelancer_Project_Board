const express = require('express');
const router = express.Router();
const { raiseDispute, getDisputes } = require('../controllers/disputeController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, raiseDispute);
router.get('/', protect, getDisputes);

module.exports = router;
