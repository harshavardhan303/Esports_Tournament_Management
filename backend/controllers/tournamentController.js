
const Tournament = require('../models/Tournament');
const Registration = require('../models/Registration');
const Match = require('../models/Match');

// @desc    Create a new tournament
// @route   POST /api/tournaments
// @access  Private/Organizer
const getStatusFromDates = (start, end) => {
  const now = new Date();
  const startDate = new Date(start);
  const endDate = new Date(end);
  console.log(`Calculating status with now=${now.toISOString()}, start=${startDate.toISOString()}, end=${endDate.toISOString()}`);
  if (now < startDate) {
    return 'upcoming';
  } else if (now >= startDate && now <= endDate) {
    return 'ongoing';
  } else {
    return 'completed';
  }
};

// @desc    Create a new tournament
// @route   POST /api/tournaments
// @access  Private/Organizer
const createTournament = async (req, res) => {
  try {
    const { 
      name, 
      gameId, 
      format, 
      startDate, 
      endDate, 
      rules, 
      imageUrl 
    } = req.body;

    const status = getStatusFromDates(startDate, endDate);

    const tournament = await Tournament.create({
      name,
      gameId,
      organizerId: req.user._id,
      format,
      dates: {
        start: startDate,
        end: endDate
      },
      rules,
      imageUrl: imageUrl || `IMAGE_TOURNAMENT_${Math.floor(Math.random() * 5) + 1}`,
      status
    });

    if (tournament) {
      res.status(201).json(tournament);
    } else {
      res.status(400).json({ message: 'Invalid tournament data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all tournaments
// @route   GET /api/tournaments
// @access  Public
const getTournaments = async (req, res) => {
  try {
    let tournaments = await Tournament.find({})
      .populate('gameId', 'name')
      .populate('organizerId', 'name');
    
    // Update status based on current date
    const updatedTournaments = await Promise.all(tournaments.map(async (tournament) => {
      const newStatus = getStatusFromDates(tournament.dates.start, tournament.dates.end);
      if (tournament.status !== newStatus) {
        tournament.status = newStatus;
        await tournament.save();
      }
      return tournament;
    }));
    
    res.json(updatedTournaments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single tournament by ID
// @route   GET /api/tournaments/:id
// @access  Public
const getTournamentById = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id)
      .populate('gameId', 'name description imageUrl')
      .populate('organizerId', 'name');
    
    if (tournament) {
      res.json(tournament);
    } else {
      res.status(404).json({ message: 'Tournament not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a tournament
// @route   PUT /api/tournaments/:id
// @access  Private/Organizer
const updateTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }
    
    // Check if user is the organizer or an admin
    if (tournament.organizerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this tournament' });
    }
    
    const { 
      name, 
      format, 
      startDate, 
      endDate, 
      rules, 
      imageUrl,
      registrationOpen 
    } = req.body;
    
    tournament.name = name || tournament.name;
    tournament.format = format || tournament.format;
    tournament.rules = rules || tournament.rules;
    tournament.imageUrl = imageUrl || tournament.imageUrl;
    
    if (startDate) tournament.dates.start = startDate;
    if (endDate) tournament.dates.end = endDate;

    // Always update status based on current dates
    const start = tournament.dates.start;
    const end = tournament.dates.end;
    const newStatus = getStatusFromDates(start, end);
    console.log(`Updating tournament status from ${tournament.status} to ${newStatus}`);
    tournament.status = newStatus;
    
    if (registrationOpen !== undefined) tournament.registrationOpen = registrationOpen;
    
    const updatedTournament = await tournament.save();
    res.json(updatedTournament);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a tournament
// @route   DELETE /api/tournaments/:id
// @access  Private/Organizer
const deleteTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }
    
    // Check if user is the organizer or an admin
    if (tournament.organizerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this tournament' });
    }
    
    // Delete all registrations and matches associated with this tournament
    await Registration.deleteMany({ tournamentId: req.params.id });
    await Match.deleteMany({ tournamentId: req.params.id });
    
    await tournament.remove();
    res.json({ message: 'Tournament removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get tournaments by organizer ID
// @route   GET /api/tournaments/organizer
// @access  Private/Organizer
const getOrganizerTournaments = async (req, res) => {
  try {
    let tournaments = await Tournament.find({ organizerId: req.user._id })
      .populate('gameId', 'name')
      .sort({ createdAt: -1 });
    
    // Update status based on current date
    const updatedTournaments = await Promise.all(tournaments.map(async (tournament) => {
      const newStatus = getStatusFromDates(tournament.dates.start, tournament.dates.end);
      if (tournament.status !== newStatus) {
        tournament.status = newStatus;
        await tournament.save();
      }
      return tournament;
    }));
    
    res.json(updatedTournaments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get tournament statistics
// @route   GET /api/tournaments/stats
// @access  Private/Admin
const getTournamentStats = async (req, res) => {
  try {
    const totalTournaments = await Tournament.countDocuments();
    const upcomingTournaments = await Tournament.countDocuments({ status: 'upcoming' });
    const ongoingTournaments = await Tournament.countDocuments({ status: 'ongoing' });
    const completedTournaments = await Tournament.countDocuments({ status: 'completed' });
    
    const totalRegistrations = await Registration.countDocuments();
    const totalMatches = await Match.countDocuments();
    
    res.json({
      totalTournaments,
      upcomingTournaments,
      ongoingTournaments,
      completedTournaments,
      totalRegistrations,
      totalMatches
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTournament,
  getTournaments,
  getTournamentById,
  updateTournament,
  deleteTournament,
  getOrganizerTournaments,
  getTournamentStats,
};
