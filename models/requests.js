const mongoose = require('mongoose');

var Requests = mongoose.model('Requests', {

  user_name: {
  	type: String,
    required: true
  },

  admin_name: {
  	type: String,
    required: true
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
