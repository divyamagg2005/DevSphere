const Post = require('../models/Post');
const cloudinary = require('../config/cloudinary');

// Create a new post with optional media upload (images, videos, gifs, etc)
exports.createPost = async (req, res) => {
  try {
    const { username, caption, tags } = req.body;

    // Parse tags if it's a string
    let parsedTags = [];
    if (tags) {
      parsedTags = typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : tags;
    }

    let mediaUrl = '';
    let mediaType = 'none'; // none, image, video, gif

    // Handle media upload to Cloudinary (supports all file types)
    if (req.files && req.files.media) {
      const file = req.files.media;
      const fileExtension = file.name.split('.').pop().toLowerCase();
      
      // Determine resource type
      let resourceType = 'auto';
      if (['mp4', 'avi', 'mov', 'mkv', 'webm', 'flv', 'wmv'].includes(fileExtension)) {
        mediaType = 'video';
        resourceType = 'video';
      } else if (['gif'].includes(fileExtension)) {
        mediaType = 'gif';
        resourceType = 'image';
      } else if (['jpg', 'jpeg', 'png', 'webp', 'bmp', 'svg'].includes(fileExtension)) {
        mediaType = 'image';
        resourceType = 'image';
      }

      try {
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: 'devsphere',
          resource_type: resourceType,
          eager: resourceType === 'video' ? [{ format: 'mp4' }] : undefined
        });
        mediaUrl = result.secure_url;
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(400).json({
          success: false,
          message: 'Error uploading media to Cloudinary',
          error: uploadError.message
        });
      }
    }

    // Create post with flexible schema
    const post = new Post({
      username,
      caption,
      mediaUrl,
      mediaType,
      tags: parsedTags
    });

    await post.save();

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating post',
      error: error.message
    });
  }
};

// Get all posts (sorted by newest first)
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      posts
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching posts',
      error: error.message
    });
  }
};

// Like/Unlike a post (one like per IP address)
exports.likePost = async (req, res) => {
  try {
    const { id } = req.params;

    // Get client IP address
    const ipAddress = 
      req.headers['x-forwarded-for']?.split(',')[0].trim() ||
      req.headers['x-real-ip'] ||
      req.socket.remoteAddress ||
      req.connection.remoteAddress;

    if (!ipAddress) {
      return res.status(400).json({
        success: false,
        message: 'Could not determine IP address'
      });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if this IP has already liked the post
    const hasLiked = post.likedBy.includes(ipAddress);

    if (hasLiked) {
      // Unlike the post
      await Post.findByIdAndUpdate(
        id,
        {
          $inc: { likes: -1 },
          $pull: { likedBy: ipAddress }
        },
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: 'Post unliked successfully',
        liked: false,
        likes: post.likes - 1
      });
    } else {
      // Like the post
      const updatedPost = await Post.findByIdAndUpdate(
        id,
        {
          $inc: { likes: 1 },
          $push: { likedBy: ipAddress }
        },
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: 'Post liked successfully',
        liked: true,
        likes: updatedPost.likes
      });
    }
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({
      success: false,
      message: 'Error liking post',
      error: error.message
    });
  }
};

// Add a comment to a post (demonstrates nested document updates)
exports.addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, text } = req.body;

    if (!username || !text) {
      return res.status(400).json({
        success: false,
        message: 'Username and comment text are required'
      });
    }

    const post = await Post.findByIdAndUpdate(
      id,
      {
        $push: {
          comments: {
            username,
            text,
            createdAt: new Date()
          }
        }
      },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Comment added successfully',
      comments: post.comments
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding comment',
      error: error.message
    });
  }
};

// Search posts by username or tags (OR operator)
exports.searchPosts = async (req, res) => {
  try {
    const { query, type } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    let searchQuery = {};

    if (type === 'username') {
      // Search by username (case-insensitive)
      searchQuery = {
        username: { $regex: query, $options: 'i' }
      };
    } else if (type === 'tags') {
      // Search by tags (OR operator - matches any tag, case-insensitive)
      const tagArray = query
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      if (tagArray.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'At least one tag is required'
        });
      }

      // Use case-insensitive regex for each tag
      searchQuery = {
        tags: { 
          $in: tagArray.map(tag => new RegExp(`^${tag}$`, 'i'))
        }
      };
    } else if (type === 'all') {
      // Search both username and tags (OR operator, case-insensitive)
      const tagArray = query
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const tagRegexArray = tagArray.length > 0 
        ? tagArray.map(tag => new RegExp(`^${tag}$`, 'i'))
        : [new RegExp(`^${query}$`, 'i')];

      searchQuery = {
        $or: [
          { username: { $regex: query, $options: 'i' } },
          { tags: { $in: tagRegexArray } }
        ]
      };
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid search type. Use: username, tags, or all'
      });
    }

    const posts = await Post.find(searchQuery).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      query,
      type,
      posts
    });
  } catch (error) {
    console.error('Error searching posts:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching posts',
      error: error.message
    });
  }
};
