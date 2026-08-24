const express = require('express');
const router = express.Router();
const { registerForEvent, getMyRegistrations, cancelRegistration } = require('../controllers/registrationController');
const { requireAuth } = require('../middleware/auth');

router.post('/', requireAuth, registerForEvent);
router.get('/my', requireAuth, getMyRegistrations);
router.delete('/:id', requireAuth, cancelRegistration);

module.exports = router;