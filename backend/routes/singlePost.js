const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

router.get('/:id', async (req, res)=>{
    try{
        const post=await Post.findById(req.params.id).populate('author', 'username uid');
        res.status(200).json(post);
    }catch(err){
        res.status(500).json({message: err.message});
    }
})


router.patch('/reaction/:id', async (req, res) => {
    const { uid, type } = req.body;
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Not found" });

        if (type === 'like') {
            post.dislikes = post.dislikes.filter(id => id !== uid);
            post.likes.includes(uid)
                ? post.likes = post.likes.filter(id => id !== uid)
                : post.likes.push(uid);
        } else if (type === 'dislike') {
            post.likes = post.likes.filter(id => id !== uid);
            post.dislikes.includes(uid)
                ? post.dislikes = post.dislikes.filter(id => id !== uid)
                : post.dislikes.push(uid);
        }
        await post.save();
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})


router.delete("/deletePost/:id", async(req, res)=>{
    try{
        const deletedPost = await Post.findByIdAndDelete(req.params.id);
        console.log("deleting", req.params.id)
        if(!deletedPost){
            return res.status(404).json({message: "Post not found"})
        }
        res.status(200).json({message: "Post deleted successfully"})
    }catch(err){
        res.status(500).json({message: err.message});
    }
})
module.exports=router;