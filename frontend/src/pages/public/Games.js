import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaGamepad, FaPlus, FaSearch } from 'react-icons/fa';
import { getAllGames } from '../../services/gameService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import { AuthContext } from '../../context/AuthContext';

const GamesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2rem 0;
  flex-wrap: wrap;
  gap: 1rem;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  color: #1a2a6c;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.75rem;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  max-width: 400px;
  width: 100%;
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #1a2a6c;
    box-shadow: 0 0 0 2px rgba(26, 42, 108, 0.2);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 1rem;
  color: #6c757d;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin: 2rem 0;
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

const Games = () => {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { user } = useContext(AuthContext);
  
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const gamesData = await getAllGames();
        if (gamesData && gamesData.length > 0) {
          setGames(gamesData);
          setFilteredGames(gamesData);
        } else {
          // Use fallback data if API returns empty array
          const fallbackGames = getFallbackGames();
          setGames(fallbackGames);
          setFilteredGames(fallbackGames);
        }
      } catch (error) {
        console.error('Error fetching games:', error);
        setError('Failed to load games. Please try again later.');
        // Use fallback data if API call fails
        const fallbackGames = getFallbackGames();
        setGames(fallbackGames);
        setFilteredGames(fallbackGames);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGames();
  }, []);
  
  // Fallback data in case API calls fail
  const getFallbackGames = () => {
    return [
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
      },
      {
        _id: 'game4',
        name: 'Dota 2',
        description: 'A free-to-play MOBA game by Valve',
        imageUrl: 'https://cdn.cloudflare.steamstatic.com/steam/apps/570/capsule_616x353.jpg'
      },
      {
        _id: 'game5',
        name: 'Fortnite',
        description: 'A battle royale game developed by Epic Games',
        imageUrl: 'https://cdn2.unrealengine.com/battle-royale-promo-image-1920x1080-1920x1080-119208936.jpg'
      },
      {
        _id: 'game6',
        name: 'Overwatch 2',
        description: 'A team-based action game by Blizzard Entertainment',
        imageUrl: 'https://blz-contentstack-images.akamaized.net/v3/assets/blt9c12f249ac15c7ec/blt0c118364c9d927b0/62ea14f8a20cf34d5c689339/ow2-beta-header-desktop.jpg'
      }
    ];
  };
  
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredGames(games);
    } else {
      const filtered = games.filter(game => 
        game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (game.description && game.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredGames(filtered);
    }
  }, [searchTerm, games]);
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  if (loading) {
    return <Loader fullPage text="Loading games..." />;
  }
  
  return (
    <GamesContainer>
      <PageHeader>
        <PageTitle>
          <FaGamepad /> Games
        </PageTitle>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <SearchContainer>
            <SearchIcon>
              <FaSearch />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Search games..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </SearchContainer>
          
          {user && (user.role === 'organizer' || user.role === 'admin') && (
            <Button as={Link} to="/games/add">
              <FaPlus /> Add Game
            </Button>
          )}
        </div>
      </PageHeader>
      
      {error && <Alert type="danger">{error}</Alert>}
      
      {!loading && filteredGames.length === 0 ? (
        <EmptyState>
          <EmptyStateTitle>No Games Found</EmptyStateTitle>
          <EmptyStateText>
            {searchTerm
              ? `No games match your search for "${searchTerm}"`
              : 'There are no games available at the moment.'}
          </EmptyStateText>
          {user && (user.role === 'organizer' || user.role === 'admin') && (
            <Button as={Link} to="/games/add">
              <FaPlus /> Add the First Game
            </Button>
          )}
        </EmptyState>
      ) : (
        <CardGrid>
          {filteredGames.map(game => (
            <Card
              key={game._id}
              image={game.imageUrl}
              title={game.name}
              description={game.description || 'No description available'}
              footer={
                <Button 
                  as={Link} 
                  to={`/tournaments/${game._id}`} 
                  small
                >
                  View Tournaments
                </Button>
              }
              onClick={() => {}}
            />
          ))}
        </CardGrid>
      )}
    </GamesContainer>
  );
};

export default Games;
