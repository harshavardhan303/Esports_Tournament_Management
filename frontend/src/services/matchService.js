import api from './api';

// Create a new match (organizer only)
export const createMatch = async (matchData) => {
  try {
    const response = await api.post('/api/matches', matchData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create match' };
  }
};

// Get tournament matches
export const getTournamentMatches = async (tournamentId) => {
  try {
    const response = await api.get(`/api/matches/tournament/${tournamentId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch tournament matches' };
  }
};

// Get match by ID
export const getMatchById = async (matchId) => {
  try {
    const response = await api.get(`/api/matches/${matchId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch match details' };
  }
};

// Update match results (organizer only)
export const updateMatchResults = async (matchId, matchData) => {
  try {
    const response = await api.put(`/api/matches/${matchId}`, matchData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update match results' };
  }
};

// Delete match (organizer only)
export const deleteMatch = async (matchId) => {
  try {
    const response = await api.delete(`/api/matches/${matchId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete match' };
  }
};

// Get player's matches
export const getPlayerMatches = async () => {
  try {
    const response = await api.get('/api/matches/player/mymatches');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch your matches' };
  }
};
