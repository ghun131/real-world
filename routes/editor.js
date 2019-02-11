const express = require('express');
const router = express.Router();
const Post = require('../model/Post');
const middleware = require('../middleware');

router.put('/:id', middleware.checkToken, (req, res) => {

  console.log('hit editor backend')
    async function updatePost() {
      try {
        const post = await Post.findById(req.params.id);
  
        if (req.body.data.title) {
          post.content = req.body.data.content;
          post.title = req.body.data.title;
          post.tags = req.body.data.tags;
          post.avaUrl = req.body.data.avaUrl;
          const result = await post.save();
          console.log("save updated post");
          res.send(post);
        } else {
          res.send('Please enter your text!');
        }
      }
      catch(err) {
        console.log(err.message)
      }
    }
  
    updatePost()
})

module.exports = router;