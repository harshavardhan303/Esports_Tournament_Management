const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();
console.log('Environment loaded, MongoDB URI:', process.env.MONGODB_URI ? 'URI exists' : 'URI missing');

async function fixIndexes() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    
    // Drop the problematic username index
    console.log('Dropping username index...');
    await db.collection('users').dropIndex('username_1');
    console.log('Username index dropped successfully');

    // Create a new sparse index for username
    console.log('Creating new sparse username index...');
    await db.collection('users').createIndex(
      { username: 1 }, 
      { unique: true, sparse: true, background: true }
    );
    console.log('New sparse username index created successfully');

    // Verify the indexes
    const indexes = await db.collection('users').indexes();
    console.log('Current indexes:');
    console.log(JSON.stringify(indexes, null, 2));

    console.log('Index fix completed successfully');
  } catch (error) {
    console.error('Error fixing indexes:', error);
  } finally {
    // Close the connection
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

fixIndexes();
