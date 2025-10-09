const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

router.get('/', async (req, res)=>{
    try{
        const posts=await Post.find().populate('author').sort({createdAt: -1});
        res.status(200).json(posts);
    }catch(err){
        res.status(500).json({message: err.message});
    }
})

module.exports=router;