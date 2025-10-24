# 🔍 Search Feature Documentation

## Overview
The search feature allows users to find posts by username or tags with flexible filtering options using MongoDB's query operators.

## Search Types

### 1. Search by Username
- **Type:** `username`
- **Description:** Search for posts by a specific user
- **Case-Insensitive:** Yes (matches "Swift", "swift", "SWIFT")
- **Example:** Search for "SwiftPanda" finds all posts by that user

**MongoDB Query:**
```javascript
{ username: { $regex: "query", $options: "i" } }
```

### 2. Search by Tags (OR Logic)
- **Type:** `tags`
- **Description:** Search for posts with any of the specified tags
- **Multiple Tags:** Comma-separated (e.g., "react, mongodb, nodejs")
- **Logic:** OR operator - matches posts with ANY of the tags
- **Case-Insensitive:** Yes (converts to lowercase)

**Example:**
- Query: "react, mongodb"
- Finds posts tagged with "react" OR "mongodb" OR both

**MongoDB Query:**
```javascript
{ tags: { $in: ["react", "mongodb"] } }
```

### 3. Search All (Combined)
- **Type:** `all`
- **Description:** Search both username and tags
- **Logic:** OR operator - matches username OR any tag
- **Example:** Search for "swift" finds posts by user "swift" OR posts tagged "swift"

**MongoDB Query:**
```javascript
{
  $or: [
    { username: { $regex: "swift", $options: "i" } },
    { tags: { $in: ["swift"] } }
  ]
}
```

## API Endpoint

### GET `/api/posts/search`

**Query Parameters:**
- `query` (required) - Search term or comma-separated tags
- `type` (required) - Search type: `username`, `tags`, or `all`

**Example Requests:**

```bash
# Search by username
GET /api/posts/search?query=SwiftPanda&type=username

# Search by tags (OR logic)
GET /api/posts/search?query=react,mongodb,nodejs&type=tags

# Search all
GET /api/posts/search?query=swift&type=all
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "query": "react, mongodb",
  "type": "tags",
  "posts": [
    {
      "_id": "...",
      "username": "SwiftPanda42",
      "caption": "Learning React",
      "tags": ["react", "javascript"],
      ...
    }
  ]
}
```

## Frontend Usage

### SearchBar Component

Located at: `client/src/components/SearchBar.js`

**Features:**
- Radio buttons to select search type
- Dynamic placeholder text based on search type
- Helper text explaining OR logic for tags
- Search and Clear buttons
- Loading state during search

**Props:**
- `onSearch(results, count, query, type)` - Called when search succeeds
- `onClear()` - Called when clearing search

### Integration

The search bar is integrated into the main page (`index.js`):

```javascript
<SearchBar onSearch={handleSearch} onClear={handleClearSearch} />
```

## Usage Examples

### Example 1: Find posts by specific user
1. Select "Username" radio button
2. Enter "SwiftPanda"
3. Click Search
4. Shows all posts by SwiftPanda42

### Example 2: Find posts with multiple tags
1. Select "Tags" radio button
2. Enter "react, mongodb, nodejs"
3. Click Search
4. Shows posts tagged with ANY of: react, mongodb, or nodejs

### Example 3: Find posts by user or tag
1. Select "All" radio button
2. Enter "swift"
3. Click Search
4. Shows posts by user "swift" OR tagged "swift"

## MongoDB Operators Used

### $regex
- Pattern matching with options
- `$options: "i"` for case-insensitive search

### $in
- Matches any value in an array
- Used for OR logic on tags

### $or
- Logical OR operator
- Combines multiple conditions

## Search Results Display

**When searching:**
- Shows search info banner with query and type
- Displays result count
- Shows matching posts in feed
- "No results found" message if empty

**Clear Search:**
- Returns to showing all posts
- Resets search state

## Performance Considerations

### Indexing
For better search performance, consider adding MongoDB indexes:

```javascript
// Index on username for faster searches
db.posts.createIndex({ username: 1 })

// Index on tags for faster tag searches
db.posts.createIndex({ tags: 1 })
```

### Query Optimization
- Username search uses regex (efficient with index)
- Tag search uses $in operator (very efficient)
- Combined search uses $or with both methods

## Error Handling

### Validation
- Empty query: Returns error message
- Invalid search type: Returns error message
- No results: Shows "No results found" message

### Error Messages
```json
{
  "success": false,
  "message": "Search query is required"
}
```

## Future Enhancements

1. **Advanced Filters**
   - Search by date range
   - Search by like count
   - Search by comment count

2. **Search Suggestions**
   - Auto-complete for usernames
   - Popular tags suggestions

3. **Search History**
   - Save recent searches
   - Quick access to previous searches

4. **Full-Text Search**
   - Search in captions
   - Search in comments

5. **Sorting Options**
   - Sort by date (newest/oldest)
   - Sort by likes (most/least)
   - Sort by comments

## Testing

### Test Cases

**Username Search:**
- [ ] Search existing username
- [ ] Search non-existent username
- [ ] Case-insensitive search
- [ ] Partial username match

**Tag Search:**
- [ ] Single tag search
- [ ] Multiple tags (OR logic)
- [ ] Non-existent tag
- [ ] Case-insensitive tags

**All Search:**
- [ ] Search username
- [ ] Search tag
- [ ] Search both

**Edge Cases:**
- [ ] Empty search query
- [ ] Special characters
- [ ] Very long query
- [ ] Whitespace handling

## Troubleshooting

### Issue: No results found
- Check spelling of username/tags
- Verify posts exist with those tags
- Try different search type

### Issue: Search not working
- Check backend is running
- Check API URL in frontend
- Check browser console for errors

### Issue: Slow search
- Check MongoDB indexes
- Reduce query complexity
- Check database size
