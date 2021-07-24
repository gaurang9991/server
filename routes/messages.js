const express = require('express');
const { models, model } = require('mongoose');
const router = express.Router();

const Message =  require("../models/Message");


//add message
router.post("/",async (req,res)=>{
 const newMessage = new Message(req.body)

 try{
  const savedMessage = await newMessage.save();
  res.status(200).json(savedMessage)
 }catch(err){
  res.status(500).json(err)
 }
})

// get messages 

router.get("/:id",async (req,res)=>{
 try{
  const Messages = await Message.find({messageId : req.params.id})
  res.status(200).json(Messages)
 }catch(err){
  res.status(500).json(err)
 }
})


module.exports = router;