const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const users = require('../controllers/users.js');
router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));

router.route('/login')
    .get(catchAsync(users.renderLogin))
    .post(passport.authenticate('local', {
        failureFlash: true,
        failureRedirect: '/login'
    }), catchAsync(users.login));

router.get('/logout', users.logout);
module.exports = router;