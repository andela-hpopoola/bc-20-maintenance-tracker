const mongoose = require('mongoose');

var Requests = mongoose.model('Requests', {

  title: {
    type: String,
    required: true
  },

  user_name: {
    type: String,
    required: true
  },

  admin_name: {
    type: String,
    required: true
  },

  request_type: {
    type: Boolean,
    default: true
  },

  description: {
    type: String,
    required: true,
  },

  resolved: {
    type: Boolean,
    default: false,
  },

  approved: {
    type: Boolean,
    default: false,
  },

  read: {
    type: Boolean,
    default: false
  }

});

module.exports = {Requests}
