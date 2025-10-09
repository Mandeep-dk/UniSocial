const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Comments = require('../models/Comments')

router.get("/trending-tags", async (req, res) => {
  try {
    const tags = await Post.aggregate([
      { $unwind: "$tags" }, // flatten tags array
      { $group: { _id: "$tags", count: { $sum: 1 } } }, // count occurrences
      { $sort: { count: -1 } }, // sort by popularity
      { $limit: 5 } // top 10
    ]);
    res.json(tags);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tags" });
  }
});

// routes/posts.js
router.get("/top-posts", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username profilePic") // populate author info
      .sort({ likes: -1 }) // sort by number of likes descending
      .limit(4); // top 5 posts

    res.json(posts);
  } catch (err) {
    console.error("Error fetching top posts:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/top-commented", async (req, res) => {
  try {
    const posts = await Post.aggregate([
      {
        $lookup: {
          from: "comments",            // collection name for comments
          localField: "_id",           // match Post._id
          foreignField: "postId",      // with Comment.postId
          as: "comments"
        }
      },
      {
        $addFields: {
          commentsCount: { $size: "$comments" }
        }
      },
      {
        $project: {
          title: 1,
          commentsCount: 1,
          author: 1
        }
      },
      { $sort: { commentsCount: -1 } },
      { $limit: 4 }
    ]);

    // Optionally populate author after aggregation
    const populated = await Post.populate(posts, {
      path: "author",
      select: "username profilePic"
    });

    res.json(populated);
  } catch (err) {
    console.error("Error fetching top commented:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


module.exports=router;