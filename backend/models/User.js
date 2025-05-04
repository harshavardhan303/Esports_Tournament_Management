const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  username: {
    type: String,
    unique: true,
    sparse: true,
    default: undefined
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['player', 'organizer', 'admin'], 
    default: 'player' 
  },
  profileImageUrl: { 
    type: String, 
    default: 'IMAGE_USER_PROFILE' 
  },
  status: {
    type: String,
    enum: ['active', 'blocked'],
    default: 'active'
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('User', UserSchema);
