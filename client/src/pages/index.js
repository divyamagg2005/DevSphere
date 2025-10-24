import { useState, useEffect } from 'react';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import SearchBar from '../components/SearchBar';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState(null);
  const [usernameLoading, setUsernameLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [searchInfo, setSearchInfo] = useState(null);

  const fetchUsername = async () => {
    try {
      setUsernameLoading(true);
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/username`;
      console.log('📡 Fetching username from:', apiUrl);
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setUsername(data.username);
        // Store IP in localStorage for like tracking
        if (response.headers.get('x-user-ip')) {
          localStorage.setItem('userIP', response.headers.get('x-user-ip'));
        }
        if (data.isNew) {
          console.log('✨ New user created with username:', data.username);
        } else {
          console.log('👋 Welcome back,', data.username);
        }
      } else {
        setError('Failed to get username: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('❌ Error fetching username:', error);
      setError(`❌ Backend Error: ${error.message}. Make sure the backend is running on ${process.env.NEXT_PUBLIC_API_URL}`);
    } finally {
      setUsernameLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/posts`;
      console.log('📡 Fetching posts from:', apiUrl);
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setPosts(data.posts);
      } else {
        setError('Failed to fetch posts: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('❌ Error fetching posts:', error);
      setError(`❌ Backend Error: ${error.message}. Make sure the backend is running on ${process.env.NEXT_PUBLIC_API_URL}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (results, count, query, type) => {
    setSearchResults(results);
    setSearchInfo({
      query,
      type,
      count
    });
    setIsSearching(true);
  };

  const handleClearSearch = () => {
    setSearchResults(null);
    setSearchInfo(null);
    setIsSearching(false);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    fetchUsername();
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">DevSphere</h1>
              <p className="text-gray-400 text-sm">MongoDB NoSQL Social Platform</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Post Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <PostForm onPostCreated={fetchPosts} username={username} />
              
              {/* Info Card */}
              <div className="mt-6 bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-3">📊 MongoDB Features</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span>Flexible schema design</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span>Nested documents (comments)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span>Array fields (tags)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span>Dynamic updates</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column - Posts Feed */}
          <div className="lg:col-span-2">
            <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />
            
            {isSearching && searchInfo && (
              <div className="bg-blue-900/50 border border-blue-700 text-blue-200 px-4 py-3 rounded-lg mb-6">
                <p className="font-semibold">
                  🔍 Search Results for "{searchInfo.query}" ({searchInfo.type})
                </p>
                <p className="text-sm mt-1">Found {searchInfo.count} post(s)</p>
                <button
                  onClick={handleClearSearch}
                  className="text-xs mt-2 px-3 py-1 bg-blue-700 hover:bg-blue-600 rounded transition"
                >
                  Clear Search
                </button>
              </div>
            )}

            <h2 className="text-2xl font-bold text-white mb-6">
              {isSearching ? 'Search Results' : 'Latest Posts'}
            </h2>
            
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}

            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-200 px-6 py-4 rounded-lg">
                <p className="font-semibold">⚠️ Error</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            )}

            {!loading && !error && !isSearching && posts.length === 0 && (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No posts yet</h3>
                <p className="text-gray-400">Be the first to create a post!</p>
              </div>
            )}

            {!loading && !error && isSearching && searchResults && searchResults.length === 0 && (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
                <p className="text-gray-400">Try a different search query</p>
              </div>
            )}

            {!loading && !error && !isSearching && posts.length > 0 && (
              <div className="space-y-6">
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} onUpdate={fetchPosts} username={username} />
                ))}
              </div>
            )}

            {!loading && !error && isSearching && searchResults && searchResults.length > 0 && (
              <div className="space-y-6">
                {searchResults.map((post) => (
                  <PostCard key={post._id} post={post} onUpdate={fetchPosts} username={username} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-400">
          <p>Built with Next.js, TailwindCSS, Node.js, Express & MongoDB</p>
          <p className="text-sm mt-2">Demonstrating MongoDB's flexible NoSQL schema</p>
        </div>
      </footer>
    </div>
  );
}
