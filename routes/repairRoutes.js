// Load my models
var {mongoose} = require('../config/mongoose');
var {Repairs} = require('../models/repairs');
var {User} = require('../models/user');


module.exports = function(app) {

   /*
   *  Repairs Page
   *  List all repairs in the database
   */
  app.get('/repairs', (req, res) => {
    Repairs.find().then((result) => {
      res.render('repairs/all.hbs',{
        results : result,
      });
    }, (e) => {
      res.status(400).send(e);
    });
  });



   /*
   *  New Repair Page
   *  Creates a new repair
   */
  app.get('/repairs/new', (req, res) => {
    // Get a list of all users
    User.find().then((users) => {
      return res.render('repairs/new.hbs', {
          adminName : req.session.name,
          users : users
      });
    }, (e) => {
      res.status(400).send(e);
    });
      
  });

  /*
   *  Process a new Repair Request
   *  POST METHOD
   */
  app.post('/repairs/new', (req, res) => {

      var repair = new Repairs({
         user_name: req.body.user_name,
         request: req.body.request,
         admin_name: req.body.admin_name
     });

    repair.save().then((result) => {
        return res.send(result);
    }, (e) => {
      // TODO: change to html page
      res.status(400).send(e);
    });

  });

};
