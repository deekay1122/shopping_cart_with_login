const User = require('../models/user');
const bcrypt = require('bcryptjs');

module.exports = (req, res) =>{
  console.log(req.body.password);
  console.log(req.body.userid);
  User.findOne({ where:{ id: req.body.userid}})
    .then(user =>{
      console.log(user.email);
      bcrypt.genSalt(10, (err, salt) =>{
        bcrypt.hash(req.body.password, salt, (err, hash) =>{
          if (err) throw err;
          user.update({ password: hash});
          req.flash('success_msg', 'Please login with new password');
          res.redirect('/users/login');
        });
      });
    })
    .catch(err => console.log(err));

}
