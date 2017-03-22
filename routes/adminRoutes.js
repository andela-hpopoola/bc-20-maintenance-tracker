// Load my models
var {mongoose} = require('../config/mongoose');
var {Admin} = require('../models/admin');


module.exports = function(app) {

    /*
     *  SIGN IN PAGE - POST
     */
    app.post('/', (req, res) => {

      // Get the email and password
       var user = {
          email: req.body.email,
          password: req.body.password,
       };
       console.log(user);

       // Find the admin and save in admin variable
       Admin.findOne(user).then((admin) => {

          /*
           * The login details is incorrect
           * Show an error message
           */
          if(!admin){
            return res.render('login.hbs',{
              email : req.body.email,
              password : req.body.password,
              error : 'Invalid Username or Password'
            });
          } 

          // console.log(admin);

          // Add sessions here
          req.session.adminId = admin._id;
          req.session.level = admin.level;
          req.session.name = admin.first_name + ' ' + admin.last_name;

          // Redirect to the dashboard
          return res.render('dashboard.hbs',{
            name : req.session.name,
            level : req.session.level
          });

        }, (e) => {

          res.status(400).send(e);      
        });
    });


    /*
     *  LOG OUT PAGE
     */
    app.get('/logout', (req, res) => {

      // Destroy the session
      req.session.destroy((err) => {

        //redirect to the login page
        res.render('login.hbs', {
          message : 'You have succesfully logged out'
        });
      })

    });


    
    /*
     *  REGISTER A NEW ADMIN
     */
    app.get('/register', (req, res) => {
      return res.render('admin/register.hbs');
    });


    
    /*
     *  REGISTER A NEW ADMIN - POST
     */
    app.post('/register', (req, res) => {

        var admin = new Admin({
           first_name: req.body.first_name,
           last_name: req.body.last_name,
           email: req.body.email,
           password: req.body.password,
           level: req.body.level
       });

      admin.save().then((result) => {
          return res.send(result);
      }, (e) => {
        res.status(400).send(e);
      });

    });

};
