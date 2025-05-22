import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaTrophy, FaCalendarAlt, FaGamepad, FaUser, FaUsers, FaEdit, FaTrash, FaSignInAlt, FaPlus } from 'react-icons/fa';
import { getTournamentById } from '../../services/tournamentService';
import { getTournamentMatches } from '../../services/matchService';
import { getTournamentRegistrations } from '../../services/registrationService';
import { registerForTournament } from '../../services/registrationService';
import { AuthContext } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';

const TournamentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const TournamentHeader = styled.div`
  display: flex;
  flex-direction: column;
  margin: 2rem 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const TournamentBanner = styled.div`
  height: 250px;
  background-image: url(${props => props.$image});
  background-size: cover;
  background-position: center;
  position: relative;
`;

const TournamentStatus = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.875rem;
  background-color: ${props => {
    switch (props.$status) {
      case 'upcoming': return '#28a745'; // green
      case 'ongoing': return '#fd7e14'; // orange/yellow
      case 'completed': return '#dc3545'; // red
      default: return '#6c757d';
    }
  }};
  color: white;
`;

const TournamentContent = styled.div`
  padding: 2rem;
`;

const TournamentTitle = styled.h1`
  font-size: 2.5rem;
  color: #1a2a6c;
  margin-bottom: 1rem;
`;

const TournamentMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-bottom: 1.5rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  color: #666;
  
  svg {
    margin-right: 0.5rem;
    color: #1a2a6c;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  color: #1a2a6c;
  margin: 2rem 0 1rem;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.75rem;
  }
`;

const ContentSection = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const RulesContent = styled.div`
  white-space: pre-line;
  line-height: 1.6;
  color: #444;
`;

const MatchesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const MatchCard = styled.div`
  background: ${props => props.status === 'completed' ? '#f8f9fa' : 'white'};
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const MatchHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
`;

const MatchDate = styled.div`
  display: flex;
  align-items: center;
  color: #666;
  font-size: 0.875rem;
  
  svg {
    margin-right: 0.5rem;
  }
`;

const MatchStatus = styled.div`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  background-color: ${props => {
    switch (props.status) {
      case 'scheduled': return '#e9ecef';
      case 'ongoing': return '#fff3cd';
      case 'completed': return '#d4edda';
      default: return '#e9ecef';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'scheduled': return '#495057';
      case 'ongoing': return '#856404';
      case 'completed': return '#155724';
      default: return '#495057';
    }
  }};
`;

const MatchTeams = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 1.5rem 0;
`;

const Team = styled.div`
  text-align: center;
  flex: 1;
`;

const TeamName = styled.div`
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${props => props.winner ? '#1a2a6c' : '#333'};
`;

const Score = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.winner ? '#1a2a6c' : '#333'};
`;

const Versus = styled.div`
  margin: 0 1rem;
  color: #aaa;
  font-weight: 600;
`;

const RegistrationModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
`;

const ModalTitle = styled.h3`
  font-size: 1.5rem;
  color: #1a2a6c;
  margin-bottom: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #1a2a6c;
    box-shadow: 0 0 0 2px rgba(26, 42, 108, 0.2);
  }
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const TournamentDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [tournament, setTournament] = useState(null);
  const [matches, setMatches] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [registering, setRegistering] = useState(false);
  const [registrationError, setRegistrationError] = useState(null);
  
  useEffect(() => {
    const fetchTournamentData = async () => {
      try {
        setLoading(true);
        let tournamentData;
        try {
          tournamentData = await getTournamentById(id);
          if (!tournamentData) {
            throw new Error('Tournament not found');
          }
        } catch (err) {
          console.error('Error fetching tournament:', err);
          // Use fallback tournament data if API call fails
          tournamentData = getFallbackTournament(id);
        }
        setTournament(tournamentData);
        
        // Fetch matches if tournament exists
        let matchesData = [];
        try {
          matchesData = await getTournamentMatches(id);
        } catch (err) {
          console.error('Error fetching matches:', err);
          // Use fallback matches if API call fails
          matchesData = getFallbackMatches(id);
        }
        setMatches(matchesData);
        
        // Fetch registrations if user is organizer or admin
        if (user && (user.role === 'organizer' || user.role === 'admin')) {
          let registrationsData = [];
          try {
          registrationsData = await getTournamentRegistrations(id);
        } catch (err) {
          console.error('Error fetching registrations:', err);
          // Use fallback registrations if API call fails
          if (typeof getFallbackRegistrations === 'function') {
            registrationsData = getFallbackRegistrations(id);
          } else {
            registrationsData = [];
          }
        }
        setRegistrations(registrationsData);
      }
      } catch (error) {
        console.error('Error fetching tournament data:', error);
        setError('Failed to load tournament details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTournamentData();
  }, [id, user]);

  
  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      setRegistering(true);
      setRegistrationError(null);
      
      await registerForTournament({
        tournamentId: id,
        teamName: teamName || `${user.name}'s Team`,
        email: user.email
      });
      
      setShowRegistrationModal(false);
      // Refresh tournament data
      const tournamentData = await getTournamentById(id);
      setTournament(tournamentData);
      
    } catch (error) {
      console.error('Registration error:', error);
      setRegistrationError(error.message || 'Failed to register for tournament');
    } finally {
      setRegistering(false);
    }
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (loading) {
    return <Loader fullPage text="Loading tournament details..." />;
  }
  
  if (error) {
    return (
      <TournamentContainer>
        <Alert type="danger">{error}</Alert>
        <Button as={Link} to="/games">
          Back to Games
        </Button>
      </TournamentContainer>
    );
  }
  
  if (!tournament) {
    return (
      <TournamentContainer>
        <Alert type="danger">Tournament not found</Alert>
        <Button as={Link} to="/games">
          Back to Games
        </Button>
      </TournamentContainer>
    );
  }
  
  const isOrganizer = user && user.id === tournament.organizerId._id;
  const isAdmin = user && user.role === 'admin';
  const canEdit = isOrganizer || isAdmin;

  const startDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);  // 7 days from now
  const endDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); 
  


  
  const getFallbackTournament = (tournamentId) => {
    const fallbackTournaments = [
      {
        _id: 'tournament1',
        name: 'Valorant Championship 2025',
        gameId: 'game1',
        game: {
          _id: 'game1',
          name: 'Valorant',
          imageUrl: 'https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt3f072336e3f3ade4/63096d7be4a8c30e088e7720/Valorant_2022_E5A2_PlayVALORANT_ContentStackThumbnail_1200x625_MB01.png'
        },
        format: 'Single Elimination',
        
        rules: '1. All players must be at least 16 years old\n2. Teams must have exactly 5 players\n3. All players must use the tournament client\n4. Match rules follow official Valorant competitive guidelines',
        imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        status: status,
        registrationOpen: true,
        organizer: {
          _id: 'org1',
          name: 'Esports Organization'
        }
      },
      {
        _id: 'tournament2',
        name: 'League of Legends World Cup',
        gameId: 'game2',
        game: {
          _id: 'game2',
          name: 'League of Legends',
          imageUrl: 'https://cdn1.epicgames.com/offer/24b9b5e323bc40eea252a10cdd3b2f10/EGS_LeagueofLegends_RiotGames_S1_2560x1440-80471666c140f790f28dff68d72c384b'
        },
        format: 'Double Elimination',
        startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
        rules: '1. All players must be at least 16 years old\n2. Teams must have exactly 5 players\n3. All players must use the tournament client\n4. Match rules follow official LoL competitive guidelines',
        imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        status: 'upcoming',
        registrationOpen: true,
        organizer: {
          _id: 'org1',
          name: 'Esports Organization'
        }
      }
    ];
    
    return fallbackTournaments.find(t => t._id === tournamentId) || fallbackTournaments[0];
  };
  
  const getFallbackMatches = (tournamentId) => {
    return [
      {
        _id: `match1_${tournamentId}`,
        tournamentId: tournamentId,
        round: 1,
        matchNumber: 1,
        team1: 'Team Alpha',
        team2: 'Team Beta',
        scheduledTime: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'scheduled',
        result: null
      },
      {
        _id: `match2_${tournamentId}`,
        tournamentId: tournamentId,
        round: 1,
        matchNumber: 2,
        team1: 'Team Gamma',
        team2: 'Team Delta',
        scheduledTime: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
        status: 'scheduled',
        result: null
      }
    ];
  };
  
  
  return (
    <TournamentContainer>
      <TournamentHeader>
        <TournamentBanner image={tournament.imageUrl}>
<TournamentStatus $status={tournament.status?.toLowerCase().trim()}>
  {tournament.status}
</TournamentStatus>
        </TournamentBanner>
        
        <TournamentContent>
          <TournamentTitle>{tournament.name}</TournamentTitle>
          
          <TournamentMeta>
            <MetaItem>
              <FaGamepad /> {tournament.gameId.name}
            </MetaItem>
            <MetaItem>
              <FaCalendarAlt /> {formatDate(tournament.dates.start)} - {formatDate(tournament.dates.end)}
            </MetaItem>
            <MetaItem>
              <FaUser /> Organized by {tournament.organizerId.name}
            </MetaItem>
            <MetaItem>
              <FaTrophy /> Format: {tournament.format}
            </MetaItem>
          </TournamentMeta>


          <ActionButtons>
            {user && !isOrganizer && !isAdmin && (
              <Button onClick={() => setShowRegistrationModal(true)}>
                <FaSignInAlt /> Register for Tournament
              </Button>
            )}
            
            
          </ActionButtons>
        </TournamentContent>
      </TournamentHeader>
      
      <ContentSection>
        <SectionTitle>
          <FaUsers /> Tournament Rules
        </SectionTitle>
        <RulesContent>
          {tournament.rules || 'No specific rules have been provided for this tournament.'}
        </RulesContent>
      </ContentSection>
      
      
      
      

      {(isOrganizer || isAdmin) && (
        <ContentSection>
          <SectionTitle>
            <FaUsers /> Registered Teams
          </SectionTitle>
          {registrations.length === 0 ? (
            <p>No teams have registered yet.</p>
          ) : (
            <ul>
              {registrations.map((reg, index) => (
                <li key={index} style={{ marginBottom: '0.5rem' }}>
                  <strong>Team:</strong> {reg.teamName} <br />
                  <strong>Email:</strong> {reg.email || reg.userId?.email || 'N/A'}
                </li>
              ))}
            </ul>
          )}
        </ContentSection>
      )}
      
      {/* Registration Modal */}
      {showRegistrationModal && (
        <RegistrationModal>
          <ModalContent>
            <ModalTitle>Register for {tournament.name}</ModalTitle>
            
            {registrationError && (
              <Alert type="danger">{registrationError}</Alert>
            )}
            
            <form onSubmit={handleRegister}>
              <FormGroup>
                <Label htmlFor="teamName">Team Name</Label>
                <Input
                  type="text"
                  id="teamName"
                  placeholder={`${user.name}'s Team`}
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                />
              </FormGroup>
              
              <ModalButtons>
                <Button 
                  type="button" 
                  variant="secondary" 
                  outline 
                  onClick={() => setShowRegistrationModal(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={registering}
                >
                  {registering ? (
                    <>
                      <Loader size="small" text="" /> Registering...
                    </>
                  ) : (
                    'Confirm Registration'
                  )}
                </Button>
              </ModalButtons>
            </form>
          </ModalContent>
        </RegistrationModal>
      )}
    </TournamentContainer>
  );
};

export default TournamentDetails;
