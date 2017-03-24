// Load my models
var {mongoose} = require('../config/mongoose');
var {User} = require('../models/user');


module.exports = function(app) {

  /*
   *  Users
   *  @redirect to all requests.hbs
   */

  // Show Request Page
  app.get('/users', (req, res) => {
    User.find().then((result) => {
    res.render('users/all.hbs',{
      results : result,
    });
    }, (e) => {
      res.status(400).send(e);
    });
  });


  app.get('/users/new', (req, res) => {
    return res.render('users/new.hbs');
  });


  app.post('/users/new', (req, res) => {

      var user = new User({
         first_name: req.body.first_name,
         last_name: req.body.last_name,
         email: req.body.email,
         phone: req.body.phone,
     });

    user.save().then((result) => {
      return res.render('admin/dashboard.hbs',{
          name : req.session.name,
          level : req.session.level,
          message: `You have successfully registered user (${result.first_name} ${result.last_name})`
        });
    }, (e) => {
      // TODO: change to html page
      res.status(400).send(e);
    });

  });


};
