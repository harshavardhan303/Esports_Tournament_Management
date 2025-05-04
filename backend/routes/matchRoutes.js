const express = require('express');
const router = express.Router();
const { 
  createMatch, 
  getTournamentMatches, 
  getMatchById, 
  updateMatchResults, 
  deleteMatch, 
  getPlayerMatches 
} = require('../controllers/matchController');
const { protect, organizer } = require('../middleware/authMiddleware');

// Public routes
router.get('/tournament/:id', getTournamentMatches);

// Player routes
router.get('/player/mymatches', protect, getPlayerMatches);

// Organizer routes
router.post('/', protect, organizer, createMatch);

// Routes with parameters
router.get('/:id', getMatchById);
router.put('/:id', protect, organizer, updateMatchResults);
router.delete('/:id', protect, organizer, deleteMatch);

module.exports = router;
