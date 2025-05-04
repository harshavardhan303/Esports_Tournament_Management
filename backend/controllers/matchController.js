const Match = require('../models/Match');
const Tournament = require('../models/Tournament');
const Registration = require('../models/Registration');

// @desc    Create a new match
// @route   POST /api/matches
// @access  Private/Organizer
const createMatch = async (req, res) => {
  try {
    const { tournamentId, teamAId, teamBId, date } = req.body;
    
    // Check if tournament exists
    const tournament = await Tournament.findById(tournamentId);
    
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }
    
    // Check if user is the tournament organizer or an admin
    if (tournament.organizerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to create matches for this tournament' });
    }
    
    // Check if both teams are registered for the tournament
    const teamA = await Registration.findOne({ _id: teamAId, tournamentId, status: 'approved' });
    const teamB = await Registration.findOne({ _id: teamBId, tournamentId, status: 'approved' });
    
    if (!teamA || !teamB) {
      return res.status(400).json({ message: 'One or both teams are not approved for this tournament' });
    }
    
    const match = await Match.create({
      tournamentId,
      teamA: teamAId,
      teamB: teamBId,
      date,
      status: 'scheduled'
    });
    
    if (match) {
      // Populate team information before sending response
      const populatedMatch = await Match.findById(match._id)
        .populate({
          path: 'teamA',
          select: 'teamName userId',
          populate: { path: 'userId', select: 'name' }
        })
        .populate({
          path: 'teamB',
          select: 'teamName userId',
          populate: { path: 'userId', select: 'name' }
        });
      
      res.status(201).json(populatedMatch);
    } else {
      res.status(400).json({ message: 'Invalid match data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all matches for a tournament
// @route   GET /api/matches/tournament/:id
// @access  Public
const getTournamentMatches = async (req, res) => {
  try {
    const matches = await Match.find({ tournamentId: req.params.id })
      .populate({
        path: 'teamA',
        select: 'teamName userId',
        populate: { path: 'userId', select: 'name' }
      })
      .populate({
        path: 'teamB',
        select: 'teamName userId',
        populate: { path: 'userId', select: 'name' }
      })
      .populate('winner', 'teamName')
      .sort({ date: 1 });
    
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single match by ID
// @route   GET /api/matches/:id
// @access  Public
const getMatchById = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate({
        path: 'teamA',
        select: 'teamName userId',
        populate: { path: 'userId', select: 'name' }
      })
      .populate({
        path: 'teamB',
        select: 'teamName userId',
        populate: { path: 'userId', select: 'name' }
      })
      .populate('winner', 'teamName')
      .populate('tournamentId', 'name');
    
    if (match) {
      res.json(match);
    } else {
      res.status(404).json({ message: 'Match not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update match results
// @route   PUT /api/matches/:id
// @access  Private/Organizer
const updateMatchResults = async (req, res) => {
  try {
    const { scoreA, scoreB, status } = req.body;
    
    const match = await Match.findById(req.params.id);
    
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    
    // Check if user is the tournament organizer or an admin
    const tournament = await Tournament.findById(match.tournamentId);
    
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }
    
    if (tournament.organizerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this match' });
    }
    
    // Update match details
    match.scoreA = scoreA !== undefined ? scoreA : match.scoreA;
    match.scoreB = scoreB !== undefined ? scoreB : match.scoreB;
    
    if (status) {
      match.status = status;
    }
    
    // If match is completed, determine the winner
    if (status === 'completed') {
      if (match.scoreA > match.scoreB) {
        match.winner = match.teamA;
      } else if (match.scoreB > match.scoreA) {
        match.winner = match.teamB;
      }
      // If scores are equal, no winner is set (draw)
    }
    
    const updatedMatch = await match.save();
    
    // Populate team information before sending response
    const populatedMatch = await Match.findById(updatedMatch._id)
      .populate({
        path: 'teamA',
        select: 'teamName userId',
        populate: { path: 'userId', select: 'name' }
      })
      .populate({
        path: 'teamB',
        select: 'teamName userId',
        populate: { path: 'userId', select: 'name' }
      })
      .populate('winner', 'teamName');
    
    res.json(populatedMatch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a match
// @route   DELETE /api/matches/:id
// @access  Private/Organizer
const deleteMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    
    // Check if user is the tournament organizer or an admin
    const tournament = await Tournament.findById(match.tournamentId);
    
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }
    
    if (tournament.organizerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this match' });
    }
    
    // Only allow deletion of scheduled matches
    if (match.status !== 'scheduled') {
      return res.status(400).json({ message: 'Cannot delete an ongoing or completed match' });
    }
    
    await match.remove();
    res.json({ message: 'Match removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get matches for a player
// @route   GET /api/matches/player
// @access  Private
const getPlayerMatches = async (req, res) => {
  try {
    // Find all registrations for the player
    const registrations = await Registration.find({ userId: req.user._id });
    
    if (registrations.length === 0) {
      return res.json([]);
    }
    
    const registrationIds = registrations.map(reg => reg._id);
    
    // Find all matches where the player is part of teamA or teamB
    const matches = await Match.find({
      $or: [
        { teamA: { $in: registrationIds } },
        { teamB: { $in: registrationIds } }
      ]
    })
      .populate({
        path: 'teamA',
        select: 'teamName userId',
        populate: { path: 'userId', select: 'name' }
      })
      .populate({
        path: 'teamB',
        select: 'teamName userId',
        populate: { path: 'userId', select: 'name' }
      })
      .populate('winner', 'teamName')
      .populate('tournamentId', 'name')
      .sort({ date: 1 });
    
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createMatch,
  getTournamentMatches,
  getMatchById,
  updateMatchResults,
  deleteMatch,
  getPlayerMatches,
};
