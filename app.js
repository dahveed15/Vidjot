//run npm install --save on each of these to require them

const express = require('express');
//use the handlebars template engine
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');

//initialize application
const app = express();


//Map global promise - get rid of warning
mongoose.promise = global.Promise;

//connect to mongoose
//the part after localhost is the name of the database (creates a database for us)
//we use promises a lot in mongoose
//catch any errors if something fails
mongoose.connect('mongodb://localhost/vidjot-dev')
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));

//Load Idea Model
require('./models/Idea');
const Idea = mongoose.model('ideas');



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


//Method override middleware
app.use(methodOverride('_method'));


//express-session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: true }
}));


//connect-flash middleware
app.use(flash());

//Global variables
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  //this one will be used for local auth
  res.locals.error = req.flash('error');
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

// Idea Index Page
app.get('/ideas', (req, res) => {

  //display all ideas (mongo command)
  Idea.find({})
    .sort({date:'desc'})
    .then(ideas => {
    res.render('ideas/index', {
      ideas:ideas
    });
  });
});


//add Idea Form
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
});

//Edit Idea Form
app.get('/ideas/edit/:id', (req, res) => {

  //mongo
  //req.params.id finds whatever is in the wildcard in the get file path (:id)
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    res.render('ideas/edit', {
      idea:idea
    });
  });
});

//process form
app.post('/ideas', (req, res) => {
  let errors = [];

  //req.body is object with title, details (form fields)
  if(!req.body.title) {
    errors.push({text: 'Please add a title'});
  }
  if(!req.body.details) {
    errors.push({text: 'Please add some details'});
  }

  if(errors.length > 0) {
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details
    };
    //comes from the model defined on line 26
    //.save() saves the info retrieved from newUser to the database
    new Idea(newUser)
    .save()
    .then(idea => {
      req.flash('success_msg', 'Video idea added');
      res.redirect('/ideas');
    });
  }
});

//Edit Form process (update form)
app.put('/ideas/:id', (req, res) => {

  //find the idea by its id, then update it
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    //new values
    idea.title = req.body.title;
    idea.details = req.body.details;

    idea.save()
    .then(() => {
      req.flash('success_msg', 'Video idea updated');
      res.redirect('/ideas');
    });
  });
});

// Delete Idea
app.delete('/ideas/:id', (req, res) => {
  Idea.remove({_id: req.params.id})
  .then(() => {
    req.flash('success_msg', 'Video idea removed');
    res.redirect('/ideas');
  });
});

const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
