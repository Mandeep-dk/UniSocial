const express = require('express');
const router = express.Router();
const UserProfile = require('../models/UserProfile');
const Post = require('../models/Post');


router.patch('/:currentUid/follow/:targetUid', async(req, res)=>{
    const {currentUid, targetUid} = req.params;
    try{
        await UserProfile.findOneAndUpdate(
            {uid:currentUid}, {
                $addToSet: {following: targetUid}
            }, {
                new:true
            }
        );
        await UserProfile.findOneAndUpdate(
            {uid:targetUid}, {
                $addToSet: {followers: currentUid}
        }, {new:true});
        res.json({message: "Followed successfully"});
    }catch(err){
        res.status(500).json({error: err.message})
          console.log(err);
    }
})

router.patch("/:currentUid/unfollow/:targetUid", async(req, res)=>{
    const {currentUid, targetUid} = req.params;
    try{
        await UserProfile.findOneAndUpdate({uid:currentUid}, {$pull: {following: targetUid}}, {new: true})
        await UserProfile.findOneAndUpdate({uid:targetUid}, {$pull: {followers:currentUid}}, {new: true})
        res.json({message: "Unfollowed successfully"});
    }catch(err){
        res.status(500).json({error: err.message})
        console.log(err);
    }
})


router.get("/:currentUid/is-following/:targetUid", async (req, res) => {
  try {
    const { currentUid, targetUid } = req.params;

    // If you want to find by your custom uid field
    const user = await UserProfile.findOne({ uid: currentUid });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isFollowing = user.following.includes(targetUid);
    res.json({ isFollowing });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports=router;