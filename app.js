const express = require('express');
const app = express();
const hbs = require('hbs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/todo');

const Todo = mongoose.model('Todo', {
	text: {
		type: String
	},
	completed: {
		type: Boolean
	},
	completedAt: {
		type: Number
	}
});

var newTodo = new Todo({
	text: 'Cook dinner'
});

newTodo.save().then((doc) => {
	console.log('Save Todo',);
}, (e) => {
	console.log('unable to save Todo');
})


// Define the local and online port
const port = process.env.PORT || 3000;


/*
 *  Middlewares
 *  Make the public folder accessible for everyone
 */
app.use(express.static('public'));

// Used for easier debugging
app.use((req, res, next) => {
	var now = new Date().toString();

	// output the current request
	console.log(`${now}: ${req.method} ${req.url}`);

	// Load Next
	next();
});

/*
 *  Set up Handle Bars
 *  Set it as the default template engine in express
 */
app.set('view engine', 'hbs');

/*
 *  Set the Partials Folder
 */
hbs.registerPartials(__dirname + '/views/partials');


 // Register Different Helpers
 hbs.registerPartials('getCurrentYear', () => {
 	return new Date().getFullYear();
 })


// Basic Routes
// app.get('/', function(req,res){
// 	res.send('Hello World');
// });
// 

app.get('/', (req, res) => {
	res.render('login.hbs');
});

/*
 *  This is the port used by the application
 *  3000 for localhost
 *  Heroku port will be gotten automatically
 */
app.listen(port, (err) => {
	console.log('Running Server at Port 3000');
});