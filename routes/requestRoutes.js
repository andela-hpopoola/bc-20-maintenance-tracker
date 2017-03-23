// Load my models
var {mongoose} = require('../config/mongoose');
var {Requests} = require('../models/requests');
var {User} = require('../models/user');


module.exports = function(app) {

   /*
   *  Requests Page
   *  List all requests in the database
   */
  app.get('/requests', (req, res) => {
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    Requests.find().then((result) => {
      res.render('requests/all.hbs',{
        results : result,
        fullUrl : fullUrl
      });
    }, (e) => {
      res.status(400).send(e);
    });
  });



   /*
   *  New Request Page
   *  Creates a new request
   */
  app.get('/requests/new', (req, res) => {
    // Get a list of all users
    User.find().then((users) => {
      return res.render('requests/new.hbs', {
          adminName : req.session.name,
          level: req.session.level,
          users : users
      });
    }, (e) => {
      res.status(400).send(e);
    });
      
  });

  /*
   *  Process a new Request Request
   *  POST METHOD
   */
  app.post('/requests/new', (req, res) => {

      var request = new Requests({
         title: req.body.title,
         user_name: req.body.user_name,
         description: req.body.description,
         admin_name: req.body.admin_name,
         request_type: req.body.request_type,
         approved: req.body.approved || false
     });

    request.save().then((result) => {
        // Redirect to the requests page to show all
        Requests.find().then((result) => {

          var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

          res.render('requests/all.hbs',{
            results : result,
            message: "Great! The request has been successfully resolved",
            fullUrl: fullUrl
          });
        }, (e) => {
          res.status(400).send(e);
        });
                
    }, (e) => {
      // REQUEST: change to html page
      res.status(400).send(e);
    });

  });


  app.get('/approve-request/:id', (req, res) => {

    var id = req.params.id; 

    Requests.findById(id, (err, request) => {  

        // Handle any possible database errors
        if (err) {
            res.status(500).send(err);
        } else {
            // Update each attribute with any possible attribute that may have been submitted in the body of the request
            // If that attribute isn't in the request body, default back to whatever it was before.
            request.approved = true;

            // Save the updated document back to the database
            request.save(function (err, request) {
                if (err) {
                    res.status(500).send(err)
                }

                var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
                // Redirect to the requests page to show all
                Requests.find().then((result) => {
                  res.render('requests/all.hbs',{
                    results : result,
                    message: "The request has been successfully approved",
                    fullUrl: fullUrl
                  });
                }, (e) => {
                  res.status(400).send(e);
                });

            });
        }
    });

  });

  app.get('/resolve-request/:id', (req, res) => {

    var id = req.params.id; 

    Requests.findById(id, (err, request) => {  

        // Handle any possible database errors
        if (err) {
            res.status(500).send(err);
        } else {
            // Update each attribute with any possible attribute that may have been submitted in the body of the request
            // If that attribute isn't in the request body, default back to whatever it was before.
            request.resolved = true;

            // Save the updated document back to the database
            request.save(function (err, request) {
                if (err) {
                    res.status(500).send(err)
                }

                var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

                // Redirect to the requests page to show all
                Requests.find().then((result) => {
                  res.render('requests/all.hbs',{
                    results : result,
                    message: "Great! The request has been successfully resolved",
                    fullUrl: fullUrl
                  });
                }, (e) => {
                  res.status(400).send(e);
                });
                
            });
        }
    });

  });

};
