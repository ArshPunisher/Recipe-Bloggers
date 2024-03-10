const express = require('express');
const router = express.Router();
const userModel = require('../models/users');
const { createToken } = require('../service/authentication');

router.get('/login', (req, res)=>{
  res.render("login")
})

router.get('/signup', (req, res)=>{
  res.render("signup")
})

router.get('/logout', (req, res)=>{
  res.clearCookie("token").redirect('/')
})

router.post('/login', async (req, res)=>{
  const {email, password} = req.body;
  try {
    const token = await userModel.matchPassword(email, password)
    res.cookie("token", token).redirect('/')
  } catch (error) {
    console.log(error.message)
    res.status(404).render("login", {
      error:error.message
    })
  }
})

router.post('/signup', async (req, res)=>{
  const {fullname, email, password} = req.body;
  try {
    const user = await userModel.create({
      fullname, 
      email, 
      password
    })
    console.log(user)
    const token = createToken(user);
    res.cookie("token", token)
    res.status(201).redirect('/')
  } catch (error) {
    res.status(400).render('signup', {
      error:error.message
    })
  }

})

module.exports = router;