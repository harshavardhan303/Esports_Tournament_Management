import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaUserShield, FaUsers, FaGamepad, FaTrophy, FaChartBar, FaCheck, FaBan } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import { getUsers } from '../../services/userService';
import { getAllGames } from '../../services/gameService';
import { getAllTournaments, getTournamentStats } from '../../services/tournamentService';
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

const TabsContainer = styled.div`
  display: flex;
  margin-bottom: 2rem;
  border-bottom: 1px solid #ddd;
`;

const Tab = styled.button`
  padding: 1rem 1.5rem;
  background: ${props => props.active ? 'white' : 'transparent'};
  border: none;
  border-bottom: 3px solid ${props => props.active ? '#1a2a6c' : 'transparent'};
  color: ${props => props.active ? '#1a2a6c' : '#666'};
  font-weight: ${props => props.active ? '600' : '400'};
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    color: #1a2a6c;
  }
  
  svg {
    margin-right: 0.5rem;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a2a6c;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #666;
  font-size: 1rem;
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  border-bottom: 2px solid #eee;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 1rem;
  color: #1a2a6c;
  font-weight: 600;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: #f8f9fa;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  color: #333;
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
      case 'active': return '#d4edda';
      case 'blocked': return '#f8d7da';
      case 'upcoming': return '#d4edda';
      case 'ongoing': return '#fff3cd';
      case 'completed': return '#e9ecef';
      default: return '#e9ecef';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'active': return '#155724';
      case 'blocked': return '#721c24';
      case 'upcoming': return '#155724';
      case 'ongoing': return '#856404';
      case 'completed': return '#495057';
      default: return '#495057';
    }
  }};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
`;

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [games, setGames] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [stats, setStats] = useState({
    totalTournaments: 0,
    upcomingTournaments: 0,
    ongoingTournaments: 0,
    completedTournaments: 0,
    totalRegistrations: 0,
    totalMatches: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        
        // Fetch data based on active tab to minimize unnecessary requests
        if (activeTab === 'overview') {
          const statsData = await getTournamentStats();
          setStats(statsData);
        }
        
        if (activeTab === 'users' || activeTab === 'overview') {
          const usersData = await getUsers();
          setUsers(usersData);
        }
        
        if (activeTab === 'games' || activeTab === 'overview') {
          const gamesData = await getAllGames();
          setGames(gamesData);
        }
        
        if (activeTab === 'tournaments' || activeTab === 'overview') {
          const tournamentsData = await getAllTournaments();
          setTournaments(tournamentsData);
        }
      } catch (error) {
        console.error('Error fetching admin data:', error);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAdminData();
  }, [activeTab]);
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  const handleToggleUserStatus = async (userId, currentStatus) => {
    // This would be implemented with a real API call
    console.log(`Toggle user ${userId} status from ${currentStatus}`);
  };
  
  if (loading) {
    return <Loader fullPage text="Loading admin dashboard..." />;
  }
  
  // Format date function
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <DashboardContainer>
      <DashboardHeader>
        <DashboardTitle>
          <FaUserShield /> Admin Dashboard
        </DashboardTitle>
      </DashboardHeader>
      
      {error && <Alert type="danger">{error}</Alert>}
      
      <TabsContainer>
        <Tab 
          active={activeTab === 'overview'} 
          onClick={() => handleTabChange('overview')}
        >
          <FaChartBar /> Overview
        </Tab>
        <Tab 
          active={activeTab === 'users'} 
          onClick={() => handleTabChange('users')}
        >
          <FaUsers /> Users
        </Tab>
        <Tab 
          active={activeTab === 'games'} 
          onClick={() => handleTabChange('games')}
        >
          <FaGamepad /> Games
        </Tab>
        <Tab 
          active={activeTab === 'tournaments'} 
          onClick={() => handleTabChange('tournaments')}
        >
          <FaTrophy /> Tournaments
        </Tab>
      </TabsContainer>
      
      {activeTab === 'overview' && (
        <>
          <StatsGrid>
            <StatCard>
              <StatValue>{stats.totalTournaments}</StatValue>
              <StatLabel>Total Tournaments</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{stats.upcomingTournaments}</StatValue>
              <StatLabel>Upcoming Tournaments</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{stats.ongoingTournaments}</StatValue>
              <StatLabel>Ongoing Tournaments</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{stats.completedTournaments}</StatValue>
              <StatLabel>Completed Tournaments</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{users.length}</StatValue>
              <StatLabel>Registered Users</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{games.length}</StatValue>
              <StatLabel>Available Games</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{stats.totalRegistrations}</StatValue>
              <StatLabel>Tournament Registrations</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{stats.totalMatches}</StatValue>
              <StatLabel>Scheduled Matches</StatLabel>
            </StatCard>
          </StatsGrid>
          
          <TableContainer>
            <h2 style={{ marginBottom: '1rem' }}>Recent Users</h2>
            <Table>
              <TableHead>
                <tr>
                  <TableHeader>Name</TableHeader>
                  <TableHeader>Email</TableHeader>
                  <TableHeader>Role</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </tr>
              </TableHead>
              <TableBody>
                {users.slice(0, 5).map(user => (
                  <TableRow key={user._id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell style={{ textTransform: 'capitalize' }}>{user.role}</TableCell>
                    <TableCell>
                      <StatusBadge status={user.status}>{user.status}</StatusBadge>
                    </TableCell>
                    <TableCell>
                      <ActionButtons>
                        <Button 
                          variant={user.status === 'active' ? 'danger' : 'success'} 
                          small
                          onClick={() => handleToggleUserStatus(user._id, user.status)}
                        >
                          {user.status === 'active' ? <FaBan /> : <FaCheck />}
                        </Button>
                      </ActionButtons>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TableContainer>
            <h2 style={{ marginBottom: '1rem' }}>Recent Tournaments</h2>
            <Table>
              <TableHead>
                <tr>
                  <TableHeader>Name</TableHeader>
                  <TableHeader>Game</TableHeader>
                  <TableHeader>Organizer</TableHeader>
                  <TableHeader>Dates</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </tr>
              </TableHead>
              <TableBody>
                {tournaments.slice(0, 5).map(tournament => (
                  <TableRow key={tournament._id}>
                    <TableCell>{tournament.name}</TableCell>
                    <TableCell>{tournament.gameId.name}</TableCell>
                    <TableCell>{tournament.organizerId.name}</TableCell>
                    <TableCell>
                      {formatDate(tournament.dates.start)} - {formatDate(tournament.dates.end)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={tournament.status}>{tournament.status}</StatusBadge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        as={Link} 
                        to={`/tournament/${tournament._id}`} 
                        small
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
      
      {activeTab === 'users' && (
        <TableContainer>
          <Table>
            <TableHead>
              <tr>
                <TableHeader>Name</TableHeader>
                <TableHeader>Email</TableHeader>
                <TableHeader>Role</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Joined</TableHeader>
                <TableHeader>Actions</TableHeader>
              </tr>
            </TableHead>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="6">
                    <EmptyState>No users found</EmptyState>
                  </TableCell>
                </TableRow>
              ) : (
                users.map(user => (
                  <TableRow key={user._id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell style={{ textTransform: 'capitalize' }}>{user.role}</TableCell>
                    <TableCell>
                      <StatusBadge status={user.status}>{user.status}</StatusBadge>
                    </TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell>
                      <ActionButtons>
                        <Button 
                          variant={user.status === 'active' ? 'danger' : 'success'} 
                          small
                          onClick={() => handleToggleUserStatus(user._id, user.status)}
                        >
                          {user.status === 'active' ? 'Block' : 'Activate'}
                        </Button>
                      </ActionButtons>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      {activeTab === 'games' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <Button as={Link} to="/games/add">
              <FaGamepad /> Add New Game
            </Button>
          </div>
          
          <TableContainer>
            <Table>
              <TableHead>
                <tr>
                  <TableHeader>Name</TableHeader>
                  <TableHeader>Description</TableHeader>
                  <TableHeader>Tournaments</TableHeader>
                  <TableHeader>Added</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </tr>
              </TableHead>
              <TableBody>
                {games.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan="5">
                      <EmptyState>No games found</EmptyState>
                    </TableCell>
                  </TableRow>
                ) : (
                  games.map(game => (
                    <TableRow key={game._id}>
                      <TableCell>{game.name}</TableCell>
                      <TableCell>{game.description || 'No description'}</TableCell>
                      <TableCell>
                        {tournaments.filter(t => t.gameId._id === game._id).length}
                      </TableCell>
                      <TableCell>{formatDate(game.createdAt)}</TableCell>
                      <TableCell>
                        <ActionButtons>
                          <Button 
                            as={Link} 
                            to={`/games/${game._id}/edit`} 
                            variant="secondary" 
                            small
                          >
                            Edit
                          </Button>
                          <Button 
                            as={Link} 
                            to={`/tournaments/${game._id}`} 
                            small
                          >
                            View Tournaments
                          </Button>
                        </ActionButtons>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
      
      {activeTab === 'tournaments' && (
        <TableContainer>
          <Table>
            <TableHead>
              <tr>
                <TableHeader>Name</TableHeader>
                <TableHeader>Game</TableHeader>
                <TableHeader>Organizer</TableHeader>
                <TableHeader>Dates</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Actions</TableHeader>
              </tr>
            </TableHead>
            <TableBody>
              {tournaments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="6">
                    <EmptyState>No tournaments found</EmptyState>
                  </TableCell>
                </TableRow>
              ) : (
                tournaments.map(tournament => (
                  <TableRow key={tournament._id}>
                    <TableCell>{tournament.name}</TableCell>
                    <TableCell>{tournament.gameId.name}</TableCell>
                    <TableCell>{tournament.organizerId.name}</TableCell>
                    <TableCell>
                      {formatDate(tournament.dates.start)} - {formatDate(tournament.dates.end)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={tournament.status}>{tournament.status}</StatusBadge>
                    </TableCell>
                    <TableCell>
                      <ActionButtons>
                        <Button 
                          as={Link} 
                          to={`/tournament/${tournament._id}`} 
                          small
                        >
                          View
                        </Button>
                        <Button 
                          as={Link} 
                          to={`/tournament/${tournament._id}/edit`} 
                          variant="secondary" 
                          small
                        >
                          Edit
                        </Button>
                      </ActionButtons>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </DashboardContainer>
  );
};

export default AdminDashboard;
