import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaGamepad, FaTrophy, FaUsers, FaArrowRight } from 'react-icons/fa';
import { getAllGames } from '../../services/gameService';
import { getAllTournaments } from '../../services/tournamentService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const HeroBanner = styled.div`
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('IMAGE_HOMEPAGE_BANNER');
  background-size: cover;
  background-position: center;
  color: white;
  padding: 5rem 2rem;
  border-radius: 8px;
  margin: 2rem 0;
  text-align: center;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  color: #1a2a6c;
  margin: 3rem 0 1.5rem;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.75rem;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ViewAllLink = styled(Link)`
  display: flex;
  align-items: center;
  color: #1a2a6c;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
  
  svg {
    margin-left: 0.5rem;
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
`;

const FeatureSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
`;

const FeatureCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  color: #1a2a6c;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  color: #1a2a6c;
  margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
  color: #666;
`;

const Home = () => {
  const [games, setGames] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gamesData, tournamentsData] = await Promise.all([
          getAllGames(),
          getAllTournaments()
        ]);
        
        setGames(gamesData.slice(0, 4)); // Show only 4 games on homepage
        setTournaments(tournamentsData.slice(0, 4)); // Show only 4 tournaments on homepage
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (loading) {
    return <Loader fullPage text="Loading content..." />;
  }
  
  return (
    <HomeContainer>
      <HeroBanner>
        <HeroTitle>TEC Esports Tournament Platform</HeroTitle>
        <HeroSubtitle>
          Join the ultimate esports experience. Compete in tournaments, manage your teams, and rise to the top of the leaderboards.
        </HeroSubtitle>
        <ButtonGroup>
          <Button as={Link} to="/register">
            Create Account
          </Button>
          <Button as={Link} to="/games" variant="secondary">
            Browse Tournaments
          </Button>
        </ButtonGroup>
      </HeroBanner>
      
      <SectionHeader>
        <SectionTitle>
          <FaGamepad /> Featured Games
        </SectionTitle>
        <ViewAllLink to="/games">
          View All Games <FaArrowRight />
        </ViewAllLink>
      </SectionHeader>
      
      <CardGrid>
        {games.map(game => (
          <Card
            key={game._id}
            image={game.imageUrl}
            title={game.name}
            description={game.description}
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
      
      <SectionHeader>
        <SectionTitle>
          <FaTrophy /> Upcoming Tournaments
        </SectionTitle>
        <ViewAllLink to="/tournaments">
          View All Tournaments <FaArrowRight />
        </ViewAllLink>
      </SectionHeader>
      
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
      
      <SectionTitle>
        <FaUsers /> Why Choose TEC Esports
      </SectionTitle>
      
      <FeatureSection>
        <FeatureCard>
          <FeatureIcon>
            <FaGamepad />
          </FeatureIcon>
          <FeatureTitle>Diverse Game Selection</FeatureTitle>
          <FeatureDescription>
            From Valorant to BGMI, we host tournaments for all your favorite esports titles.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureIcon>
            <FaTrophy />
          </FeatureIcon>
          <FeatureTitle>Professional Tournament Management</FeatureTitle>
          <FeatureDescription>
            Our platform provides tools for organizers to create and manage tournaments with ease.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureIcon>
            <FaUsers />
          </FeatureIcon>
          <FeatureTitle>Community-Focused</FeatureTitle>
          <FeatureDescription>
            Connect with players, form teams, and participate in a thriving esports community.
          </FeatureDescription>
        </FeatureCard>
      </FeatureSection>
    </HomeContainer>
  );
};

export default Home;
