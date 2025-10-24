export default function Comment({ comment }) {
  const formatDate = (date) => {
    if (!date) return '';
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  if (!comment || !comment.username) {
    return null;
  }

  return (
    <div className="bg-gray-700 p-4 rounded-lg">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {comment.username[0].toUpperCase()}
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-white">{comment.username}</span>
            <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
          </div>
          <p className="text-gray-300 mt-1">{comment.text}</p>
        </div>
      </div>
    </div>
  );
}
