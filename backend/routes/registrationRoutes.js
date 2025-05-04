const express = require('express');
const router = express.Router();
const { 
  registerForTournament, 
  getTournamentRegistrations, 
  getUserRegistrations, 
  updateRegistrationStatus, 
  cancelRegistration 
} = require('../controllers/registrationController');
const { protect, organizer } = require('../middleware/authMiddleware');

// Player routes
router.get('/myregistrations', protect, getUserRegistrations);

// Organizer routes
router.get('/tournament/:id', protect, organizer, getTournamentRegistrations);

// Routes with parameters
router.post('/', protect, registerForTournament);
router.put('/:id', protect, organizer, updateRegistrationStatus);
router.delete('/:id', protect, cancelRegistration);

module.exports = router;
