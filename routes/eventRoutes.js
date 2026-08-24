const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { createEvent, getEvents, getEventById, updateEvent, deleteEvent } = require('../controllers/eventController');
const { requireAuth, requireRole } = require('../middleware/auth');
const validate = require('../middleware/validate');

const eventValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be a positive integer'),
  body('category').isMongoId().withMessage('Valid category ID is required'),
  validate
];

router.get('/', getEvents);
router.get('/:id', getEventById);
router.post('/', requireAuth, requireRole('admin'), eventValidation, createEvent);
router.patch('/:id', requireAuth, requireRole('admin'), updateEvent);
router.put('/:id', requireAuth, requireRole('admin'), eventValidation, updateEvent);
router.delete('/:id', requireAuth, requireRole('admin'), deleteEvent);

module.exports = router;