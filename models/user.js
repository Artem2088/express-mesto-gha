const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    runValidators: true
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    runValidators: true
  },
  avatar: {
    type: String,
    required: true,
    runValidators: true
  },
});

module.exports = mongoose.model('user', userSchema);
