const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController');
const { authenticate_admin } = require('../middleware/authMiddleware');

// Route for admin signup
router.post('/signup_admin', adminController.signup_admin);

// Route for admin login
router.post('/login_admin', adminController.login_admin);

// Route to view all users, protected by admin authentication middleware
router.get('/view_all_users', authenticate_admin, adminController.view_all_users);

// Route to get all blogs as admin, protected by admin authentication middleware
router.get('/get_all_blogs_admin', authenticate_admin, adminController.get_all_blogs_admin);

// Route to disable a user, protected by admin authentication middleware
router.post('/disable_user/:username', authenticate_admin, adminController.disable_user);

// Route to enable a user, protected by admin authentication middleware
router.post('/enable_user/:username', authenticate_admin, adminController.enable_user);

// Route to get a blog post by title, protected by admin authentication middleware
router.get('/get_blog_post/:title', authenticate_admin, adminController.get_blog_post_by_title);

// Route to enable a blog post, protected by admin authentication middleware
router.put('/get_blog_post/:title/enable', authenticate_admin, adminController.enable_blog_post);

// Route to disable a blog post, protected by admin authentication middleware
router.put('/get_blog_post/:title/disable', authenticate_admin, adminController.disable_blog_post);

// Route to update admin credentials, protected by admin authentication middleware
router.put('/update_credentials_admin', authenticate_admin, adminController.update_credentials_admin);

module.exports = router;
