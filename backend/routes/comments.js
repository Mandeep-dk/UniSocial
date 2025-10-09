const Comment = require('../models/Comments');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const comment = new Comment(req.body);
        console.log('Incoming comment body:', req.body);

        let saved = await comment.save();
        saved = await saved.populate('author', 'uid username'); // 👈 populate after saving

        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.get('/:postId', async (req, res) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId })
            .populate('author', 'uid username profilePic')  // 👈 populate with only the fields you need
            .sort({ createdAt: -1 });

        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.patch('/reaction/:id', async (req, res) => {
    const { uid, type } = req.body;
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ message: "Not found" });

        if (type === 'like') {
            comment.dislikes = comment.dislikes.filter(id => id !== uid);
            comment.likes.includes(uid)
                ? comment.likes = comment.likes.filter(id => id !== uid)
                : comment.likes.push(uid);
        } else if (type === 'dislike') {
            comment.likes = comment.likes.filter(id => id !== uid);
            comment.dislikes.includes(uid)
                ? comment.dislikes = comment.dislikes.filter(id => id !== uid)
                : comment.dislikes.push(uid);
        }
        await comment.save();
        res.json(comment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

router.put('/delete/:id', async (req, res) => {
    const {id}=req.params;
    const {deleted} = req.body;
    try {
        const deletePost = await Comment.findByIdAndUpdate(id, {deleted});
        if (!deletePost) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.json({ message: "Post deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.put('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { content, edited } = req.body;

console.log("REQ BODY:", req.body);

    if (!content || !content.trim()) {
        return res.status(400).json({ error: "Content cannot be empty" });
    }

    try {
        const updatedComment = await Comment.findByIdAndUpdate(
            id,
            { content: content.trim(), edited }, // fields to update
            { new: true } // return the updated document
        );

        if (!updatedComment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        res.status(200).json(updatedComment);
    } catch (error) {
        console.error("Error updating comment:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})
module.exports = router;