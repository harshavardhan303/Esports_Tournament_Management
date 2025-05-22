import api from './api';

// Get all tournaments
export const getAllTournaments = async () => {
  try {
    const response = await api.get('/api/tournaments');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch tournaments' };
  }
};

// Get tournament by ID
export const getTournamentById = async (id) => {
  try {
    const response = await api.get(`/api/tournaments/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch tournament' };
  }
};

// Create new tournament (organizer only)
export const createTournament = async (tournamentData) => {
  try {
    const response = await api.post('/api/tournaments', tournamentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create tournament' };
  }
};

// Update tournament (organizer only)
export const updateTournament = async (id, tournamentData) => {
  try {
    const response = await api.put(`/api/tournaments/${id}`, tournamentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update tournament' };
  }
};

// Delete tournament (organizer only)
export const deleteTournament = async (id) => {
  try {
    const response = await api.delete(`/api/tournaments/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete tournament' };
  }
};

// Get organizer's tournaments
export const getOrganizerTournaments = async () => {
  try {
    const response = await api.get('/api/tournaments/organizer/mytournaments');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch your tournaments' };
  }
};

// Get tournament statistics (admin only)
export const getTournamentStats = async () => {
  try {
    const response = await api.get('/api/tournaments/admin/stats');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch tournament statistics' };
  }
};
