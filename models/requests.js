const mongoose = require('mongoose');

var Requests = mongoose.model('Requests', {

  user_id: {
  	type: Number,
  	default: 0
  },

  admin_id: {
  	type: Number,
  	default: 0
  },

  request: {
    type: String,
    required: true,
  },

  request_type: {
  	type: String,
  	default: 'maintenance'
  },

  resolved: {
  	type: String,
  	default: 'No'
  },

  approved: {
  	type: String,
  	default: 'No'
  },


});

module.exports = {Requests}
