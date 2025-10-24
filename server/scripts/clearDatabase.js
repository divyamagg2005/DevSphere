require('dotenv').config();
const mongoose = require('mongoose');
const Post = require('../models/Post');
const User = require('../models/User');

const clearDatabase = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    console.log('\n🗑️  Clearing database...');

    // Clear Posts collection
    const postsDeleted = await Post.deleteMany({});
    console.log(`✅ Deleted ${postsDeleted.deletedCount} posts`);

    // Clear Users collection
    const usersDeleted = await User.deleteMany({});
    console.log(`✅ Deleted ${usersDeleted.deletedCount} users`);

    console.log('\n✨ Database cleared successfully!');
    console.log('📊 Database is now empty and ready for testing.');

    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    process.exit(1);
  }
};

clearDatabase();
