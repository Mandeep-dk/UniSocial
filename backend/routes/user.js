const express = require('express');
const router = express.Router();
// const multer = require('multer');
const { upload } = require('../cloudinary'); 
const UserProfile = require('../models/UserProfile');

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/'); // folder to save images
//   },
//   filename: function (req, file, cb) {
//     const uniqueName = Date.now() + '-' + file.originalname;
//     cb(null, uniqueName);
//   },
// });

// const upload = multer({ storage });


router.post('/profile', async (req, res) => {
  const { uid, username, branch, year, interests } = req.body;
  console.log(req.body);

  try {
    const existing = await UserProfile.findOne({ uid });
    if (existing) {
          console.log("Existing profile found:", existing);

      return res.status(400).json({ message: "Profile already exists" });
    }
    const newProfile=await UserProfile.create({ uid, username, branch, year, interests });

    await UserProfile.findOneAndUpdate({ uid }, { profileCompleted: true }, {new: true});


    res.status(200).json({ message: "Profile saved successfully!", profile: newProfile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:uid/editProfile', async (req, res) => {
  const { uid } = req.params; // Get uid from URL parameter
  const updates = req.body;

  console.log('Edit profile request:', { uid, updates }); // Debug log

  try {
    const updatedUser = await UserProfile.findOneAndUpdate(
      { uid }, // Search by uid field in schema
      { $set: updates }, 
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ 
      message: 'Profile updated successfully',
      data: updatedUser 
    });

  } catch (err) {
    console.error('Edit profile error:', err);
    res.status(500).json({ message: err.message });
  }
});

router.get('/getProfile/:uid', async (req, res) => {
  try {
    const user = await UserProfile.findOne({ uid: req.params.uid });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})

router.post('/uploadProfilePic/:uid', upload.single('profilePic'), async (req, res) => {
  try {
    const imagePath = req.file.path;
    console.log("Incoming file:", req.file);
    console.log("UID:", req.params.uid);
    const updatedUser = await UserProfile.findOneAndUpdate(
      { uid: req.params.uid },
      { profilePic: imagePath },
      { new: true }
    )
    res.json(updatedUser);
    console.log(updatedUser);
  } catch (err) {
    res.status(500).json({ error: 'Upload failed' });
  }
})


router.delete("/delete/:uid", async (req, res) => {
  try {
    const { uid } = req.params;

    const user = await UserProfile.findOneAndUpdate(
      { uid },
      {
        username: "[deleted]",
        profilePic: "",
        deleted: true,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User marked as deleted" });
  } catch (err) {
    console.error("Delete error:", err.message, err.stack);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/searchUser/", async(req, res)=>{
  try{
    const query = req.query.query;
    const uid = req.query.uid;
    
    const result = await UserProfile.findOne({ 
      username: query,
      uid: { $ne: uid },
      deleted: { $ne: true } 
    });

    if(result){
      return res.json({exists: true});
    } else{
      return res.json({exists: false});
    }
  } catch(err){
    res.status(500).json({message: err.message}) // Fixed: was res.json(500)
  }
});

module.exports = router;
