const express = require('express');
const router = express.Router();
const { sendMessage, getMessages, getConversations } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../config/multer');

router.post('/', protect, upload.single('attachment'), sendMessage);
router.get('/conversations/list', protect, getConversations);
router.get('/:userId', protect, getMessages);

module.exports = router;
