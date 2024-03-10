const jwt = require('jsonwebtoken')
const secret = "$ar@hi*v&b%bd$"

function createToken(user){
  const payload = {
    _id: user._id,
    name: user.fullname,
    email: user.email,
    role: user.role
  };
  const token = jwt.sign(payload, secret)
  return token;
}

function verifyToken(token){
  const user = jwt.verify(token, secret);
  return user;
}

module.exports = {createToken, verifyToken}