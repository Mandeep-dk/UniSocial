const express = require('express');
const router = express.Router();
const UserProfile = require('../models/UserProfile');
const Post = require('../models/Post');

// Followers
router.get("/:uid/followers", async (req, res) => {
    try {
        const user = await UserProfile.findOne({ uid: req.params.uid });
        if (!user) return res.status(404).json({ message: "User not found" });

        const followers = await UserProfile.find({ uid: { $in: user.followers } }).select(
            "uid username profilePic"
        );

        res.json(followers);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Following
router.get("/:uid/following", async (req, res) => {
    try {
        const user = await UserProfile.findOne({ uid: req.params.uid });
        if (!user) return res.status(404).json({ message: "User not found" });

        const following = await UserProfile.find({ uid: { $in: user.following } }).select(
            "uid username profilePic"
        );

        res.json(following);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


module.exports=router;