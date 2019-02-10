const express = require('express');
const router = express.Router();
const Post = require('../modal/Post');
const User = require('../modal/User');

router.get('/', (req, res) => {
  let data = {};
  async function getPosts() {
    try {
        const posts = await Post
        .find()
        .limit(13)
        .sort({ time: -1});
        data.posts = posts;
    } 
      catch (err) {
        console.log(err.message)
    }
    res.send(data);    
  }

  async function totalNumberOfDocuments() {
    try {
      const totalNum = await Post.aggregate([
        { $count: "posts"}
      ]);

      data.totalDocuments = totalNum;
    } catch (err) {
      console.log(err.message);
    }
    getPosts();
  }

  async function getMostPopularTags() {
    try {
      const tags = await Post.aggregate(
        [
          { $unwind: "$tags" },
          { $group: { _id: "$tags", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 13 }
        ]
      )
      data.tags = tags;
    } catch (err) {
      console.log(err.message);
    }
    totalNumberOfDocuments();
  }

  getMostPopularTags()
})

//Pagination for server by finding 13 documents after the last displayed document
router.get("/:pageNum", (req, res) => {
  let data = {};
  const getDocs = req.params.pageNum - 1
  async function getPosts() {
    try {
        const posts = await Post
        .find()
        .skip(13 * getDocs)
        .limit(13)
        .sort({ time: -1});
        data.posts = posts;
    } 
      catch (err) {
        console.log(err.message)
    }
    res.send(data);    
  }

  async function totalNumberOfDocuments() {
    try {
      const totalNum = await Post.aggregate([
        { $count: "posts"}
      ]);

      data.totalDocuments = totalNum;
    } catch (err) {
      console.log(err.message);
    }
    getPosts();
  }

  async function getMostPopularTags() {
    try {
      const tags = await Post.aggregate(
        [
          { $unwind: "$tags" },
          { $group: { _id: "$tags", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 13 }
        ]
      )
      data.tags = tags;
    } catch (err) {
      console.log(err.message);
    }
    totalNumberOfDocuments();
  }
  getMostPopularTags()
})

// user feed
router.post("/feed", (req, res) => {
  const following = req.body.payload;

  async function getPostsFromAuthorUserFollow() {
    try {
      const posts = await Post
      .find({ author: following })
      .sort({ time: -1 })

      res.send(posts);
    } catch(err) {
      console.log(err.message);
    }
  }

  getPostsFromAuthorUserFollow();
})
;

module.exports = router;