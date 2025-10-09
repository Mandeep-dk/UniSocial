const express = require('express');
const router = express.Router();
const UserProfile = require('../models/UserProfile');
const Post = require('../models/Post');

router.get("/:id", async(req, res)=>{
    
    try{
        const id = req.params.id;
        const post=await Post.findById(id).populate("author", "username profilePic");

        if(!post){
            return res.status(404).json({message:"Post not found"});
        }
        res.json(post);
    }catch(err){
        res.status(500).json({message: "Error fetching post", error: err});
    }
})

module.exports = router;