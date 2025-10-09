const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
router.get('/:uid',async (req, res)=>{
    try{
        const posts= await Post.find({author: req.params.uid}).populate('author', 'username profilePic').sort({createdAt:-1});
        res.json(posts);
    }catch(error){
        res.status(500).json({message:error.message})
    }
})
module.exports=router;