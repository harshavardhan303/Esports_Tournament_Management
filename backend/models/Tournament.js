const mongoose = require('mongoose');

const TournamentSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  gameId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Game', 
    required: true 
  },
  organizerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  format: { 
    type: String, 
    required: true 
  },
  dates: {
    start: { type: Date, required: true },
    end: { type: Date, required: true }
  },
  rules: { 
    type: String 
  },
  imageUrl: { 
    type: String, 
    default: 'IMAGE_TOURNAMENT_1' 
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed'],
    default: 'upcoming'
  },
  registrationOpen: {
    type: Boolean,
    default: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Tournament', TournamentSchema);
