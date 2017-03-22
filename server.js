var express = require('express');
const hbs = require('hbs');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

// Load my models
var {mongoose} = require('./config/mongoose');
var {Admin} = require('./models/admin');
var {User} = require('./models/user');
var {Requests} = require('./models/requests');
var {Comments} = require('./models/comments');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))


/*
 *  Middlewares
 *  Make the public folder accessible for everyone
 */
app.use(express.static('public'));

// Handle Bars
app.set('view engine', 'hbs');

hbs.registerPartials(__dirname + '/views/partials');

// var nav = [{
//     Link: '/Books',
//     Text: 'Book'
//     }, {
//     Link: '/Authors',
//     Text: 'Author'
//     }];
    
// var adminRouter = require('./routes/adminRoutes')(nav);
// var requestsRouter = require('./routes/requestsRoutes')(nav);
// app.use('/admin', adminRouter);
// app.use('/requests', requestsRouter);




 // Register Different Helpers
 // hbs.registerPartials('getCurrentYear', () => {
 //  return new Date().getFullYear();
 // })


// Basic Routes
// app.get('/', function(req,res){
//  res.send('Hello World');
// });
// 

app.get('/', (req, res) => {
  res.render('dashboard.hbs');
});


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
