const express = require('express');
const router = express.Router();
const { getEventMessages } = require('../controllers/messageController');
const { requireAuth } = require('../middleware/auth');

router.get('/:eventId', requireAuth, getEventMessages);

module.exports = router;