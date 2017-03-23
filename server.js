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
   *  Disable Authentication for the homepage
   *  and the user is not logged in
   *  
   */
  if ((req.url !== '/') && (req.url !== '/logout') && (!req.session.adminId)) {
    console.log('checkAuth ' + req.url);
    res.render('admin/login.hbs', { error : 'Kindly log in to access page' });
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

//Helper Class for counter
hbs.registerHelper("counter", index => index + 1);

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
    res.render('admin/dashboard.hbs',{
        name : req.session.name,
        level : req.session.level
      }); 
  } else {
      res.render('admin/login.hbs');
  }

});

/*
 *  Load Routers
 *  require('./src/config/passport')(app);
 */

// Load Admin Routes
require('./routes/adminRoutes')(app);
require('./routes/requestRoutes')(app);
require('./routes/userRoutes')(app);


app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = {app};
