const express = require('express');
const router = express.Router();
const blogController = require('../controller/blogController');
const { authenticate_user } = require('../middleware/authMiddleware');

// Route to create a new blog post, protected by authentication middleware
router.post('/create_blog', authenticate_user, blogController.create_blog);

// Route to update a blog post by title, protected by authentication middleware
router.patch('/update_blog/:title', authenticate_user, blogController.update_blog);

// Route to delete a blog post by title, protected by authentication middleware
router.delete('/delete_blog/:title', authenticate_user, blogController.delete_blog);

// Route to get all blogs, protected by authentication middleware
router.get('/get_all_blogs', authenticate_user, blogController.get_all_blogs);

// Route to get all blogs of a user, protected by authentication middleware
router.get('/get_all_blogs_of_user', authenticate_user, blogController.get_all_blogs_of_user);

// Route to get a user's following feed, protected by authentication middleware
router.get('/get_following_user_feed', authenticate_user, blogController.get_following_user_feed);

// Route for blog pagination, protected by authentication middleware
router.post('/get_all_blogs_pagination', authenticate_user, blogController.get_all_blogs_pagination);

// Route to get notifications for a user, protected by authentication middleware
router.get('/notifications_user', authenticate_user, blogController.notifications_user);

// Route to filter blogs by title, protected by authentication middleware
router.get('/search_blog_filter/:title', authenticate_user, blogController.search_blog_filter);

// Route to sort blogs by date, protected by authentication middleware
router.get('/sorted_blogs_date', authenticate_user, blogController.sorted_blogs_date);

// Route to sort blogs by title, protected by authentication middleware
router.get('/sorted_blogs_title', authenticate_user, blogController.sorted_blogs_title);

// Route to add a rating to a blog, protected by authentication middleware
router.put('/get_all_blogs/:title/ratings', authenticate_user, blogController.add_rating);

// Route to add a comment to a blog, protected by authentication middleware
router.put('/get_all_blogs/:title/comments', authenticate_user, blogController.add_comment);

module.exports = router;
