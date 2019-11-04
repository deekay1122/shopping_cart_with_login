const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const User = require('../models/User');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => {
  let totalQty = 0;
  let totalPrice = 0;
  if(req.session.cart!==undefined){
    const cart = new Cart(req.session.cart);
    cart.generateArray().forEach(item=>{
      totalPrice += item.item.price;
      totalQty += item.qty;
    });
  }
  res.render('welcome', {
    user: null,
    totalPrice,
    totalQty
  });
});

// Dashboard
router.get('/dashboard', ensureAuthenticated, async (req, res) =>{
  const products = await Product.findAll();
  const userId = await req.user.id;
  let purchased_item = [];
  let totalQty = 0;
  let totalPrice = 0;
  const user = await User.findOne({
    where:{
      id:userId
    },
    include: [Order]
  });
  user.orders.forEach(order=>{
    const items = order.description.split(',');
    items.forEach(item=>{
      purchased_item.push({name:item, purchased_at:order.createdAt});
    });
  });
  if(req.session.cart!==undefined){
    const cart = new Cart(req.session.cart);
    cart.generateArray().forEach(item=>{
      totalPrice += item.item.price;
      totalQty += item.qty;
    });
  }
  res.render('dashboard', {
      user,
      purchased_item,
      totalQty,
      totalPrice
    });
  }
);


module.exports = router;
