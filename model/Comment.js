const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let Comment = new Schema({
    articleTitle: {type: String, required: true, max: 200},
    avaUrl: {type: String, require: true},
    author: {type: String, required: true, max: 100},
    articleId: {type: String, required: true, max: 100},
    comment: {type: String, required: true, max: 3000},
    time: {type: String}
})

module.exports = mongoose.model('Comment', Comment);