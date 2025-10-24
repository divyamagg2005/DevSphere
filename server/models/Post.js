const mongoose = require('mongoose');

// Demonstrating MongoDB's flexible schema with nested documents
const postSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  caption: {
    type: String,
    required: true,
    trim: true
  },
  mediaUrl: {
    type: String,
    default: ''
  },
  mediaType: {
    type: String,
    enum: ['none', 'image', 'video', 'gif'],
    default: 'none'
  },
  tags: {
    type: [String],
    default: []
  },
  likes: {
    type: Number,
    default: 0
  },
  likedBy: {
    type: [String],
    default: []
  },
  // Nested array of subdocuments - demonstrates MongoDB's flexibility
  comments: [
    {
      username: {
        type: String,
        required: true
      },
      text: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Post', postSchema);
