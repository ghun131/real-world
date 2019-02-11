const express = require('express');
const router = express.Router();
const Post = require('../model/Post');
const User = require('../model/User');
const Comment = require('../model/Comment');
const middleware = require('../middleware');

router.get('/:id', (req, res) => {
    let data = {}
    console.log(req.params.id);

    async function getOneArticle() {
        try {
            const article = await Post.findById(req.params.id);
            data.article = [article];
        }
        catch (err) {
            console.log(err.message);
        }
        getUserInfo();
    };

    // This send one single article along with its comments
    // Comment for each article will save the article's id
    // so we can find all comments that have that ID
    // We also need to find user info before sending data back to client

    async function getUserInfo() {
        try {
          const user = await User
          .find({ username: data.article[0].author })
    
          data.user = user;
        }
        catch(err) {
          console.log(err.message);
        }
        getComments();
      }

    async function getComments() {
        try {
            const comments = await Comment
                .find({ articleId: req.params.id })
                .sort('-time')
            data.comments = comments;
            res.send(data);
        }
        catch (err) {
            console.log(err.message);
        }
    }

    getOneArticle();
})

//update love for a particular article
router.put('/:id', (req, res) => {
    const { author, title } = req.body.payload;
    let data = {};
    async function updateLove(num) {
        try {
            const post = await Post
            .findByIdAndUpdate(req.params.id, 
                { $inc: { love: num } }, 
                { new: true });
            data.post = post;
            res.send(data)
        } catch (err) { 
            console.log(err.message)
        }
    }

    async function updateFavouriteArticle() {
        try {
            const user = await User.findOne({ username: author });
            let index = user.loveArticles.indexOf(title);
            console.log(index)
            if (index === -1) {
                user.loveArticles.push(title);
                const result = await user.save();
                data.user = user;
                updateLove(1)
            } else {
                user.loveArticles.splice(index, 1);
                const result = await user.save();
                data.user = user;
                updateLove(-1)
            }
        } catch (err) {
            console.log(err.message);
        }

    }

    updateFavouriteArticle();
})

//add a new comment
router.post('/:id', (req, res) => {
    const { author, comment, articleTitle, avaUrl } = req.body.data;

    async function createComment() {
        let today = new Date();
        const newComment = new Comment ({
            articleTitle,
            articleId: req.params.id,
            avaUrl,
            author,
            comment,
            time: Date.parse(today)
        })
    
        try {
          await newComment.save();
          res.send(newComment);
    }
        catch (err) {
          console.log(err.message)
        }
    }

    createComment();
})

// delete a comment
router.delete('/comment/delete/:id', (req, res) => {
    async function deleteComment() {
        try {
          const comment = await Comment.findByIdAndDelete(req.params.id);
          res.send(comment);
        }
        catch(err) {
          console.log(err.message);
        }
      }
    
      deleteComment()
})

module.exports = router;