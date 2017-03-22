const mongoose = require('mongoose');

var Repairs = mongoose.model('Repairs', {

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

  resolved: {
  	type: String,
  	default: 'No'
  },

  approved: {
  	type: String,
  	default: 'No'
  },


});

module.exports = {Repairs}
