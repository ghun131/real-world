const config = require('config');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const register = require('./routes/register');
const logIn = require('./routes/logIn');
const logOut = require('./routes/logOut');
const newPost = require('./routes/newPost');
const article = require('./routes/article');
const profile = require('./routes/profile');
const editor = require('./routes/editor');
const posts = require('./routes/posts');
const tags = require('./routes/tags');
const express = require('express');
const app = express();
const session = require('express-session');

if (!config.get('jwtKey')) {
    console.error('FATAL ERROR: jwtKey is not defined');
    process.exit(1);
}

mongoose.connect('mongodb://hung131:abc123@ds151383.mlab.com:51383/simple-blog-db');

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'dist')));

app.use(session({ 
    secret: 'very mysterious',
    saveUninitialized: false,
    resave: false }))
// GET route for reading data
app.use('/api/posts', posts);

//POST route for register new user
app.use('/register', register);

// POST log in after registering
app.use('/api/login', logIn);

// User log out POST to clear session
app.use('/api/logout', logOut);

// Handle one article
app.use('/article', article)

// Editor page
app.use('/editor', editor)

//POST method for new post
app.use('/api/newpost', newPost);

// GET articles for a tag
app.use('/tag', tags);

//POST method finds all posts of one author
app.use('/profile', profile);

app.use('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'))
})

require('./prod')(app);

app.listen(process.env.PORT || 3000, "0.0.0.0", () => console.log('Listening...'));