import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import { getAllGames } from '../../services/gameService';
import { createTournament } from '../../services/tournamentService';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import { AuthContext } from '../../context/AuthContext';

const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  color: #1a2a6c;
`;

const FormContainer = styled.form`
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
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

const Select = styled.select`
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

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 150px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #1a2a6c;
    box-shadow: 0 0 0 2px rgba(26, 42, 108, 0.2);
  }
`;

const Checkbox = styled.div`
  display: flex;
  align-items: center;
  
  input {
    margin-right: 0.5rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const TournamentCreate = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const preselectedGameId = queryParams.get('gameId');
  
  const [formData, setFormData] = useState({
    name: '',
    gameId: preselectedGameId || '',
    format: 'single_elimination',
    startDate: '',
    endDate: '',
    rules: '',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    registrationOpen: true
  });
  
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const gamesData = await getAllGames();
        setGames(gamesData);
      } catch (error) {
        console.error('Error fetching games:', error);
        setError('Failed to load games. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchGames();
  }, []);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError(null);
      
      // Validate dates
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      
      if (endDate < startDate) {
        throw new Error('End date cannot be before start date');
      }
      
      const tournamentData = {
        ...formData,
        organizerId: user._id
      };
      
      const newTournament = await createTournament(tournamentData);
      
      // Redirect to tournament details
      navigate(`/tournament/${newTournament._id}`);
      
    } catch (error) {
      console.error('Error creating tournament:', error);
      setError(error.message || 'Failed to create tournament. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return <Loader fullPage text="Loading..." />;
  }
  
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Create Tournament</PageTitle>
        <Button as={Link} to={formData.gameId ? `/tournaments/${formData.gameId}` : "/games"}>
          <FaArrowLeft /> Back
        </Button>
      </PageHeader>
      
      {error && <Alert type="danger">{error}</Alert>}
      
      <FormContainer onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="name">Tournament Name</Label>
          <Input 
            id="name" 
            name="name" 
            value={formData.name} 
            onChange={handleChange}
            placeholder="Enter tournament name"
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="gameId">Game</Label>
          <Select 
            id="gameId" 
            name="gameId" 
            value={formData.gameId} 
            onChange={handleChange}
            required
          >
            <option value="">-- Select Game --</option>
            {games.map(game => (
              <option key={game._id} value={game._id}>
                {game.name}
              </option>
            ))}
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="format">Tournament Format</Label>
          <Select 
            id="format" 
            name="format" 
            value={formData.format} 
            onChange={handleChange}
            required
          >
            <option value="single_elimination">Single Elimination</option>
            <option value="double_elimination">Double Elimination</option>
            <option value="round_robin">Round Robin</option>
            <option value="swiss">Swiss System</option>
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="startDate">Start Date</Label>
          <Input 
            id="startDate" 
            name="startDate" 
            type="date" 
            value={formData.startDate} 
            onChange={handleChange}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="endDate">End Date</Label>
          <Input 
            id="endDate" 
            name="endDate" 
            type="date" 
            value={formData.endDate} 
            onChange={handleChange}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="rules">Tournament Rules</Label>
          <Textarea 
            id="rules" 
            name="rules" 
            value={formData.rules} 
            onChange={handleChange}
            placeholder="Enter tournament rules and guidelines"
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input 
            id="imageUrl" 
            name="imageUrl" 
            value={formData.imageUrl} 
            onChange={handleChange}
            placeholder="Enter image URL for tournament banner"
          />
        </FormGroup>
        
        <FormGroup>
          <Checkbox>
            <input 
              id="registrationOpen" 
              name="registrationOpen" 
              type="checkbox" 
              checked={formData.registrationOpen} 
              onChange={handleChange}
            />
            <Label htmlFor="registrationOpen" style={{display: 'inline', marginBottom: 0}}>
              Open for Registration
            </Label>
          </Checkbox>
        </FormGroup>
        
        <ButtonContainer>
          <Button 
            type="submit" 
            disabled={submitting}
          >
            <FaSave /> {submitting ? 'Creating...' : 'Create Tournament'}
          </Button>
        </ButtonContainer>
      </FormContainer>
    </PageContainer>
  );
};

export default TournamentCreate;
