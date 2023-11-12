const Admin = require('../models/Admin'); // Assuming you have an Admin.js in your models directory
const User = require('../models/User');
const Blog = require('../models/Blog');
const jwt = require('jsonwebtoken');
const SECRET_KEY = "mysecretkey";

const signup_admin = async (req, res) => {
    const { username, email, password } = req.body;
    const admin = new Admin({ username, email, password });
    await admin.save().then(() => {
        res.status(200).send(`Admin ${username} created`);
    }).catch((err) => {
        res.status(422).send(err.message);
    })
};

const login_admin = async (req, res) => {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (admin && password === admin.password) {
        const token = jwt.sign({ id: admin._id }, SECRET_KEY, { expiresIn: '1h' });
        res.cookie('auth_token', token);
        res.status(200).send(`Login Successful ${admin.username}`);

    } else {
        res.status(401).send('Invalid email or password');
    }
};

const view_all_users = async (req, res) => {
    try {
        const users = await User.find({}, 'username email disabled'); // Only select the 'username' and 'email' fields
        res.status(200).json(users);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const get_all_blogs_admin = async (req, res) => {
    try {
        const blogs = await Blog.find({}, 'title author date avgrating disabled'); // Only select the 'username' and 'email' fields
        res.status(200).json(blogs);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

const disable_user = async (req, res) => {
    const username = req.params.username;
    try {
        const users = await User.findOne({ username });
        if (!users) {
            return res.status(404).send('User not found');
        }
        users.disabled = true;
        await users.save();
        res.status(200).send(`User "${username}" disabled successfully`);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const enable_user = async (req, res) => {
    const username = req.params.username;
    try {
        const users = await User.findOne({ username });
        if (!users) {
            return res.status(404).send('User not found');
        }
        users.disabled = false;
        await users.save();
        res.status(200).send(`User "${username}" enabled successfully`);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const get_blog_post_by_title = async (req, res) => {
    const title = req.params.title;
    try {
        const blogs = await Blog.find({ title: { $regex: title, $options: 'i' } }, 'title author date avgrating disabled');
        res.status(200).json(blogs);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

const enable_blog_post = async (req, res) => {
    const title = req.params.title;
    const disabled = false;
    try {
        const blog = await Blog.findOne({ title });
        if (!blog) {
            return res.status(404).send('Blog not found');
        }
        blog.disabled = disabled;
        await blog.save();
        res.status(200).send(`Blog "${title}" enabled successfully`);
        res.status(200).json(blogs);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

const disable_blog_post = async (req, res) => {
    const title = req.params.title;
    const disabled = true;
    try {
        const blog = await Blog.findOne({ title });
        if (!blog) {
            return res.status(404).send('Blog not found');
        }
        blog.disabled = disabled;
        await blog.save();
        res.status(200).send(`Blog "${title}" disabled successfully`);
        res.status(200).json(blogs);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

const update_credentials_admin = async (req, res) => {
    const adminId = req.user.id;
    const { username, email, password } = req.body;

    try {
        const admin = await Admin.findById(adminId);

        if (username) admin.username = username;
        if (email) admin.email = email;
        if (password) admin.password = password;

        await admin.save();

        res.status(200).send('Credentials updated successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
};

module.exports = {
    signup_admin,
    login_admin,
    view_all_users,
    get_all_blogs_admin,
    disable_user,
    enable_user,
    get_blog_post_by_title,
    enable_blog_post,
    disable_blog_post,
    update_credentials_admin
};