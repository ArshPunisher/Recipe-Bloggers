const { Schema, model } = require('mongoose')
const { createHmac, randomBytes } = require('crypto');
const { createToken } = require('../service/authentication');

const userSchema = new Schema({
  fullname:{
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true,
    unique: true
  },
  salt:{
    type: String
  },
  password:{
    type: String,
    required: true
  },
  profileUrl:{
    type: String,
    default: ('/images/Profile.png')
  },
  role:{
    type: String,
    enum: ["USER", "ADMIN"],
    default: "USER"
  }
},{timestamps:true})

userSchema.pre("save", function(next){
  const user = this;
  if(!user.isModified('password')) return next();
  const salt = randomBytes(16).toString();

  const hashedPassword = createHmac("sha256", salt)
  .update(user.password)
  .digest('hex')

  this.salt = salt;
  this.password = hashedPassword;
  next();
})

userSchema.static("matchPassword", async function(email, password){
  const user = await this.findOne({email})
  if(!user) throw new Error("User not found")

  const salt = user.salt;
  const hashePassword = user.password;

  const regenerateHashPass = createHmac("sha256", salt)
  .update(password)
  .digest('hex')

  if(regenerateHashPass !== hashePassword) throw new Error("Invalid Password")

  const token = createToken(user)
  return token;
})

module.exports = model("users", userSchema)