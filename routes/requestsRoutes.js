var express = require('express');
var requestsRouter = express.Router();
// var router = express.Router();
const hbs = require('hbs');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

// Load my models
var {mongoose} = require('../config/mongoose');
var {Requests} = require('../models/requests');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'hbs');


/*
 *  Middlewares
 *  Make the public folder accessible for everyone
 */
app.use(express.static('public'));
/*
 *  Set the Partials Folder
 */
hbs.registerPartials('views/partials');


var router = function (nav) {

    // Get all Requests
    requestsRouter.route('/').get(function (req, res) {
        res.render('requests/index.hbs');
    });


    // New Requests
    requestsRouter.route('/add').get(function (req, res) {
       res.send('Adding Files');
    });


    // Post Requests
    requestsRouter.route('/').post(function (req, res) {
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


    // Update
    requestsRouter.route('/update').get(function (req, res) {
       res.render('dashboard.hbs');
    });

    requestsRouter.route('/').put(function (req, res) {
       res.render('dashboard.hbs');
    });


    // Delete
    requestsRouter.route('/delete').get(function (req, res) {
       res.render('dashboard.hbs');
    });

    requestsRouter.route('/').delete(function (req, res) {
        var id = req.params.id;

        if (!ObjectID.isValid(id)) {
            return res.status(404).send();
        }

        Requests.findByIdAndRemove(id).then((requests) => {
            if (!requests) {
                return res.status(404).send();
            }

            res.send(requests);
        }).catch((e) => {
            res.status(400).send();
        });
    });


    // Get one Requests
    requestsRouter.route('/:id').get(function (req, res) {
        
        var id = req.params.id;

        if (!ObjectID.isValid(id)) {
            return res.status(404).send();
        }

        Requests.findById(id).then((requests) => {
            if (!requests) {
                return res.status(404).send();
            }

            res.send({requests});

        }).catch((e) => {
            res.status(400).send();
        });
    });


    return requestsRouter;
};

module.exports = router;


// // middleware that is specific to this router
// router.use(function timeLog (req, res, next) {
//   console.log('Time: ', Date.now());
//   next();
// });

// // define the home page route
// router.get('/', function (req, res) {
//   res.send("Welcome");
// });

// // define the about route
// router.get('/about', function (req, res) {
//   res.send('About birds');
// });

// module.exports = router

