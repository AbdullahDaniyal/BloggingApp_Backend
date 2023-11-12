// blogController.js

const Blog = require('../models/Blog'); 
const User = require('../models/User');

const create_blog = async (req, res) => {
    const { title, content, author } = req.body;
    const date = new Date().toLocaleDateString();
    const ratings = [];
    const comments = [];
    const notifications = [];

    const blog = new Blog({ title, content, date, ratings, author, comments, avgrating: 0, disabled: false, notifications });

    try {
        await blog.save();
        res.status(200).send(`Blog "${title}" created`);
    } catch (err) {
        res.status(422).send(err.message);
    }
};

const get_all_blogs_of_user = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await User.findById(userId);
        if (!user || user.disabled === true) {
            return res.status(404).send('User not found');
        }
        const blogs = await Blog.find({ author: user.username, disabled: false });
        res.status(200).json(blogs);
        user.notifications = [];
        await user.save();
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const notifications_user = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await User.findById(userId);
        if (!user || user.disabled === true) {
            return res.status(404).send('User not found');
        }
        const username = user.username;
        const blog = await Blog.findOne({ author: username, disabled: false });
        res.status(200).json(blog.notifications);
        blog.notifications = [];
        await blog.save();
    }
    catch (err) {
        res.status(500).send(err.message);
    }
};

const search_blog_filter = async (req, res) => {
    const title = req.params.title;
    try {
        const blogs = await Blog.find({ title: { $regex: title, $options: 'i' }, disabled: false });
        res.status(200).json(blogs);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const sorted_blogs_date = async (req, res) => {
    try {
        let blogs = await Blog.find({ disabled: false });
        blogs = blogs.map(blog => ({
            ...blog._doc,
            date: new Date(blog.date).toISOString().split('T')[0]
        }));
        blogs.sort((a, b) => (new Date(a.date) - new Date(b.date)) * -1);
        res.status(200).json(blogs);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const sorted_blogs_title = async (req, res) => {
    try {
        //dont show disabled blogs
        const blogs = await Blog.find({ disabled: false }).sort({ title: 1 });
        res.status(200).json(blogs);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const add_rating = async (req, res) => {
    const title = req.params.title;
    const { ratings } = req.body;
    if (ratings > 5 || ratings < 0) {
        return res.status(404).send('Rating must be between 0 and 5');
    }
    try {
        const blog = await Blog.findOne({ title });
        if (!blog || blog.disabled === true) {
            return res.status(404).send('Blog not found');
        }
        blog.rating.push(ratings);
        let sum = 0;
        for (let i = 0; i < blog.rating.length; i++) {
            sum += blog.rating[i];
        }
        blog.avgrating = sum / blog.rating.length;
        await blog.save();
        res.status(200).json(blog);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const add_comment = async (req, res) => {
    const title = req.params.title;
    const { comments } = req.body;

    try {
        const blog = await Blog.findOne({ title });
        if (!blog || blog.disabled === true) {
            return res.status(404).send('Blog not found');
        }
        blog.comment.push(comments);
        blog.notifications.push(`You have a new comment on your blog`);
        await blog.save();
        res.status(200).json(blog);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const get_all_blogs_pagination = async (req, res) => {
    try {
        // Expecting the page number in the request body
        const { page = 1, limit = 3 } = req.body;

        // Ensure page and limit are positive integers
        const pageNumber = Math.max(1, parseInt(page, 10));
        const limitNumber = Math.max(1, parseInt(limit, 10));

        // Calculate the skip value
        const skip = (pageNumber - 1) * limitNumber;

        // Query the database
        const blogs = await Blog.find().skip(skip).limit(limitNumber);

        // Optionally, also return the total number of blogs for pagination
        const totalBlogs = await Blog.countDocuments();

        res.status(200).json({
            total: totalBlogs,
            totalPages: Math.ceil(totalBlogs / limitNumber),
            page: pageNumber,
            limit: limitNumber,
            blogs
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const update_blog = async (req, res) => {
    const title = req.params.title; // The title of the blog to update
    const { content } = req.body;
    const userId = req.user.id; // The username of the authenticated user

    try {
        const user = await User.findById(userId);
        const blog = await Blog.findOne({ title });

        if (!blog || blog.disabled === true) {
            return res.status(404).send('Blog not found');
        }

        if (blog.author !== user.username) {
            return res.status(403).send('User is not authorized to update this blog');
        }

        if (content) blog.content = content;

        blog.date = new Date().toLocaleDateString();

        await blog.save();
        res.status(200).send(`Blog titled "${title}" updated successfully`);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const delete_blog = async (req, res) => {
    const title = req.params.title;
    //const username = req.user.username;
    const userID = req.user.id;

    try {
        const user = await User.findById(userID);
        const blog = await Blog.findOne({ title });

        if (!blog) {
            return res.status(404).send('Blog not found');
        }

        if (blog.author !== user.username) {
            return res.status(403).send('User is not authorized to delete this blog');
        }

        await Blog.deleteOne({ title });
        res.status(200).send(`Blog titled "${title}" deleted successfully`);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const get_all_blogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ disabled: false });
        res.status(200).json(blogs);
    } catch (err) {
        res.status(500).send(err.message);
    }
};
//
const get_following_user_feed = async (req, res) => {
    const followerId = req.user.id;
    try {
        const follower = await User.findById(followerId);
        if (!follower || follower.disabled === true) {
            return res.status(404).send('User not found');
        }
        console.log(follower);

        const blogs = await Blog.find({ author: { $in: follower.following }, disabled: false });

        res.status(200).json(blogs);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

module.exports = {
    create_blog,
    update_blog,
    delete_blog,
    get_all_blogs,
    get_following_user_feed,
    get_all_blogs_pagination,
    get_all_blogs_of_user,
    notifications_user,
    search_blog_filter,
    sorted_blogs_date,
    sorted_blogs_title,
    add_rating,
    add_comment
};


