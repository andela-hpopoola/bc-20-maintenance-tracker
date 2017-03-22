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


/*
 *  Middlewares
 *  Make the public folder accessible for everyone
 */
app.use(express.static('public'));

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
  res.render('login.hbs');
});

// Sign In
app.post('/login', (req, res) => {

  // Get the email and password
   var user = {
      email: req.body.email,
      password: req.body.password,
   };
   console.log(user);

   // Find the admin and save in admin variable
   Admin.findOne(user).then((admin) => {

      // No admin found
      if(!admin){
        return res.send('Not logged in!');
      } 

      // TODO: Add sessions here
      // 
      return res.render('dashboard.hbs');

    }, (e) => {
      res.status(400).send(e);
    });
});


/*
 *  SIGN UP - GET METHOD
 *
 * @redirect to signup.hbs
 */
app.get('/signup', (req, res, next) => {
  return res.render('signup.hbs');
});


/*
 *  ADMIN REGISTRATION
 *  POST METHOD
 *
 * @success redirect to dashboard
 */
app.post('/signup', (req, res, next) => {

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



// Show Request Page
app.get('/requests', (req, res) => {
  res.render('requests/index.hbs');
});

app.get('/requests/add', (req, res) => {
  res.render('addRequests.hbs');
});


app.post('/requests', (req, res) => {
  // res.send(req.body.request);
  var requests = new Requests({
    request: req.body.request
  });

  requests.save().then((doc) => {
    // render the page
    res.render('dashboard.hbs');
  }, (e) => {
    res.status(400).send(e);
  });

});




app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = {app};
