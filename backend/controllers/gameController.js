const Game = require('../models/Game');
const Tournament = require('../models/Tournament');

// @desc    Create a new game
// @route   POST /api/games
// @access  Private/Organizer
const createGame = async (req, res) => {
  try {
    const { name, description, imageUrl } = req.body;

    // Check if game already exists
    const gameExists = await Game.findOne({ name });
    if (gameExists) {
      return res.status(400).json({ message: 'Game already exists' });
    }

    const game = await Game.create({
      name,
      description,
      imageUrl: imageUrl || `IMAGE_GAME_${Math.floor(Math.random() * 5) + 1}`,
    });

    if (game) {
      res.status(201).json(game);
    } else {
      res.status(400).json({ message: 'Invalid game data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all games
// @route   GET /api/games
// @access  Public
const getGames = async (req, res) => {
  try {
    const games = await Game.find({});
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single game by ID
// @route   GET /api/games/:id
// @access  Public
const getGameById = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    
    if (game) {
      res.json(game);
    } else {
      res.status(404).json({ message: 'Game not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a game
// @route   PUT /api/games/:id
// @access  Private/Organizer
const updateGame = async (req, res) => {
  try {
    const { name, description, imageUrl } = req.body;
    
    const game = await Game.findById(req.params.id);
    
    if (game) {
      game.name = name || game.name;
      game.description = description || game.description;
      game.imageUrl = imageUrl || game.imageUrl;
      
      const updatedGame = await game.save();
      res.json(updatedGame);
    } else {
      res.status(404).json({ message: 'Game not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a game
// @route   DELETE /api/games/:id
// @access  Private/Admin
const deleteGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    
    if (game) {
      // Check if game has tournaments
      const tournaments = await Tournament.find({ gameId: req.params.id });
      
      if (tournaments.length > 0) {
        return res.status(400).json({ 
          message: 'Cannot delete game with associated tournaments. Delete the tournaments first.' 
        });
      }
      
      await game.remove();
      res.json({ message: 'Game removed' });
    } else {
      res.status(404).json({ message: 'Game not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get tournaments by game ID
// @route   GET /api/games/:id/tournaments
// @access  Public
const getGameTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.find({ gameId: req.params.id })
      .populate('gameId', 'name')
      .populate('organizerId', 'name');
    
    res.json(tournaments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createGame,
  getGames,
  getGameById,
  updateGame,
  deleteGame,
  getGameTournaments,
};
