const express = require('express');
const router = express.Router();
const { 
  createGame, 
  getGames, 
  getGameById, 
  updateGame, 
  deleteGame, 
  getGameTournaments 
} = require('../controllers/gameController');
const { protect, admin, organizer } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getGames);
router.get('/:id', getGameById);
router.get('/:id/tournaments', getGameTournaments);

// Organizer routes
router.post('/', protect, organizer, createGame);
router.put('/:id', protect, organizer, updateGame);

// Admin routes
router.delete('/:id', protect, admin, deleteGame);

module.exports = router;
