import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaGamepad, FaTrophy, FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import { getUserRegistrations } from '../../services/registrationService';
import { getPlayerMatches } from '../../services/matchService';
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
    switch (props.$status) {
      case 'upcoming': return '#28a745'; // green
      case 'ongoing': return '#fd7e14'; // orange/yellow
      case 'completed': return '#dc3545'; // red
      case 'approved': return '#d4edda';
      case 'rejected': return '#f8d7da';
      case 'pending': return '#fff3cd';
      default: return '#e9ecef';
    }
  }};
  color: ${props => {
    switch (props.$statusstatus) {
      case 'upcoming': return '#155724'; // dark green
      case 'ongoing': return '#856404'; // dark orange
      case 'completed': return '#721c24'; // dark red
      case 'approved': return '#155724';
      case 'rejected': return '#721c24';
      case 'pending': return '#856404';
      default: return '#495057';
    }
  }};
`;

const PlayerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [registrations, setRegistrations] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        setLoading(true);
        const [registrationsData, matchesData] = await Promise.all([
          getUserRegistrations(),
          getPlayerMatches()
        ]);
        
        console.log('PlayerDashboard registrationsData:', registrationsData);
        
        setRegistrations(registrationsData);
        setMatches(matchesData);
      } catch (error) {
        console.error('Error fetching player data:', error);
        setError('Failed to load your tournament data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlayerData();
  }, []);
  
  if (loading) {
    return <Loader fullPage text="Loading your dashboard..." />;
  }
  
  // Calculate stats
  const totalRegistrations = registrations.length;
  const approvedRegistrations = registrations.filter(reg => reg.status === 'approved').length;
  const pendingRegistrations = registrations.filter(reg => reg.status === 'pending').length;
  const totalMatches = matches.length;
  const completedMatches = matches.filter(match => match.status === 'completed').length;
  
  // Format date function
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <DashboardContainer>
      <DashboardHeader>
        <DashboardTitle>
          <FaGamepad /> Player Dashboard
        </DashboardTitle>
      </DashboardHeader>
      
      {error && <Alert type="danger">{error}</Alert>}
      
      <DashboardGrid>
        <MainContent>
          <SectionTitle>
            <FaTrophy /> My Tournaments
          </SectionTitle>
          
          {registrations.length === 0 ? (
            <EmptyState>
              <EmptyStateTitle>No Tournament Registrations</EmptyStateTitle>
              <EmptyStateText>
                You haven't registered for any tournaments yet. Browse available tournaments and join the competition!
              </EmptyStateText>
              <Button as={Link} to="/games">
                Browse Tournaments
              </Button>
            </EmptyState>
          ) : (
            <CardGrid>
{registrations.map(registration => {
  console.log('Registration status:', registration.status);
  console.log('Tournament status:', registration.tournamentId.status);
  alert(`Registration status: ${registration.status}, Tournament status: ${registration.tournamentId.status}`);
  return (
    <Card
      key={registration._id}
      image={registration.tournamentId.imageUrl}
      title={registration.tournamentId.name}
      description={
        <>
          <p>Game: {registration.tournamentId.gameId.name}</p>
          <p>Team: {registration.teamName}</p>
<p>Tournament Status: <StatusBadge status={registration.tournamentId.status?.toLowerCase().trim()}>{registration.tournamentId.status}</StatusBadge></p>
<p>Registration Status: <StatusBadge status={registration.status?.toLowerCase().trim()}>{registration.status}</StatusBadge></p>
        </>
      }
      footer={
        <Button 
          as={Link} 
          to={`/tournament/${registration.tournamentId._id}`} 
          small
        >
          View Tournament
        </Button>
      }
    />
  );
})}
            </CardGrid>
          )}
          
          <SectionTitle>
            <FaCalendarAlt /> My Matches
          </SectionTitle>
          
          {matches.length === 0 ? (
            <EmptyState>
              <EmptyStateTitle>No Matches Scheduled</EmptyStateTitle>
              <EmptyStateText>
                You don't have any matches scheduled yet. Matches will appear here once you're approved for tournaments.
              </EmptyStateText>
            </EmptyState>
          ) : (
            <CardGrid>
              {matches.map(match => (
                <Card
                  key={match._id}
                  title={`${match.teamA.teamName} vs ${match.teamB.teamName}`}
                  description={
                    <>
                      <p>Tournament: {match.tournamentId.name}</p>
                      <p>Date: {formatDate(match.date)}</p>
                      <p>Status: {match.status}</p>
                      {match.status === 'completed' && (
                        <p>Result: {match.scoreA} - {match.scoreB}</p>
                      )}
                    </>
                  }
                  footer={
                    <Button 
                      as={Link} 
                      to={`/tournament/${match.tournamentId._id}`} 
                      small
                    >
                      View Tournament
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
          
          <StatsCard>
            <StatTitle>My Statistics</StatTitle>
            <StatsList>
              <StatItem>
                <StatLabel>Total Registrations</StatLabel>
                <StatValue>{totalRegistrations}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Approved Registrations</StatLabel>
                <StatValue>{approvedRegistrations}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Pending Registrations</StatLabel>
                <StatValue>{pendingRegistrations}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Total Matches</StatLabel>
                <StatValue>{totalMatches}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Completed Matches</StatLabel>
                <StatValue>{completedMatches}</StatValue>
              </StatItem>
            </StatsList>
          </StatsCard>
        </Sidebar>
        {user.role === 'organizer' && (
          <Sidebar>
            <Button as={Link} to="/games/add" style={{ marginBottom: '1rem', width: '100%' }}>
              Add New Game
            </Button>
            <Button as={Link} to="/tournaments/add" style={{ width: '100%' }}>
              Add New Tournament
            </Button>
          </Sidebar>
        )}
      </DashboardGrid>
    </DashboardContainer>
  );
};

export default PlayerDashboard;
