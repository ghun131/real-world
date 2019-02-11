const express = require('express');
const router = express.Router();
const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');

router.post('/', (req, res, next) => {
    const {email, username, password} = req.body.payload
 
    // Check whether email is used or not?
      User.findOne({ email: email }, (err, item) => {
        if (err) {
          return res.json(err);
        } else if (item) {
          return res.json({
            success: false,
            message: "This email is already used!"
          })
  
        } else {
  
          User.findOne({ username: username }, (err, thing) => {
            if (err) {
              return res.json(err);
            } else if (thing) {
              return res.json({
                success: false,
                message: "This user name is already taken! Choose a cooler one!"
              })
            } else {
              let userData = {
                email: email,
                username: username,
                avaUrl: '',
                biography: '',
                loveArticles: [],
                followers: [],
                following: [],
                salt: '',
                password: password,
                passwordConf: password
              }
              
              let salt = bcrypt.genSaltSync(10);
              let hash = bcrypt.hashSync(password, salt);

              let token = jwt.sign({ email: email }, config.get('jwtKey'), { expiresIn: '24h' })
              userData.password = hash;
            
              User.create(userData, (error, user) => {
                userData.token = token;
                if (error) {
                  return next(error);
                } else {
                  req.session.token = token;
                  req.session.username = username;
                  req.session.email = email;
                  return res.json({
                    success: true,
                    package: userData
                  })
                }
              });
            }
          })
  
        }
      })
  })
  
  module.exports = router;