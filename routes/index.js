const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const User = require('../models/User');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>{
  const userId = req.user.id;
  const user = User.findOne({
    where: {id: userId},
    include: [Order]
  }).then(user => {
  }).catch(err => console.log(err));
  res.render('dashboard', {
      user: user,
      orders: user.orders
    });
  }
);


module.exports = router;
