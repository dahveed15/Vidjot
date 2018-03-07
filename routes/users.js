const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

//user login Route
router.get('/login', (req, res) => {
  res.render('users/login');
});

//user register Route
router.get('/register', (req, res) => {
  res.send('register');
});

module.exports = router;
