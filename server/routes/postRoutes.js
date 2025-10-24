const express = require('express');
const router = express.Router();
const {
  createPost,
  getAllPosts,
  likePost,
  addComment,
  searchPosts
} = require('../controllers/postController');
const { getOrCreateUsername } = require('../controllers/userController');

// Post Routes
router.post('/posts', createPost);
router.get('/posts', getAllPosts);
router.get('/posts/search', searchPosts);
router.post('/posts/:id/like', likePost);
router.post('/posts/:id/comment', addComment);

// User Routes
router.get('/username', getOrCreateUsername);

module.exports = router;
