const User = require('../models/user');
const ResetPasswordToken = require('../models/resetpasswordtoken');

module.exports = (req, res) => {
  let errors = [];
  const email = req.query.email;
  if(email == undefined){
    res.redirect('/users/login');
  }

  return User.findOne({
    where: { email: req.query.email }
  })
    .then(user => {
      return ResetPasswordToken.findOne({ where: { userId: user.id }})
      .then(foundToken=>{
        if(foundToken.token = req.query.token){
          errors.push({ msg: `Hello ${user.name}! Please enter new password` });
          res.render('reset', {
            errors,
            user
          })
        }
      })
      .catch(err => console.log(err));
    })
}
