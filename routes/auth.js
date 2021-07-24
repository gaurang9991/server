const express = require('express')
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//register

router.post("/register", async (req,res)=>{

 var user = null;
 var emailcheck=null;

  user = await User.findOne({username:req.body.Username});
 if(user)
 res.status(404).json("user exits")

 emailcheck = await User.findOne({email:req.body.Username});
 if(emailcheck) 
 res.status(404).json("user exits")


try
{
 //generate hashed password
 const salt = await bcrypt.genSalt(10);
 const hashedPassword = await bcrypt.hash(req.body.Password,salt);

 // create new user
 const newUser = new User({
  username : req.body.Username,
  email : req.body.Email,
  password : hashedPassword,
 })

 const user = await newUser.save()
 res.status(200).json("ok");

}catch(err)
{
 console.log(err);
}

})

//login

router.post("/login",async (req,res)=>{

try{
 const user = await User.findOne({email:req.body.Username});
 !user && res.status(404).json("user not found")

 const validPassword = await bcrypt.compare(req.body.password,user.password)
 !validPassword && res.status(404).json("wrong password")

 res.status(200).json(user);
  
 }catch(err)
 {
  console.log(err)
 }

})

module.exports = router;