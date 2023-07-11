const mongoose = require("mongoose");

// Define a user schema and model

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    phone: String,
    notifications: [String],
    history: [String],
    code: Number,
    subscriber: {
      type: Boolean,
      default: false,
    }
  });
  
module.exports = mongoose.model('User', userSchema);

