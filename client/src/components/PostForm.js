import { useState, useEffect } from 'react';

export default function PostForm({ onPostCreated, username }) {
  const [formData, setFormData] = useState({
    caption: '',
    tags: '',
  });
  const [media, setMedia] = useState(null);
  const [mediaType, setMediaType] = useState('none');
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMedia(file);
      const fileExtension = file.name.split('.').pop().toLowerCase();
      
      // Determine media type
      if (['mp4', 'avi', 'mov', 'mkv', 'webm', 'flv', 'wmv'].includes(fileExtension)) {
        setMediaType('video');
      } else if (['gif'].includes(fileExtension)) {
        setMediaType('gif');
      } else if (['jpg', 'jpeg', 'png', 'webp', 'bmp', 'svg'].includes(fileExtension)) {
        setMediaType('image');
      }
      
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('username', username);
    data.append('caption', formData.caption);
    data.append('tags', formData.tags);
    if (media) {
      data.append('media', media);
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`, {
        method: 'POST',
        body: data,
      });

      const result = await response.json();

      if (result.success) {
        setFormData({ caption: '', tags: '' });
        setMedia(null);
        setMediaType('none');
        setPreviewUrl(null);
        if (onPostCreated) onPostCreated();
      } else {
        alert('Error creating post: ' + result.message);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-2">Create New Post</h2>
      <div className="mb-4 p-3 bg-gray-700 rounded-lg border border-gray-600">
        <p className="text-gray-400 text-sm">Your Username:</p>
        <p className="text-blue-400 font-bold text-lg">{username || 'Loading...'}</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block text-gray-300 mb-2 font-medium">Caption</label>
          <textarea
            name="caption"
            value={formData.caption}
            onChange={handleChange}
            required
            rows="4"
            className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
            placeholder="What's on your mind?"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2 font-medium">Tags (comma separated)</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="e.g., javascript, react, mongodb"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2 font-medium">Media (optional)</label>
          <p className="text-gray-400 text-xs mb-2">Supports: Images (JPG, PNG, WebP), Videos (MP4, WebM), GIFs</p>
          <input
            type="file"
            accept="image/*,video/*,.gif"
            onChange={handleMediaChange}
            className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer"
          />
        </div>

        {previewUrl && (
          <div className="mt-4">
            {mediaType === 'video' ? (
              <video
                src={previewUrl}
                controls
                className="w-full h-64 object-cover rounded-lg border-2 border-gray-600 bg-black"
              />
            ) : (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-64 object-cover rounded-lg border-2 border-gray-600"
              />
            )}
            <p className="text-gray-400 text-xs mt-2">Type: {mediaType.toUpperCase()}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? 'Posting...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
}
