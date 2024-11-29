const mongoose = require('mongoose');

const phedSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone_no: {
    type: String,
    required: true,
    unique: true,
  },
  phed_id: {
    type: String,  // or use ObjectId based on your requirement
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
});

module.exports = mongoose.model('Phed', phedSchema);