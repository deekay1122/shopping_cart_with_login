const express = require('express');
const router = express.Router();
const passport = require('passport');
// Load User model
const User = require('../models/User');
const VerificationToken = require('../models/VerificationToken');
const { forwardAuthenticated } = require('../config/auth');
const sequelize = require('../config/connection');

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Register
const RegisterController = require('../controllers/registerController');
router.post('/register', RegisterController);

// Verification
const VerificationController = require('../controllers/verificationController');
router.get('/verification', VerificationController);

// get Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Login handler
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

// get forgot password
router.get('/forgot', (req, res) => {
  res.render('forgot');
});

// forgot password handler
const SendResetPasswordController = require('../controllers/sendResetPasswordController');
router.post('/forgot', SendResetPasswordController);

//  get reset password & handler
const VerifyResetLinkController = require('../controllers/verifyResetLinkController');
router.get('/reset_password', VerifyResetLinkController);

// password reset handler
const PostNewPasswordController = require('../controllers/postNewPasswordController');
router.post('/reset_password', PostNewPasswordController);

// get resend_verification
router.get('/resend_verification', (req, res) => {
  res.render('resendVerification');
});

// resend_verification handler
const ResendVerificationController = require('../controllers/resendVerificationController');
router.post('/resend_verification', ResendVerificationController);

module.exports = router;
