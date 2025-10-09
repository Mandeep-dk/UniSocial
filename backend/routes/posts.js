const express = require('express');
const router = express.Router();
const UserProfile = require('../models/UserProfile');
const Post = require('../models/Post');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/jpg', 'image/gif',
      'video/mp4', 'video/webm', 'video/ogg'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only images and videos are allowed'));
    }
  }
});

router.post('/', upload.array('media', 5), async(req, res)=>{
    const {uid, title, content, tags} = req.body;
    const imagePaths = req.files ? req.files.map(file => file.path) : [];

    console.log("Received request:", { uid, title, content, tags, imagePaths });

    // Only check REQUIRED fields
    if(!uid || !title || !content) {
        return res.status(400).json({message: "UID, title, and content are required"});
    }

    try{
        const user = await UserProfile.findOne({uid});
        console.log("Fetched user profile:", user);

        if(!user){
            return res.status(404).json({
                message: "User profile not found. Please complete your profile first.",
                redirect: "/profile"
            });
        }

        if (!user.username) {
            console.log("User profile missing username:", user);
            return res.status(400).json({
                message: "User profile is incomplete. Username is required."
            });
        }

        const newPost = await Post.create({
            title,
            content, 
            author: user._id,
            tags: Array.isArray(tags) ? tags : (tags ? [tags] : []), // Handle tags properly
            media: imagePaths
        });

        console.log("Post created successfully:", newPost);
        res.status(201).json(newPost);
    }catch(err){
        console.error("Error creating post:", err);
        res.status(500).json({
            message: err.message,
            error: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
})


module.exports=router;
