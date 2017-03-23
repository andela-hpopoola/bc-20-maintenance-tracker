const mongoose = require('mongoose');
const validator = require('validator');

var Admin = mongoose.model('Admin', {

  first_name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  },

  last_name:{
    type: String,
    required: true,
    trim: true,
    minlength: 3
  },

  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    unique: true,
    validate:{
    	validator: validator.isEmail,
    	message: '{VALUE} is not a valid email'
    }
  },

  password:{
  	type: String,
  	require: true,
  	minlength: 6
  },

  level:{
  	type:Number,
  	default: 0
  },

  phone:{
    type: String,
    require: true,
    minlength: 6
  }

});

module.exports = {Admin}
