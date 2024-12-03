const express = require('express');
const router = express.Router()
const User = require('../models/user');
const passport = require('passport');
const catchAsync = require('../utilities/catchAsync')
const { storeReturnTo } = require('../middleware/storeReturnTo');
const users = require('../controllers/users')


// User Router
router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));

router.route('/login')
    .get(users.renderLogin)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

router.get('/logout', users.logout);

module.exports = router;