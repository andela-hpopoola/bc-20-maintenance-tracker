const mongoose = require('mongoose');

var Comments = mongoose.model('Comments', {

  request_id: {
  	type: String,
    required: true
  },

  admin_name: {
    type: String,
    required: true
  },

  title: {
    type: String,
    required: true
  },
  
  description: {
  	type: String,
  	required: true
  }

});

module.exports = {Comments}
