import api from './api';

// Register for a tournament
export const registerForTournament = async (registrationData) => {
  try {
    const response = await api.post('/registrations', registrationData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to register for tournament' };
  }
};

// Get user's registrations
export const getUserRegistrations = async () => {
  try {
    const response = await api.get('/registrations/myregistrations');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch your registrations' };
  }
};

// Get tournament registrations (organizer only)
export const getTournamentRegistrations = async (tournamentId) => {
  try {
    const response = await api.get(`/registrations/tournament/${tournamentId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch tournament registrations' };
  }
};

// Update registration status (organizer only)
export const updateRegistrationStatus = async (registrationId, status) => {
  try {
    const response = await api.put(`/registrations/${registrationId}`, { status });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update registration status' };
  }
};

// Cancel registration
export const cancelRegistration = async (registrationId) => {
  try {
    const response = await api.delete(`/registrations/${registrationId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to cancel registration' };
  }
};
