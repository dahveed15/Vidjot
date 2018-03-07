const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
//Load Idea Model
require('../models/Idea');
const Idea = mongoose.model('ideas');

// Idea Index Page
router.get('/', (req, res) => {

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
router.get('/add', (req, res) => {
  res.render('ideas/add');
});

//Edit Idea Form
router.get('/edit/:id', (req, res) => {

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
router.post('/', (req, res) => {
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
router.put('/:id', (req, res) => {

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
router.delete('/:id', (req, res) => {
  Idea.remove({_id: req.params.id})
  .then(() => {
    req.flash('success_msg', 'Video idea removed');
    res.redirect('/ideas');
  });
});


module.exports = router;
