const Event = require('../models/Event');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

exports.createEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.create({
    ...req.body,
    createdBy: req.user.userId
  });
  res.status(201).json(event);
});

exports.getEvents = asyncHandler(async (req, res, next) => {
  const { category, city, startDate, endDate, page = 1, limit = 10, sort, search } = req.query;

  let query = {};

  if (category) query.category = category;
  if (city) query.city = city;
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  let sortOption = {};
  if (sort === 'date') {
    sortOption.date = 1;
  }

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const total = await Event.countDocuments(query);
  const events = await Event.find(query)
    .populate('category', 'name description')
    .sort(sortOption)
    .skip(skip)
    .limit(limitNum);

  res.status(200).json({
    total,
    page: pageNum,
    limit: limitNum,
    data: events
  });
});

exports.getEventById = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id).populate('category', 'name description');
  if (!event) {
    return next(new AppError('Event not found', 404));
  }
  res.status(200).json(event);
});

exports.updateEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!event) {
    return next(new AppError('Event not found', 404));
  }
  res.status(200).json(event);
});

exports.deleteEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findByIdAndDelete(req.params.id);
  if (!event) {
    return next(new AppError('Event not found', 404));
  }
  res.status(200).json({ message: 'Event deleted successfully' });
});