const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title: String,
    author: String,
    content: String,
    date: String,
    rating: [Number],
    comment: [String],
    avgrating: Number,
    disabled: Boolean,
    notifications: [String],
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
