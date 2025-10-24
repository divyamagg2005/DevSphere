const User = require('../models/User');

// Generate a unique username from IP address
const generateUsername = (ipAddress) => {
  // Create a hash-like username from IP
  const hash = ipAddress
    .split('.')
    .reduce((acc, octet) => acc + parseInt(octet), 0);
  
  const adjectives = [
    'Swift', 'Bright', 'Clever', 'Happy', 'Keen', 'Lively', 'Noble',
    'Quick', 'Rare', 'Smart', 'Vivid', 'Wise', 'Bold', 'Cool',
    'Daring', 'Epic', 'Fresh', 'Grand', 'Heroic', 'Jolly'
  ];
  
  const animals = [
    'Panda', 'Eagle', 'Tiger', 'Wolf', 'Fox', 'Bear', 'Lion',
    'Shark', 'Phoenix', 'Dragon', 'Falcon', 'Raven', 'Owl',
    'Cheetah', 'Penguin', 'Dolphin', 'Butterfly', 'Hawk', 'Lynx', 'Otter'
  ];
  
  const adjIndex = Math.abs(hash) % adjectives.length;
  const animalIndex = Math.abs(hash * 7) % animals.length;
  const number = Math.abs(hash % 9999);
  
  return `${adjectives[adjIndex]}${animals[animalIndex]}${number}`;
};

// Get or create username for IP address
exports.getOrCreateUsername = async (req, res) => {
  try {
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

    // Check if user already exists
    let user = await User.findOne({ ipAddress });

    if (user) {
      return res.status(200).json({
        success: true,
        username: user.username,
        isNew: false
      });
    }

    // Generate new username
    let username = generateUsername(ipAddress);
    let attempts = 0;
    const maxAttempts = 10;

    // Ensure username is unique
    while (await User.findOne({ username }) && attempts < maxAttempts) {
      username = generateUsername(ipAddress + attempts);
      attempts++;
    }

    if (attempts >= maxAttempts) {
      return res.status(500).json({
        success: false,
        message: 'Could not generate unique username'
      });
    }

    // Create new user
    user = new User({
      ipAddress,
      username
    });

    await user.save();

    res.status(201).json({
      success: true,
      username: user.username,
      isNew: true
    });
  } catch (error) {
    console.error('Error getting/creating username:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing username',
      error: error.message
    });
  }
};
