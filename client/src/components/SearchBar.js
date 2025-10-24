import { useState } from 'react';

export default function SearchBar({ onSearch, onClear }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      alert('Please enter a search query');
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/search?query=${encodeURIComponent(
          searchQuery
        )}&type=${searchType}`
      );
      const data = await response.json();

      if (data.success) {
        onSearch(data.posts, data.count, searchQuery, searchType);
      } else {
        alert('Error searching: ' + data.message);
      }
    } catch (error) {
      console.error('Error searching:', error);
      alert('Error searching posts. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    setSearchType('all');
    onClear();
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 mb-6">
      <h3 className="text-lg font-bold text-white mb-4">🔍 Search Posts</h3>
      <form onSubmit={handleSearch} className="space-y-3">
        <div>
          <label className="block text-gray-300 mb-2 font-medium">Search Type</label>
          <div className="flex gap-2">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="searchType"
                value="all"
                checked={searchType === 'all'}
                onChange={(e) => setSearchType(e.target.value)}
                className="mr-2"
              />
              <span className="text-gray-300">All</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="searchType"
                value="username"
                checked={searchType === 'username'}
                onChange={(e) => setSearchType(e.target.value)}
                className="mr-2"
              />
              <span className="text-gray-300">Username</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="searchType"
                value="tags"
                checked={searchType === 'tags'}
                onChange={(e) => setSearchType(e.target.value)}
                className="mr-2"
              />
              <span className="text-gray-300">Tags</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-gray-300 mb-2 font-medium">
            {searchType === 'username' && 'Username'}
            {searchType === 'tags' && 'Tags (comma-separated)'}
            {searchType === 'all' && 'Search Query'}
          </label>
          <p className="text-gray-400 text-xs mb-2">
            {searchType === 'tags' && 'Use OR logic: e.g., "react, mongodb, nodejs"'}
            {searchType === 'all' && 'Search username or tags (comma-separated)'}
          </p>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              searchType === 'username'
                ? 'e.g., SwiftPanda'
                : searchType === 'tags'
                ? 'e.g., react, mongodb, nodejs'
                : 'e.g., SwiftPanda or react, mongodb'
            }
            className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isSearching}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}
