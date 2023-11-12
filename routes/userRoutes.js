const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const { authenticate_user } = require('../middleware/authMiddleware');
const {signup_user, login_user, update_credentials_user, follow_user} = require('../controller/userController');

// Route to handle user signup
router.post('/signup_user', userController.signup_user);

// Route to handle user login
router.post('/login_user', userController.login_user);

// Route to handle updating user credentials, protected by authentication middleware
router.post('/update_credentials_user', authenticate_user, userController.update_credentials_user);

// Route to handle the following of another user, protected by authentication middleware
router.put('/follow_user', authenticate_user, userController.follow_user);

module.exports = router;
