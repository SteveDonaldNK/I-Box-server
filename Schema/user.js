const mongoose = require("mongoose");

// Define a user schema and model

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    phone: String,
    notifications: String,
    history: String,
  });
  
module.exports = mongoose.model('User', userSchema);

