const mongoose = require('mongoose');

var Notify = mongoose.model('Notify', {

  request_id: {
  	type: String,
    required: true
  },

  admin_name: {
    type: String,
    required: true
  },

  type: {
    type: Boolean,
    default: false
  }

});

module.exports = {Notify}
