const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
  tournamentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Tournament', 
    required: true 
  },
  teamA: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Registration', 
    required: true 
  },
  teamB: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Registration', 
    required: true 
  },
  scoreA: { 
    type: Number, 
    default: 0 
  },
  scoreB: { 
    type: Number, 
    default: 0 
  },
  date: { 
    type: Date, 
    required: true 
  },
  winner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Registration' 
  },
  status: {
    type: String,
    enum: ['scheduled', 'ongoing', 'completed'],
    default: 'scheduled'
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Match', MatchSchema);
