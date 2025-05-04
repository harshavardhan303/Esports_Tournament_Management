import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaTrophy, FaGamepad, FaCalendarAlt, FaUsers, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import { getOrganizerTournaments } from '../../services/tournamentService';
import { getAllGames } from '../../services/gameService';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2rem 0;
  flex-wrap: wrap;
  gap: 1rem;
`;

const DashboardTitle = styled.h1`
  font-size: 2.5rem;
  color: #1a2a6c;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.75rem;
  }
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div``;

const Sidebar = styled.div`
  @media (max-width: 992px) {
    order: -1;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  color: #1a2a6c;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.75rem;
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const ProfileCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ProfileImage = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-image: url(${props => props.image});
  background-size: cover;
  background-position: center;
  margin-right: 1.5rem;
`;

const ProfileInfo = styled.div``;

const ProfileName = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #1a2a6c;
`;

const ProfileRole = styled.div`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #e9ecef;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #495057;
  text-transform: capitalize;
`;

const QuickActions = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const ActionTitle = styled.h3`
  font-size: 1.2rem;
  color: #1a2a6c;
  margin-bottom: 1rem;
`;

const ActionList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
`;

const StatsCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
`;

const StatTitle = styled.h3`
  font-size: 1.2rem;
  color: #1a2a6c;
  margin-bottom: 1rem;
`;

const StatsList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
`;

const StatLabel = styled.div`
  color: #666;
`;

const StatValue = styled.div`
  font-weight: 600;
  color: #1a2a6c;
`;

const EmptyState = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  text-align: center;
  margin-bottom: 2rem;
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.5rem;
  color: #1a2a6c;
  margin-bottom: 1rem;
`;

const EmptyStateText = styled.p`
  color: #666;
  margin-bottom: 1.5rem;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  background-color: ${props => {
    switch (props.status) {
      case 'upcoming': return '#d4edda';
      case 'ongoing': return '#fff3cd';
      case 'completed': return '#e9ecef';
      default: return '#e9ecef';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'upcoming': return '#155724';
      case 'ongoing': return '#856404';
      case 'completed': return '#495057';
      default: return '#495057';
    }
  }};
`;

const OrganizerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [tournaments, setTournaments] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchOrganizerData = async () => {
      try {
        setLoading(true);
        const [tournamentsData, gamesData] = await Promise.all([
          getOrganizerTournaments(),
          getAllGames()
        ]);
        
        setTournaments(tournamentsData);
        setGames(gamesData);
      } catch (error) {
        console.error('Error fetching organizer data:', error);
        setError('Failed to load your tournament data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrganizerData();
  }, []);
  
  if (loading) {
    return <Loader fullPage text="Loading your dashboard..." />;
  }
  
  // Calculate stats
  const totalTournaments = tournaments.length;
  const upcomingTournaments = tournaments.filter(t => t.status === 'upcoming').length;
  const ongoingTournaments = tournaments.filter(t => t.status === 'ongoing').length;
  const completedTournaments = tournaments.filter(t => t.status === 'completed').length;
  
  // Format date function
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <DashboardContainer>
      <DashboardHeader>
        <DashboardTitle>
          <FaTrophy /> Organizer Dashboard
        </DashboardTitle>
        <Button as={Link} to="/tournament/create">
          <FaPlus /> Create Tournament
        </Button>
      </DashboardHeader>
      
      {error && <Alert type="danger">{error}</Alert>}
      
      <DashboardGrid>
        <MainContent>
          <SectionTitle>
            <FaTrophy /> My Tournaments
          </SectionTitle>
          
          {tournaments.length === 0 ? (
            <EmptyState>
              <EmptyStateTitle>No Tournaments Created</EmptyStateTitle>
              <EmptyStateText>
                You haven't created any tournaments yet. Start organizing your first esports tournament!
              </EmptyStateText>
              <Button as={Link} to="/tournament/create">
                <FaPlus /> Create Tournament
              </Button>
            </EmptyState>
          ) : (
            <CardGrid>
              {tournaments.map(tournament => (
                <Card
                  key={tournament._id}
                  image={tournament.imageUrl}
                  title={tournament.name}
                  description={
                    <>
                      <p>Game: {tournament.gameId.name}</p>
                      <p>Dates: {formatDate(tournament.dates.start)} - {formatDate(tournament.dates.end)}</p>
                      <p>Status: <StatusBadge status={tournament.status}>{tournament.status}</StatusBadge></p>
                      <p>Registration: {tournament.registrationOpen ? 'Open' : 'Closed'}</p>
                    </>
                  }
                  footer={
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Button 
                        as={Link} 
                        to={`/tournament/${tournament._id}`} 
                        small
                        style={{ flex: 1 }}
                      >
                        View
                      </Button>
                      <Button 
                        as={Link} 
                        to={`/tournament/${tournament._id}/edit`} 
                        variant="secondary" 
                        small
                      >
                        <FaEdit />
                      </Button>
                    </div>
                  }
                />
              ))}
            </CardGrid>
          )}
          
          <SectionTitle>
            <FaGamepad /> Available Games
          </SectionTitle>
          
          {games.length === 0 ? (
            <EmptyState>
              <EmptyStateTitle>No Games Available</EmptyStateTitle>
              <EmptyStateText>
                There are no games available in the system yet. Add a new game to start creating tournaments.
              </EmptyStateText>
              <Button as={Link} to="/games/add">
                <FaPlus /> Add Game
              </Button>
            </EmptyState>
          ) : (
            <CardGrid>
              {games.map(game => (
                <Card
                  key={game._id}
                  image={game.imageUrl}
                  title={game.name}
                  description={game.description || 'No description available'}
                  footer={
                    <Button 
                      as={Link} 
                      to={`/tournament/create?gameId=${game._id}`} 
                      small
                    >
                      Create Tournament
                    </Button>
                  }
                />
              ))}
            </CardGrid>
          )}
        </MainContent>
        
        <Sidebar>
          <ProfileCard>
            <ProfileHeader>
              <ProfileImage image={user.profileImageUrl} />
              <ProfileInfo>
                <ProfileName>{user.name}</ProfileName>
                <ProfileRole>{user.role}</ProfileRole>
              </ProfileInfo>
            </ProfileHeader>
            
            <Button as={Link} to="/profile" style={{ width: '100%' }}>
              Edit Profile
            </Button>
          </ProfileCard>
          
          <QuickActions>
            <ActionTitle>Quick Actions</ActionTitle>
            <ActionList>
              <Button as={Link} to="/tournament/create">
                <FaPlus /> Create Tournament
              </Button>
              <Button as={Link} to="/games/add" variant="secondary">
                <FaPlus /> Add Game
              </Button>
              <Button as={Link} to="/registrations/manage" variant="secondary">
                <FaUsers /> Manage Registrations
              </Button>
              <Button as={Link} to="/matches/manage" variant="secondary">
                <FaCalendarAlt /> Manage Matches
              </Button>
            </ActionList>
          </QuickActions>
          
          <StatsCard>
            <StatTitle>Tournament Statistics</StatTitle>
            <StatsList>
              <StatItem>
                <StatLabel>Total Tournaments</StatLabel>
                <StatValue>{totalTournaments}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Upcoming</StatLabel>
                <StatValue>{upcomingTournaments}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Ongoing</StatLabel>
                <StatValue>{ongoingTournaments}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Completed</StatLabel>
                <StatValue>{completedTournaments}</StatValue>
              </StatItem>
            </StatsList>
          </StatsCard>
        </Sidebar>
      </DashboardGrid>
    </DashboardContainer>
  );
};

export default OrganizerDashboard;
