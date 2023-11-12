// userController.js

const User = require('../models/User'); // Assuming you have a User.js in your models directory
const jwt = require('jsonwebtoken');
const SECRET_KEY = "mysecretkey";

const signup_user = async (req, res) => {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password, disabled: false, following: [] });
    try {
        await user.save();
        res.status(200).send(`User ${username} created`);
    } catch (err) {
        res.status(422).send(err.message);
    }
};

const login_user = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && password === user.password && !user.disabled) {
            const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1d' });
            res.cookie('auth_token', token);
            res.status(200).send(`Login Successful ${user.username}`);
        } else {
            res.status(401).send('Invalid email or password');
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const update_credentials_user = async (req, res) => {
    const userId = req.user.id;
    const { username, email, password } = req.body;
    try {
        const user = await User.findById(userId);
        if (username) user.username = username;
        if (email) user.email = email;
        if (password) user.password = password;
        await user.save();
        res.status(200).send('Credentials updated successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const follow_user = async (req, res) => {
    const { username } = req.body;
    const followerId = req.user.id;
    try {
        const follower = await User.findById(followerId);
        const userToFollow = await User.findOne({ username: username, disabled: false });

        if (!follower || follower.disabled) {
            return res.status(404).send('Follower user not found');
        }

        if (!userToFollow) {
            return res.status(404).send('User to follow not found');
        }

        if (follower.following.includes(username)) {
            return res.status(400).send('You are already following this user');
        }

        follower.following.push(username);
        await follower.save();

        res.status(200).send(`You (${follower.username}) are now following ${username}`);
    } catch (err) {
        res.status(500).send(err.message);
    }
};


module.exports = {
    signup_user,
    login_user,
    update_credentials_user,
    follow_user
};