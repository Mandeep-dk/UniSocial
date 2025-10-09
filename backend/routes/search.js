const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

router.get("/", async(req, res)=>{
    try{
        const query = req.query.query;

         const results = await Post.aggregate([
      {
        $search: {
          index: "default", // name of the Atlas Search index
          text: {
            query: query,
            path: ["title", "content", "tags"] // fields to search
          }
        }
      },
      { $limit: 10 } // limit results
    ]);

    res.json(results);
    }catch(err){
        res.status(500).json({message: err.message});
    }
})

module.exports=router;