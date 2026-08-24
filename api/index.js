const app = require('../app');
const mongoose = require('mongoose');

module.exports = async (req, res) => {
  if (mongoose.connection.readyState !== 1 && process.env.MONGO_URI) {
    try {
      await mongoose.connect(process.env.MONGO_URI);
    } catch (err) {
      console.error('Atlas connection error:', err);
    }
  }
  return app(req, res);
};