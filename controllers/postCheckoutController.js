const stripe = require('stripe')('sk_test_5MBNV2gPcJBqd4mukaFKeYlz00dSoDTVaw');
const Cart = require('../models/Cart');

module.exports = (req, res) =>{
  const cart = new Cart(req.session.cart);
  const totalPrice = cart.totalPrice;
  const token = req.body.stripeToken;
  const email = req.body.email;

  stripe.customers.create({
    email: email,
    source: token
  }, function(err, customer){
    if(err){
      console.log(err);
    }
    stripe.charges.create({
      amount: totalPrice,
      currency: 'jpy',
      customer: customer.id,
      description: 'test charge'
    }, function(err, charge){
      if(err){
        console.log(err);
      }
        res.send(charge);
    });
  });
}
