const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    user: req.user
  })
);

router.get('/shop', (req, res)=>{
  Product.findAll().then(products=>{
    res.render('shop', {products: products});
  }).catch(err => console.log(err));
});

router.get('/add_to_shopping_cart/:id', (req, res)=>{
  console.log(req.params);
  let productId = req.params.id;
  let cart = new Cart(req.session.cart ? req.session.cart : {} );
  Product.findOne({where: {id: productId}}).then(product=>{
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/shop');
  })
  .catch(err => {
    console.log(err);
    res.redirect('/shop');
  });
});

module.exports = router;
