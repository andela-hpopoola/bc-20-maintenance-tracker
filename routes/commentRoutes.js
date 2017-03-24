var multer  =   require('multer');

// Load my models
var {mongoose} = require('../config/mongoose');
var {Comments} = require('../models/comments');
var {User} = require('../models/user');

// Set Up multer
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  }
});
 
var upload = multer({ storage: storage }, { limits: {fileSize: '1MB'}}).single('picture');

module.exports = function(app) {

   /*
   *  Comments Page
   *  List all comments in the database
   */
  app.get('/comments', (req, res) => {
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    Comments.find().then((result) => {
      res.render('comments/all.hbs',{
        results : result,
        fullUrl : fullUrl,
        level : req.session.level
      });
    }, (e) => {
      res.status(400).send(e);

    });
  });


   /*
   *  New Comment Page
   *  Creates a new comment
   */
  app.get('/comments/new/:id', (req, res) => {

    var id = req.params.id;
    // Get a list of all users
    User.find().then((users) => {
      return res.render('comments/new.hbs', {
          adminName : req.session.name,
          level: req.session.level,
          users : users,
          requestID : id,
          summernote: true
      });
    }, (e) => {
      res.status(400).send(e);
    });
      
  });

  /*
   *  Process a new Comment
   *  POST METHOD
   */
  app.post('/comments/new', (req, res) => {

    var comments = new Comments({
       title: req.body.title,
       description: req.body.description,
       admin_name: req.body.admin_name,
       request_id: req.body.request_id
   });

    comments.save().then((result) => {
        // Redirect to the comments page to show all
        Comments.find().then((result) => {


          var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

          res.render('comments/all.hbs',{
            results : result,
            message: "Your comment has been successfully added",
            fullUrl: fullUrl,
            level : req.session.level
          });
        }, (e) => {
          res.status(400).send(e);
        });
                
    }, (e) => {
      // TODO: change to html page
      res.status(400).send(e);
    });

  });


  app.get('/comments/view/:id', (req, res) => {

    var id = req.params.id; 

    Comments.findById(id, (err, comment) => {  

        // Handle any possible database errors
        if (err) {
            res.status(500).send(err);
        } else {
            // Update each attribute with any possible attribute that may have been submitted in the body of the comment
            // If that attribute isn't in the comment body, default back to whatever it was before.
            comment.read = true;

            // Save the updated document back to the database
            comment.save(function (err, comment) {
                if (err) {
                    res.status(500).send(err)
                }

                var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

                // Redirect to the comments page to show all
                Comments.find().then((result) => {
                  res.render('comments/view.hbs',{
                    results : result,
                    fullUrl: fullUrl,
                    level : req.session.level
                  });
                }, (e) => {
                  res.status(400).send(e);
                });
                
            });
        }
    });

  });


};
