const express = require('express');
const router = express.Router();
const { 
  createTournament, 
  getTournaments, 
  getTournamentById, 
  updateTournament, 
  deleteTournament, 
  getOrganizerTournaments, 
  getTournamentStats 
} = require('../controllers/tournamentController');
const { protect, admin, organizer } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getTournaments);

// Organizer routes
router.get('/organizer/mytournaments', protect, organizer, getOrganizerTournaments);

// Admin routes
router.get('/admin/stats', protect, admin, getTournamentStats);

// Routes with parameters
router.get('/:id', getTournamentById);
router.post('/', protect, organizer, createTournament);
router.put('/:id', protect, organizer, updateTournament);
router.delete('/:id', protect, organizer, deleteTournament);

module.exports = router;
