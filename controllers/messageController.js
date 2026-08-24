const Message = require('../models/Message');
const asyncHandler = require('../utils/asyncHandler');

exports.getEventMessages = asyncHandler(async (req, res, next) => {
  const { eventId } = req.params;
  const messages = await Message.find({ event: eventId })
    .populate('sender', 'name email')
    .sort({ createdAt: 1 });
  res.status(200).json(messages);
});