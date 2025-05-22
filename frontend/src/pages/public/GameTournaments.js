import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaTrophy, FaPlus, FaArrowLeft } from 'react-icons/fa';
import { getGameById, getGameTournaments } from '../../services/gameService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import { AuthContext } from '../../context/AuthContext';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  color: #1a2a6c;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.75rem;
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
`;

const GameInfo = styled.div`
  display: flex;
  margin-bottom: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
`;

const GameImage = styled.div`
  width: 200px;
  height: 200px;
  background-image: url(${props => props.image && props.image.startsWith('http') ? props.image : 'https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80'});
  background-size: cover;
  background-position: center;
  
  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
  }
`;

const GameDetails = styled.div`
  padding: 1.5rem;
  flex: 1;
`;

const GameTitle = styled.h2`
  font-size: 1.8rem;
  margin: 0 0 1rem;
  color: #1a2a6c;
`;

const GameDescription = styled.p`
  color: #666;
  margin-bottom: 1rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background: #f8f9fa;
  border-radius: 8px;
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #1a2a6c;
`;

const EmptyStateText = styled.p`
  color: #666;
  margin-bottom: 2rem;
`;

const GameTournaments = () => {
  const { gameId } = useParams();
  const { user } = useContext(AuthContext);
  
  const [game, setGame] = useState(null);
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch game details
        let gameData;
        try {
          gameData = await getGameById(gameId);
          if (!gameData) {
            throw new Error('Game not found');
          }
        } catch (err) {
          console.error('Error fetching game:', err);
          // Use fallback game data if API call fails
          gameData = getFallbackGame(gameId);
        }
        setGame(gameData);
        
        // Fetch tournaments for this game
        let tournamentsData = [];
        try {
          tournamentsData = await getGameTournaments(gameId);
        } catch (err) {
          console.error('Error fetching tournaments:', err);
          // Use fallback tournaments if API call fails
          tournamentsData = getFallbackTournaments(gameId);
        }
        setTournaments(tournamentsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load game and tournaments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [gameId]);
  
  // Fallback data in case API calls fail
  const getFallbackGame = (id) => {
    const fallbackGames = [
      {
        _id: 'game1',
        name: 'Valorant',
        description: 'A 5v5 character-based tactical FPS by Riot Games',
        imageUrl: 'https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt3f072336e3f3ade4/63096d7be4a8c30e088e7720/Valorant_2022_E5A2_PlayVALORANT_ContentStackThumbnail_1200x625_MB01.png'
      },
      {
        _id: 'game2',
        name: 'League of Legends',
        description: 'A popular MOBA game developed by Riot Games',
        imageUrl: 'https://cdn1.epicgames.com/offer/24b9b5e323bc40eea252a10cdd3b2f10/EGS_LeagueofLegends_RiotGames_S1_2560x1440-80471666c140f790f28dff68d72c384b'
      },
      {
        _id: 'game3',
        name: 'Counter-Strike 2',
        description: 'The next evolution of the iconic FPS from Valve',
        imageUrl: 'https://cdn.cloudflare.steamstatic.com/steam/apps/730/capsule_616x353.jpg'
      }
    ];
    
    return fallbackGames.find(g => g._id === id) || {
      _id: id,
      name: 'Game Details',
      description: 'Game information not available',
      imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80'
    };
  };
  
  const getFallbackTournaments = (gameId) => {
      const now = new Date();

  const computeStatus = (startDate, endDate) => {
    if (now < startDate) return 'upcoming';
    if (now >= startDate && now <= endDate) return 'ongoing';
    return 'ended';
  };
    return [
      {
        _id: `tournament1_${gameId}`,
        name: 'Championship Series',
        gameId: gameId,
        format: 'Single Elimination',
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        status: computeStatus(startDate1, endDate1)
      },
      {
        _id: `tournament2_${gameId}`,
        name: 'Pro League Season 5',
        gameId: gameId,
        format: 'Double Elimination',
        startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
        imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        status: computeStatus(startDate2, endDate2)
      }
    ];
  };
  
  if (loading) {
    return <Loader fullPage text="Loading tournaments..." />;
  }
  
  if (error) {
    return (
      <PageContainer>
        <Alert type="danger">{error}</Alert>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>
          <FaTrophy /> Tournaments
        </PageTitle>
        
        <div>
          <Button as={Link} to="/games" style={{marginRight: '1rem'}}>
            <FaArrowLeft /> Back to Games
          </Button>
          
          {user && (user.role === 'organizer' || user.role === 'admin') && (
            <Button as={Link} to={`/tournaments/add?gameId=${gameId}`}>
              <FaPlus /> Create Tournament
            </Button>
          )}
        </div>
      </PageHeader>
      
      {game && (
        <GameInfo>
          <GameImage image={game.imageUrl} />
          <GameDetails>
            <GameTitle>{game.name}</GameTitle>
            <GameDescription>{game.description || 'No description available'}</GameDescription>
          </GameDetails>
        </GameInfo>
      )}
      
      {tournaments.length === 0 ? (
        <EmptyState>
          <EmptyStateTitle>No Tournaments Found</EmptyStateTitle>
          <EmptyStateText>
            There are no tournaments available for this game at the moment.
          </EmptyStateText>
          {user && (user.role === 'organizer' || user.role === 'admin') && (
            <Button as={Link} to={`/tournaments/add?gameId=${gameId}`}>
              <FaPlus /> Create the First Tournament
            </Button>
          )}
        </EmptyState>
      ) : (
        <CardGrid>
          {tournaments.map(tournament => (
            <Card
              key={tournament._id}
              image={tournament.imageUrl}
              title={tournament.name}
              description={`Format: ${tournament.format}`}
              footer={
                <Button 
                  as={Link} 
                  to={`/tournament/${tournament._id}`} 
                  small
                >
                  View Details
                </Button>
              }
              onClick={() => {}}
            />
          ))}
        </CardGrid>
      )}
    </PageContainer>
  );
};

export default GameTournaments;
