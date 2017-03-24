// Load my models
var {mongoose} = require('../config/mongoose');
var {Admin} = require('../models/admin');


module.exports = function(app) {

    /*
     *  SIGN IN PAGE - POST
     */
    app.post('/', (req, res) => {

      var email = req['body']['email'].toLowerCase();
      var password = req['body']['password'];

      // Get the email and password
       var user = { email, password};

       console.log(user);

       // Find the admin and save in admin variable
       Admin.findOne(user).then((admin) => {

          /*
           * The login details is incorrect
           * Show an error message
           */
          if(!admin){
            return res.render('admin/login.hbs',{
              email : email,
              password : password,
              error : 'Invalid Username or Password'
            });
          } 

          // console.log(admin);

          // Add sessions here
          req.session.adminId = admin._id;
          req.session.level = admin.level;
          req.session.name = admin.first_name + ' ' + admin.last_name;

          // Redirect to the dashboard
          return res.render('admin/dashboard.hbs',{
            name : req.session.name,
            level : req.session.level,
            id : req.session.adminId
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
        res.render('admin/login.hbs', {
          message : 'You have succesfully logged out'
        });
      })

    });


    
    /*
     *  REGISTER A NEW ADMIN
     */
    app.get('/register', (req, res) => {
      return res.render('admin/register.hbs',{level : req.session.level});
    });


    
    /*
     *  REGISTER A NEW ADMIN - POST
     */
    app.post('/register', (req, res) => {

      var email = req['body']['email'].toLowerCase();
      var password = req['body']['password'];

        var admin = new Admin({
           first_name: req.body.first_name,
           last_name: req.body.last_name,
           email: email,
           password: password,
           phone: req.body.phone,
           level: req.body.level
       });

      admin.save().then((result) => {
          return res.render('admin/dashboard.hbs',{
            name : req.session.name,
            level : req.session.level,
            message: `You have successfully registered ${result.first_name} ${result.last_name}`
          });
      }, (e) => {
        res.status(400).send(e);
      });

    });


    /*
     * Install Dummy Information
     */

    app.get('/install', (req, res) => {

        var admin = new Admin({
           first_name: 'Andela',
           last_name: 'Test',
           email: 'testing@andela.com',
           password: '123456',
           phone: '08022222222',
           level: true
       });

      admin.save().then((result) => {
          return res.render('admin/login.hbs',{
            message: `Default Account Created : (Email : testing@andela.com) and (Password : 123456)`
          });
      }, (e) => {
        res.status(400).send(e);
      });

    });
    

};
