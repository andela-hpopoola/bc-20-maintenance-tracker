var express = require('express');
const hbs = require('hbs');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

var adminRouter = express.Router();

// Load my models
var {mongoose} = require('../config/mongoose');
var {Admin} = require('../models/admin');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'hbs');

/*
 *  Set the Partials Folder
 */
hbs.registerPartials('../views/partials');


var router = function (nav) {

    // /admin/
    adminRouter.route('/').get(function (req, res) {
       res.render('dashboard.hbs');
    });

    adminRouter.route('/').post(function (req, res) {
       res.render('dashboard.hbs');
    });

    adminRouter.route('/').put(function (req, res) {
       res.render('dashboard.hbs');
    });

    adminRouter.route('/').delete(function (req, res) {
       res.render('dashboard.hbs');
    });

    adminRouter.route('/').get(function (req, res) {
        
        var id = req.params.id;

        if (!ObjectID.isValid(id)) {
            return res.status(404).send();
        }
    });

    return adminRouter;
};

module.exports = router;