const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const User = require('../models/User');
const Order = require('../models/Order');
const keyPublishable = process.env.PUBLISHABLE_KEY;
const keySecret = process.env.SECRET_KEY;
const stripe = require("stripe")(keySecret);
const { dontHaveItems } = require('../config/auth');

router.get('/', async (req, res)=>{
  const products = await Product.findAll();
  if(req.user){
    const userId = await req.user.id;
    const user = await User.findOne({
      where:{
        id:userId
      },
      include: [Order]
    });
    let orders = [];
    user.orders.forEach(order=>{
      function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
      }
      orders.push(order.productIds.split(","));
      orders = [].concat.apply([], orders);
      orders = orders.filter(onlyUnique);
    });
    res.render('shop/shop',{
      products,
      orders,
      req
    });
  }
  else {
    res.render('shop/shop',{
      products,
      req
    });
  }
});

router.get('/add_to_shopping_cart/:id', (req, res)=>{
  // console.log(req.session.cart);
  let productId = req.params.id;
  let cart = new Cart(req.session.cart ? req.session.cart : {} );
  Product.findOne({where: {id: productId}}).then(async product=>{
    if(cart.items[productId] == undefined){
      await cart.add(product, product.id);
      req.session.cart = await cart;
      await req.flash('success_msg', `${product.productName} is added to the cart`);
      await res.redirect('/shop');
    }
    else if(cart.items[productId] !== undefined){
      if(cart.items[productId].qty == 1){
        await req.flash('error_msg', 'You already have that item in cart');
        await res.redirect('/shop');
      }
    }
  })
  .catch(err => {
    console.log(err);
    res.redirect('/shop');
  });
});

router.get('/shopping_cart', (req, res)=>{
  if(!req.session.cart){
    return res.render('shop/shopping_cart', {products: null});
  }
  let cart = new Cart(req.session.cart);
  return res.render('shop/shopping_cart', { products: cart.generateArray(), totalPrice: cart.totalPrice, totalQty: cart.totalQty});
});

router.get('/checkout', ensureAuthenticated, async (req, res)=>{
  if(!req.session.cart){
    return res.redirect('/shop');
  }
  const userId = await req.user.id;
  const user = await User.findOne({
    where:{
      id:userId
    },
    include: [Order]
  });
  let purchased_before = [];
  user.orders.forEach(order=>{
    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }
    purchased_before.push(order.productIds.split(","));
    purchased_before = [].concat.apply([], purchased_before);
    purchased_before = purchased_before.filter(onlyUnique);
  });
  let cart = new Cart(req.session.cart);
  res.render('shop/checkout', { totalPrice: cart.totalPrice, purchased_before: purchased_before });
});

const postCheckoutController = require('../controllers/postCheckoutController');
router.post('/checkout', postCheckoutController);
  // Set your secret key: remember to change this to your live secret key in production
  // See your keys here: https://dashboard.stripe.com/account/apikeys


module.exports = router;
