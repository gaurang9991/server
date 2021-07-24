const express = require('express')
const router = express.Router();
const User = require("../models/User")

const Conversation =  require("../models/chat");

// create conversation
router.post("/:username",async (req,res)=>{


 const user =await User.findOne({username : req.params.username});
 console.log(req.body.UserId);
 const id = user._id.toString()
 const newConversation = new Conversation(
  {members:[req.body.UserId,id],}
  );

  try{
  
   const savedConversation = await newConversation.save()

   res.status(200).json(savedConversation)
  
 }catch(err)
 {
   res.status(500).json(err)
 }
})

//get user chat
router.get("/:userId",async (req,res)=>{
  try{
  const conversation =  await Conversation.find({members:{$in:[req.params.userId]}});
    res.status(200).json(conversation);
 }catch(err)
 {
   console.log(err)
    res.status(404).json(err);
 }
})


module.exports = router