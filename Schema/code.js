const mongoose = require("mongoose");

// Define a code schema and model

const codeSchema = new mongoose.Schema({
    code: String,
    user: String,
  });
  
module.exports = mongoose.model('Code', codeSchema);

