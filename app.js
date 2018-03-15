//run npm install --save on each of these to require them

const express = require('express');
//use the handlebars template engine
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path');

//initialize application
const app = express();

//Load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//Passport Config (passes passport into exported function)
require('./config/passport')(passport);

//Map global promise - get rid of warning
mongoose.promise = global.Promise;

//connect to mongoose
//the part after localhost is the name of the database (creates a database for us)
//we use promises a lot in mongoose
//catch any errors if something fails
mongoose.connect('mongodb://localhost/vidjot-dev')
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));



//Handlebars MIDDLEWARE
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//How middlware works
// app.use(function(req, res, next) {
//   // console.log(Date.now());
//   //set a request variable; has access throughout our application
//   req.name = "David Harris";
//   next();
// });


//BodyParser Middleware

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


//Static folder
//sets the public folder to be the express static folder
app.use(express.static(path.join(__dirname, 'public')));


//Method override middleware
app.use(methodOverride('_method'));


//express-session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: true }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect-flash middleware
app.use(flash());

//Global variables
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  //this one will be used for local auth
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});


//ROUTES

//index route
//restart server if you make changes to the get request
//however, if you install nodemon, it will do it automatically
app.get('/', (req, res) => {
  //displays INDEX on the browser designated with / file path
  // res.send('INDEX');

  //passes in David Harris and displays it every time we reload on / via middleware
  // console.log(req.name);



  //renders whatever is in index.handlebars
  //handlebars requries a layouts/main.handlebars path (I think the equivalent to application.html)
  const title = 'Welcome';
  res.render('index', {
    title: title
  });

});

//about route
app.get('/about', (req, res) => {
  res.render('about');
});



//Use routes
//anything that follows the path after ideas in the ideas.js file will have /ideas before it
app.use('/ideas', ideas);
app.use('/users', users);


const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
