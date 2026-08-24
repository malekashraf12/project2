const Registration = require('../models/Registration');
const Event = require('../models/Event');

exports.registerForEvent = async (req, res, next) => {
  try {
    const { eventId } = req.body;
    const userId = req.user.userId;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const currentRegistrationsCount = await Registration.countDocuments({ event: eventId });
    if (currentRegistrationsCount >= event.capacity) {
      return res.status(400).json({ message: 'Event capacity reached' });
    }

    const existingRegistration = await Registration.findOne({ user: userId, event: eventId });
    if (existingRegistration) {
      return res.status(400).json({ message: 'User already registered for this event' });
    }

    const registration = await Registration.create({ user: userId, event: eventId });
    res.status(201).json(registration);
  } catch (error) {
    next(error);
  }
};

exports.getMyRegistrations = async (req, res, next) => {
  try {
    const registrations = await Registration.find({ user: req.user.userId }).populate({
      path: 'event',
      populate: { path: 'category' }
    });
    res.status(200).json(registrations);
  } catch (error) {
    next(error);
  }
};

exports.cancelRegistration = async (req, res, next) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    if (registration.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await registration.deleteOne();
    res.status(200).json({ message: 'Registration cancelled successfully' });
  } catch (error) {
    next(error);
  }
};