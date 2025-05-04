const Registration = require('../models/Registration');
const Tournament = require('../models/Tournament');

// @desc    Register for a tournament
// @route   POST /api/registrations
// @access  Private/Player
const registerForTournament = async (req, res) => {
  try {
    const { tournamentId, teamName } = req.body;
    
    // Check if tournament exists and is open for registration
    const tournament = await Tournament.findById(tournamentId);
    
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }
    
    if (!tournament.registrationOpen) {
      return res.status(400).json({ message: 'Registration for this tournament is closed' });
    }
    
    // Check if user is already registered
    const existingRegistration = await Registration.findOne({
      userId: req.user._id,
      tournamentId
    });
    
    if (existingRegistration) {
      return res.status(400).json({ message: 'You are already registered for this tournament' });
    }
    
    const registration = await Registration.create({
      userId: req.user._id,
      tournamentId,
      teamName: teamName || `${req.user.name}'s Team`,
      status: 'pending'
    });
    
    if (registration) {
      res.status(201).json(registration);
    } else {
      res.status(400).json({ message: 'Invalid registration data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all registrations for a tournament
// @route   GET /api/registrations/tournament/:id
// @access  Private/Organizer
const getTournamentRegistrations = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }
    
    // Check if user is the organizer or an admin
    if (tournament.organizerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view these registrations' });
    }
    
    const registrations = await Registration.find({ tournamentId: req.params.id })
      .populate('userId', 'name email profileImageUrl')
      .sort({ createdAt: -1 });
    
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's registrations
// @route   GET /api/registrations/myregistrations
// @access  Private
const getUserRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ userId: req.user._id })
      .populate({
        path: 'tournamentId',
        select: 'name dates status imageUrl',
        populate: {
          path: 'gameId',
          select: 'name'
        }
      })
      .sort({ createdAt: -1 });
    
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update registration status
// @route   PUT /api/registrations/:id
// @access  Private/Organizer
const updateRegistrationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const registration = await Registration.findById(req.params.id);
    
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    
    // Check if user is the tournament organizer or an admin
    const tournament = await Tournament.findById(registration.tournamentId);
    
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }
    
    if (tournament.organizerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this registration' });
    }
    
    registration.status = status;
    const updatedRegistration = await registration.save();
    
    res.json(updatedRegistration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel registration
// @route   DELETE /api/registrations/:id
// @access  Private
const cancelRegistration = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    
    // Check if user is the one who registered or an admin
    if (registration.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this registration' });
    }
    
    // Check if tournament is already ongoing or completed
    const tournament = await Tournament.findById(registration.tournamentId);
    
    if (tournament && tournament.status !== 'upcoming') {
      return res.status(400).json({ message: 'Cannot cancel registration for an ongoing or completed tournament' });
    }
    
    await registration.remove();
    res.json({ message: 'Registration cancelled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerForTournament,
  getTournamentRegistrations,
  getUserRegistrations,
  updateRegistrationStatus,
  cancelRegistration,
};
