const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { MongoMemoryServer } = require('mongodb-memory-server');

const User = require('../models/User');
const Category = require('../models/Category');
const Event = require('../models/Event');

const seedData = async () => {
  try {
    const mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    
    await mongoose.connect(uri);

    let admin = await User.findOne({ email: 'admin@eventpulse.com' });
    if (!admin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      admin = await User.create({
        name: 'Admin User',
        email: 'admin@eventpulse.com',
        password: hashedPassword,
        role: 'admin'
      });
    }

    let category = await Category.findOne({ name: 'Technology' });
    if (!category) {
      category = await Category.create({
        name: 'Technology',
        description: 'Tech events and conferences'
      });
    }

    const existingEvent = await Event.findOne({ title: 'Tech Summit 2026' });
    if (!existingEvent) {
      await Event.create({
        title: 'Tech Summit 2026',
        description: 'Annual technology conference',
        date: new Date('2026-10-15'),
        city: 'Cairo',
        capacity: 100,
        category: category._id,
        createdBy: admin._id
      });
    }

    console.log('Seed completed successfully');
    await mongoose.disconnect();
    await mongoServer.stop();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();