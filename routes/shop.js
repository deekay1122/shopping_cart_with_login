const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const keyPublishable = process.env.PUBLISHABLE_KEY;
const keySecret = process.env.SECRET_KEY;
const stripe = require("stripe")(keySecret);

router.get('/', (req, res)=>{
  Product.findAll().then(products=>{
    res.render('shop/shop', {products: products});
  }).catch(err => console.log(err));
});

router.get('/add_to_shopping_cart/:id', (req, res)=>{
  // console.log(req.session.cart);
  let productId = req.params.id;
  let cart = new Cart(req.session.cart ? req.session.cart : {} );
  Product.findOne({where: {id: productId}}).then(product=>{
    if(cart.items[productId] == undefined){
      cart.add(product, product.id);
      req.session.cart = cart;
      req.flash('success_msg', `${product.productName} is added to the cart`);
      res.redirect('/shop');
    }
    else if(cart.items[productId] !== undefined){
      if(cart.items[productId].qty == 1){
        req.flash('error_msg', 'You already have that item in cart');
        res.redirect('/shop');
      }
    }
  })
  .catch(err => {
    console.log(err);
    res.redirect('/shop');
  });
});

router.get('/shopping_cart', (req, res)=>{
  console.log(req.session.cart);
  if(!req.session.cart){
    return res.render('shop/shopping_cart', {products: null});
  }
  let cart = new Cart(req.session.cart);
  res.render('shop/shopping_cart', { products: cart.generateArray(), totalPrice: cart.totalPrice, totalQty: cart.totalQty});
});

router.get('/checkout', (req, res)=>{
  let cart = new Cart(req.session.cart);
  res.render('shop/checkout', { totalPrice: cart.totalPrice });
});

const postCheckoutController = require('../controllers/postCheckoutController');
router.post('/checkout', postCheckoutController);
  // Set your secret key: remember to change this to your live secret key in production
  // See your keys here: https://dashboard.stripe.com/account/apikeys


module.exports = router;
