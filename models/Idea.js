//Mongo is (NoSQL) schemaless, meaning you don't have to define a schema on the database level to create stuff
//However, mongoose allows you to define a schema (make models) in our app
//It's good practice to have some type of design
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//create Schema (PascalCase; every word capitalized)
//default: Date.now will set the current date every time something is made
const IdeaSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

//create our model and connect it to the IdeaSchema
mongoose.model('ideas', IdeaSchema);

//now load this up in app.js
