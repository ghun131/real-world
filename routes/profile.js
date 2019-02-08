const express = require('express');
const router = express.Router();
const Post = require('../modal/Post');
const User = require('../modal/User');
const middleware = require('../middleware');

router.get('/:username', (req, res) => {
  let data = {};
  let userName = req.params.username;
  // if (req.session.username) {
  //   userName = req.session.username
  // }
  // else {
  //   userName = req.params.username
  // }

  async function getUserInfo() {
    try {
      const user = await User
      .find({ username: userName })

      data.user = user;
      res.send(data)
    }
    catch(err) {
      console.log(err.message);
    }
  }

  async function getUserPosts() {
    try {
      const posts = await Post
      .find({ author: userName })
      .limit(13)
      .sort('-time');

      data.posts = posts;
      getUserInfo();
    }
    catch (err) {
      console.log(err.message);
    }
  }

  async function totalUserPosts() {
    try {
      const totalNum = await Post.aggregate([
        { $match: { author: userName }}, { $count: "posts"}
      ]);

      data.totalDocuments = totalNum;
    } catch (err) {
      console.log(err.message);
    }
    getUserPosts();
  }

  totalUserPosts();
});

// update followers
router.post('/:username', (req, res) => {
  let following = req.body.following;
  let theFollowing = req.body.theFollowing.trim(); 
  let theFollowed = req.body.theFollowed.trim(); 
  console.log('THE FOLLOWING', theFollowing);

  async function getTheFollowingAndUpdate() {
    try {
      const result = await User.findOneAndUpdate(
        { username: theFollowing }, { 
          $set: {
            following: following
          }  
        });
    }
    catch(err) { console.log( err.message ) }
  }

  async function changeFollowers() {
    try {
      const user = await User.findOne({username: theFollowed })

      if (user.followers.includes(theFollowing)) {
        // remove follower
        const result = await User.findOneAndUpdate(
          { username: theFollowed }, {
            $pop: {
              followers: 1
            }
          }, { new: true }
        )
        
        console.log('REMOVE FOLLOWER', result)
        res.send(result);

      } else {
        // add follower
        const result = await User.findOneAndUpdate(
          { username: theFollowed }, {
            $push: {
              followers: theFollowing
            }
          }, { new: true }
        )

        console.log('ADD FOLLOWER', result)
        res.send(result);
      }
      getTheFollowingAndUpdate();
    }
    catch(err) { console.log( err.message ) }
  }

  changeFollowers();
})

router.get('/:username/posts/:page', (req, res) => {
  let data = {};
  const userName = req.params.username;
  const getDocs = req.params.page - 1;
  async function getUserPosts() {
    try {
        const posts = await Post
        .find({ author: userName })
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

  async function totalUserPosts() {
    try {
      const totalNum = await Post.aggregate([
        { $match: { author: userName }}, { $count: "posts"}
      ]);

      data.totalDocuments = totalNum;
    } catch (err) {
      console.log(err.message);
    }
    getUserPosts();
  }

  totalUserPosts();
})

router.post('/:username/favourites', (req, res) => {
  let loveArticles = req.body.loveArticles;
  async function getLovedArticles() {
    try {
        const posts = await Post
        .find({ title: {
          $in: loveArticles
        }})
        .limit(13)
        .sort({ time: -1});

      res.send(posts);    
    } 
      catch (err) {
        console.log(err.message)
    }
  }

  getLovedArticles();
})



router.delete('/delete/:id', (req, res) => {
  async function deletePost() {
    try {
      const post = await Post.findByIdAndDelete(req.params.id);
      res.send(post);
    }
    catch(err) {
      console.log(err.message);
    }
  }

  deletePost()
})

router.put('/setting/:username', (req, res) => {
  let {avaUrl, email, biography} = req.body.data
  async function updateProfile() {
    try {
        const result = await User.updateOne({ email: email }, {
          $set: {
            avaUrl, email, biography
          }
        });
        
        res.send(result);
    } catch(err) {
      console.log(err.message)
    }
  }

  updateProfile();
})

module.exports = router