var express = require('express');
var session = require('express-session')
const hbs = require('hbs');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

// Load my Database and Models
var {mongoose} = require('./config/mongoose');
var {Admin} = require('./models/admin');
var {User} = require('./models/user');
var {Requests} = require('./models/requests');
var {Comments} = require('./models/comments');

// Start Express
var app = express();
const port = process.env.PORT || 3000;

// Use Body Parse to encode request to json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))


// Use Sessions
app.use(session({ secret: 'andela', resave: false, saveUninitialized: true, cookie: { maxAge: 600000 }}))


/*
 *  Middlewares
 *  Make the public folder accessible for everyone
 */
app.use(express.static('public'));

// Authentication Middleware
app.get('*', function(req, res, next) {

  // console.log(req.session);

  /*
   *  Disable Authentication it is the homepage
   *  and the user is not logged in
   *  
   */
  if ((req.url !== '/') && (req.url !== '/logout') && (!req.session.adminId)) {
    console.log('checkAuth ' + req.url);
    res.render('login.hbs', { error : 'Kindly log in to access page' });
    return;
  }

  next();


});

/*
 * Handlebars is used as the view engine
 * the views are in the view folder
 */
app.set('view engine', 'hbs');

// register the partials used for hbs
hbs.registerPartials(__dirname + '/views/partials');

/*
 *  Home Page
 *  The Login Form is displayed as the default home page
 *  Redirects to Dashboard on Successful Login 
 */
app.get('/', (req, res) => {

  /*
   * if the user is previously logged in
   * Redirect the user into the database 
   */ 
  if (req.session.id && req.session.level){
    res.render('dashboard.hbs',{
        name : req.session.name,
        level : req.session.level
      }); 
  } else {
      res.render('login.hbs');
  }

});


// Sign In
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

      console.log(admin);
      // Add sessions here
      // req.session.name = admin.name;
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
 *  SIGN UP - GET METHOD
 *
 * @redirect to signup.hbs
 */
app.get('/signup', (req, res) => {
  return res.render('signup.hbs');
});


/*
 *  ADMIN REGISTRATION
 *  POST METHOD
 *
 * @success redirect to dashboard
 */
app.post('/signup', (req, res) => {

    var admin = new Admin({
       first_name: req.body.first_name,
       last_name: req.body.last_name,
       email: req.body.email,
       password: req.body.password,
       level: req.body.level
   });

  admin.save().then((result) => {
      // req.session.user = result.email;
      return res.send(result);
  }, (e) => {
    res.status(400).send(e);
  });

});


/*
 *  Request Page
 *
 * @redirect to all requests.hbs
 */
app.get('/requests', (req, res) => {

  return res.render('addRequests.hbs', {
    adminName : req.session.name
  });
});


/*
 *  ADMIN REGISTRATION
 *  POST METHOD
 *
 * @success redirect to dashboard
 */
app.post('/requests', (req, res) => {

    var request = new Requests({
       user_name: req.body.user_name,
       request: req.body.request,
       request_type: req.body.request_type,
       admin_name: req.body.admin_name
   });

  request.save().then((result) => {
      return res.send(result);
  }, (e) => {
    // TODO: change to html page
    res.status(400).send(e);
  });

});


// Show Request Page
app.get('/requests/all', (req, res) => {
  Requests.find().then((result) => {
  user_id = result.user
  res.render('allRequests.hbs',{
    results : result,
  });
  }, (e) => {
    res.status(400).send(e);
  });
});


app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = {app};