import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaTrophy, FaCalendarAlt, FaGamepad, FaUser, FaUsers, FaEdit, FaTrash, FaSignInAlt } from 'react-icons/fa';
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
  background-image: url(${props => props.image});
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
    switch (props.status) {
      case 'upcoming': return '#28a745';
      case 'ongoing': return '#fd7e14';
      case 'completed': return '#6c757d';
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
        const tournamentData = await getTournamentById(id);
        setTournament(tournamentData);
        
        // Fetch matches if tournament exists
        const matchesData = await getTournamentMatches(id);
        setMatches(matchesData);
        
        // Fetch registrations if user is organizer or admin
        if (user && (user.role === 'organizer' || user.role === 'admin')) {
          const registrationsData = await getTournamentRegistrations(id);
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
        teamName: teamName || `${user.name}'s Team`
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
  
  const isOrganizer = user && user._id === tournament.organizerId._id;
  const isAdmin = user && user.role === 'admin';
  const canEdit = isOrganizer || isAdmin;
  
  return (
    <TournamentContainer>
      <TournamentHeader>
        <TournamentBanner image={tournament.imageUrl}>
          <TournamentStatus status={tournament.status}>
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
            {user && user.role === 'player' && tournament.registrationOpen && tournament.status === 'upcoming' && (
              <Button onClick={() => setShowRegistrationModal(true)}>
                <FaSignInAlt /> Register for Tournament
              </Button>
            )}
            
            {canEdit && (
              <>
                <Button as={Link} to={`/tournament/${id}/edit`} variant="secondary">
                  <FaEdit /> Edit Tournament
                </Button>
                {isOrganizer && (
                  <Button as={Link} to={`/tournament/${id}/matches/add`} variant="success">
                    <FaPlus /> Add Match
                  </Button>
                )}
              </>
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
      
      <SectionTitle>
        <FaTrophy /> Matches
      </SectionTitle>
      
      {matches.length === 0 ? (
        <ContentSection>
          <p>No matches have been scheduled yet.</p>
          {canEdit && (
            <Button as={Link} to={`/tournament/${id}/matches/add`} variant="success" style={{ marginTop: '1rem' }}>
              <FaPlus /> Schedule First Match
            </Button>
          )}
        </ContentSection>
      ) : (
        <MatchesGrid>
          {matches.map(match => (
            <MatchCard key={match._id} status={match.status}>
              <MatchHeader>
                <MatchDate>
                  <FaCalendarAlt /> {formatDate(match.date)}
                </MatchDate>
                <MatchStatus status={match.status}>
                  {match.status}
                </MatchStatus>
              </MatchHeader>
              
              <MatchTeams>
                <Team>
                  <TeamName winner={match.winner && match.winner._id === match.teamA._id}>
                    {match.teamA.teamName}
                  </TeamName>
                  <Score winner={match.winner && match.winner._id === match.teamA._id}>
                    {match.scoreA}
                  </Score>
                </Team>
                
                <Versus>VS</Versus>
                
                <Team>
                  <TeamName winner={match.winner && match.winner._id === match.teamB._id}>
                    {match.teamB.teamName}
                  </TeamName>
                  <Score winner={match.winner && match.winner._id === match.teamB._id}>
                    {match.scoreB}
                  </Score>
                </Team>
              </MatchTeams>
              
              {canEdit && match.status !== 'completed' && (
                <Button 
                  as={Link} 
                  to={`/match/${match._id}/update`} 
                  variant="secondary" 
                  small 
                  style={{ width: '100%' }}
                >
                  <FaEdit /> Update Result
                </Button>
              )}
            </MatchCard>
          ))}
        </MatchesGrid>
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
