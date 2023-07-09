const mongoose = require("mongoose");

// Define an agent schema and model

const agentSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    phone: String,
    matricule: String
  });
  
module.exports = mongoose.model('Agent', agentSchema);

