const express = require('express');
const router = express.Router();
const Post = require('../model/Post');
const middleware = require('../middleware');

router.post('/', middleware.checkToken, (req, res) => {
  const { author, title, content, email, tags, avaUrl, description } = req.body.data;

  async function createPost() {
    let today = new Date();
    const newPost = new Post ({
      author,
      title,
      email,
      description,
      content,
      tags,
      avaUrl,
      time: Date.parse(today)
    })

    try {
      await newPost.save();
      res.send(newPost);
  }
    catch (err) {
      console.log(err.message)
    }
  }

  async function checkPost(content) {
    const samePost = await Post.find({ content: content })
    console.log('HIT THIS PART')

    if(!samePost[0]) {
      createPost()
    } else { 
      res.json({
        message: 'Don\' plagiarize! Write something \'s else'
      })
    }
  }

  checkPost(content)
})


module.exports = router;