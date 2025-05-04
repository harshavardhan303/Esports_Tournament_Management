const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true 
  },
  description: { 
    type: String 
  },
  imageUrl: { 
    type: String, 
    default: 'IMAGE_GAME_1' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Game', GameSchema);
