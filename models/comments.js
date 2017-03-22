const mongoose = require('mongoose');

var Comments = mongoose.model('Comments', {

  request_id: {
  	type: Number,
  	default: 0
  },

  admin_id: {
  	type: Number,
  	default: 0
  },

  picture: {
  	type: String,
  	require: true
  },

  comment: {
  	type: String,
  	default: 'No'
  }

});

module.exports = {Comments}
