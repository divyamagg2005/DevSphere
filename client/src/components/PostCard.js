import { useState, useEffect, useMemo } from 'react';
import Comment from './Comment';

export default function PostCard({ post, onUpdate, username }) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState({ text: '' });
  const [localLikes, setLocalLikes] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(false);
  const [localComments, setLocalComments] = useState(post.comments || []);
  const [loading, setLoading] = useState(false);

  // Memoize the likedBy array as a string for stable comparison
  const likedByString = useMemo(() => {
    return post.likedBy ? post.likedBy.join(',') : '';
  }, [post.likedBy]);

  // Update local likes when post changes
  useEffect(() => {
    setLocalLikes(post.likes);
  }, [post.likes]);

  // Initialize and update like state based on user's IP
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const userIP = localStorage.getItem('userIP');
    if (userIP && post.likedBy && Array.isArray(post.likedBy)) {
      const isUserLiked = post.likedBy.includes(userIP);
      setIsLiked(isUserLiked);
    } else {
      setIsLiked(false);
    }
  }, [post._id, likedByString]);

  const handleLike = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${post._id}/like`,
        { method: 'POST' }
      );
      const result = await response.json();
      if (result.success) {
        setLocalLikes(result.likes);
        setIsLiked(result.liked);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.text) {
      alert('Please enter a comment');
      return;
    }

    if (!username) {
      alert('Username not available. Please refresh the page.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${post._id}/comment`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, text: newComment.text }),
        }
      );
      const result = await response.json();
      if (result.success) {
        setLocalComments(result.comments);
        setNewComment({ text: '' });
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Error adding comment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700 transition-transform duration-300 hover:scale-[1.02]">
      {/* Post Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
            {post.username[0].toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-white">{post.username}</h3>
            <p className="text-sm text-gray-400">{formatDate(post.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* Post Media */}
      {post.mediaUrl && (
        <div className="relative w-full h-96 bg-black">
          {post.mediaType === 'video' ? (
            <video
              src={post.mediaUrl}
              controls
              className="w-full h-full object-cover"
            />
          ) : post.mediaType === 'gif' ? (
            <img
              src={post.mediaUrl}
              alt="Post GIF"
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={post.mediaUrl}
              alt="Post"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-white text-xs font-semibold">
            {post.mediaType?.toUpperCase() || 'MEDIA'}
          </div>
        </div>
      )}

      {/* Post Content */}
      <div className="p-4">
        <p className="text-gray-200 mb-3">{post.caption}</p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full hover:bg-blue-700 transition"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center space-x-6 pt-4 border-t border-gray-700">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 transition group ${
              isLiked
                ? 'text-red-500'
                : 'text-gray-300 hover:text-red-500'
            }`}
          >
            <svg
              className="w-6 h-6 group-hover:scale-110 transition-transform"
              fill={isLiked ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span className="font-semibold">{localLikes}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 text-gray-300 hover:text-blue-500 transition group"
          >
            <svg
              className="w-6 h-6 group-hover:scale-110 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span className="font-semibold">{localComments.length}</span>
          </button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-6 space-y-4">
            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
                <span>Commenting as:</span>
                <span className="font-semibold text-blue-400">{username || 'Loading...'}</span>
              </div>
              <textarea
                placeholder="Add a comment..."
                value={newComment.text}
                onChange={(e) =>
                  setNewComment({ text: e.target.value })
                }
                rows="2"
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
              />
              <button
                type="submit"
                disabled={loading || !username}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Posting...' : 'Post Comment'}
              </button>
            </form>

            {/* Comments List */}
            <div className="space-y-3">
              {localComments && localComments.length > 0 ? (
                localComments.map((comment, index) => (
                  <Comment key={`${post._id}-comment-${index}`} comment={comment} />
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
