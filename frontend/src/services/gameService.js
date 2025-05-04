import api from './api';

// Get all games
export const getAllGames = async () => {
  try {
    const response = await api.get('/games');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch games' };
  }
};

// Get game by ID
export const getGameById = async (id) => {
  try {
    const response = await api.get(`/games/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch game' };
  }
};

// Create new game (organizer only)
export const createGame = async (gameData) => {
  try {
    const response = await api.post('/games', gameData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create game' };
  }
};

// Update game (organizer only)
export const updateGame = async (id, gameData) => {
  try {
    const response = await api.put(`/games/${id}`, gameData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update game' };
  }
};

// Get tournaments by game ID
export const getGameTournaments = async (gameId) => {
  try {
    const response = await api.get(`/games/${gameId}/tournaments`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch tournaments for this game' };
  }
};
