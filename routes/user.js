const express = require('express');
const User = require('../models/User');
const router = express.Router();

//update user 
//delete user
// get a username
router.get("/:id/username",async (req,res)=>{
    try{
        const user =await User.findById(req.params.id);
        res.status(200).send(user.username)
       }
    catch(err)
    {
     res.status(500).json(err)
    }
})
// get all contacts
router.get("/:id/contacts",async (req,res)=>{
   try{
        const user =await User.findById(req.params.id);
        res.status(200).send(user.contacts)
       }
    catch(err)
    {
     res.status(500).json(err)
    }
})




// add contact
router.put("/:id/addcontact",async (req,res)=>{
 if(req.body.userId !== req.params.id)
 {
    try{
        const user =await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);
        if(!user.contacts.includes(req.body.userId))
        {
         await user.updateOne({$push:{contacts: req.body.userId}})
         
         await currentUser.updateOne({$push:{contacts: req.params.id}})
         
        }else
        {
         res.status(403).json("contact already")
        }
       }
    catch(err)
    {
     res.status(500).json(err)
    }
 }else{
  res.status(403).json("none");
 }
})
// remove contact
module.exports = router;