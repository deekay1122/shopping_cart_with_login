const express = require('express');
const router = express.Router();
const passport = require('passport');
// Load User model
const User = require('../models/User');
const VerificationToken = require('../models/VerificationToken');
const { forwardAuthenticated } = require('../config/auth');
const sequelize = require('../config/connection');
const csrfProtection = require('../config/csrf');
const parseForm = require('../config/parseForm');

// Register Page
router.get('/register', csrfProtection, forwardAuthenticated, (req, res) => res.render('register',{ csrfToken: req.csrfToken }));

// Register
const RegisterController = require('../controllers/registerController');
router.post('/register', parseForm, csrfProtection, RegisterController);

// Verification
const VerificationController = require('../controllers/verificationController');
router.get('/verification', VerificationController);

// get Login Page
router.get('/login', csrfProtection, forwardAuthenticated, (req, res) => res.render('login', { csrfToken: req.csrfToken }));

// Login handler
router.post('/login', parseForm, csrfProtection, (req, res, next) => {
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
router.get('/forgot', csrfProtection, (req, res) => {
  res.render('forgot', { csrfToken: req.csrfToken });
});

// forgot password handler
const SendResetPasswordController = require('../controllers/sendResetPasswordController');
router.post('/forgot', parseForm, csrfProtection, SendResetPasswordController);

//  get reset password & handler
const VerifyResetLinkController = require('../controllers/verifyResetLinkController');
router.get('/reset_password', csrfProtection, VerifyResetLinkController);

// password reset handler
const PostNewPasswordController = require('../controllers/postNewPasswordController');
router.post('/reset_password', parseForm, csrfProtection, PostNewPasswordController);

// get resend_verification
router.get('/resend_verification', csrfProtection, (req, res) => {
  res.render('resendVerification', { csrfToken: req.csrfToken });
});

// resend_verification handler
const ResendVerificationController = require('../controllers/resendVerificationController');
router.post('/resend_verification', parseForm, csrfProtection, ResendVerificationController);

module.exports = router;
