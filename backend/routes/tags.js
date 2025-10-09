const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

router.get("/:tag", async (req, res) => {
    const { tag } = req.params;
    try {
        const posts = await Post.find({ tags: tag }).populate('author' , 'username profilePic');

        console.log("Posts found:", posts);
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports=router;