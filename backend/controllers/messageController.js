const Message = require('../models/Message');

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { receiverId, projectId, message } = req.body;

    if (!receiverId || (!message && !req.file)) {
      return res.status(400).json({ message: 'Receiver and message content or attachment required' });
    }

    let attachment = null;
    if (req.file) {
      attachment = {
        filename: req.file.originalname,
        path: `/uploads/${req.file.filename}`
      };
    }

    const newMessage = await Message.create({
      senderId: req.user._id,
      receiverId,
      projectId: projectId || null,
      message: message || '',
      attachment
    });

    const populatedMessage = await Message.findById(newMessage._id)
      .populate('senderId', 'name profileImage email role')
      .populate('receiverId', 'name profileImage email role');

    // Socket.io emit if global io available
    if (req.io) {
      req.io.to(receiverId.toString()).emit('receiveMessage', populatedMessage);
    }

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get messages between logged in user and another user
// @route   GET /api/messages/:userId
// @access  Private
const getMessages = async (req, res) => {
  try {
    const otherUserId = req.params.userId;
    const { projectId } = req.query;

    const query = {
      $or: [
        { senderId: req.user._id, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: req.user._id }
      ]
    };

    if (projectId) {
      query.projectId = projectId;
    }

    const messages = await Message.find(query)
      .populate('senderId', 'name profileImage email role')
      .populate('receiverId', 'name profileImage email role')
      .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      { senderId: otherUserId, receiverId: req.user._id, read: false },
      { read: true }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all active chat conversations for user
// @route   GET /api/messages/conversations/list
// @access  Private
const getConversations = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ senderId: req.user._id }, { receiverId: req.user._id }]
    })
      .populate('senderId', 'name profileImage email role')
      .populate('receiverId', 'name profileImage email role')
      .populate('projectId', 'title')
      .sort({ createdAt: -1 });

    const conversationMap = new Map();

    messages.forEach((msg) => {
      const otherUser =
        msg.senderId._id.toString() === req.user._id.toString()
          ? msg.receiverId
          : msg.senderId;

      const partnerId = otherUser._id.toString();

      if (!conversationMap.has(partnerId)) {
        conversationMap.set(partnerId, {
          user: otherUser,
          lastMessage: msg,
          unreadCount:
            msg.receiverId._id.toString() === req.user._id.toString() && !msg.read ? 1 : 0
        });
      }
    });

    const conversations = Array.from(conversationMap.values());
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  getConversations
};
