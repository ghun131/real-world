const express = require('express');
const router = express.Router();
const Post = require('../model/Post');

router.get('/:tag', (req, res) => {
    let tag = req.params.tag;
    async function getArticlesOfATag() {
      try {
        const tagArticles = await Post
        .find({ tags: tag })
        .sort('-time');
  
        res.send(tagArticles);
      }
      catch (err) {
        console.log(err.message);
      }
    }
  
    getArticlesOfATag();
})

module.exports = router;