import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import { getMatchById, updateMatchResults } from '../../services/matchService';
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

const MatchTeams = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
`;

const Team = styled.div`
  text-align: center;
  flex: 1;
`;

const TeamName = styled.div`
  font-weight: 600;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const Versus = styled.div`
  font-weight: 600;
  color: #666;
  padding: 0 1rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const MatchUpdate = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [match, setMatch] = useState(null);
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [status, setStatus] = useState('scheduled');
  const [winnerId, setWinnerId] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const matchData = await getMatchById(id);
        setMatch(matchData);
        setScoreA(matchData.scoreA || 0);
        setScoreB(matchData.scoreB || 0);
        setStatus(matchData.status || 'scheduled');
        setWinnerId(matchData.winner?._id || '');
      } catch (error) {
        console.error('Error fetching match:', error);
        setError('Failed to load match details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMatch();
  }, [id]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError(null);
      
      const updatedMatch = await updateMatchResults(id, {
        scoreA,
        scoreB,
        status,
        winnerId: status === 'completed' ? winnerId : null
      });
      
      // Redirect back to tournament details
      navigate(`/tournament/${updatedMatch.tournamentId}`);
      
    } catch (error) {
      console.error('Error updating match:', error);
      setError(error.message || 'Failed to update match. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return <Loader fullPage text="Loading match details..." />;
  }
  
  if (error) {
    return (
      <PageContainer>
        <Alert type="danger">{error}</Alert>
        <Button as={Link} to={`/tournament/${match?.tournamentId}`} style={{marginTop: '1rem'}}>
          <FaArrowLeft /> Back to Tournament
        </Button>
      </PageContainer>
    );
  }
  
  if (!match) {
    return (
      <PageContainer>
        <Alert type="danger">Match not found</Alert>
        <Button as={Link} to="/games" style={{marginTop: '1rem'}}>
          <FaArrowLeft /> Back to Games
        </Button>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Update Match Result</PageTitle>
        <Button as={Link} to={`/tournament/${match.tournamentId}`}>
          <FaArrowLeft /> Back to Tournament
        </Button>
      </PageHeader>
      
      <FormContainer onSubmit={handleSubmit}>
        <MatchTeams>
          <Team>
            <TeamName>{match.teamA?.teamName || 'Team A'}</TeamName>
          </Team>
          <Versus>VS</Versus>
          <Team>
            <TeamName>{match.teamB?.teamName || 'Team B'}</TeamName>
          </Team>
        </MatchTeams>
        
        <FormGroup>
          <Label htmlFor="status">Match Status</Label>
          <Select 
            id="status" 
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="scheduled">Scheduled</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="scoreA">{match.teamA?.teamName || 'Team A'} Score</Label>
          <Input 
            id="scoreA" 
            type="number" 
            min="0"
            value={scoreA} 
            onChange={(e) => setScoreA(parseInt(e.target.value, 10) || 0)}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="scoreB">{match.teamB?.teamName || 'Team B'} Score</Label>
          <Input 
            id="scoreB" 
            type="number" 
            min="0"
            value={scoreB} 
            onChange={(e) => setScoreB(parseInt(e.target.value, 10) || 0)}
            required
          />
        </FormGroup>
        
        {status === 'completed' && (
          <FormGroup>
            <Label htmlFor="winner">Winner</Label>
            <Select 
              id="winner" 
              value={winnerId} 
              onChange={(e) => setWinnerId(e.target.value)}
              required={status === 'completed'}
            >
              <option value="">-- Select Winner --</option>
              <option value={match.teamA?._id}>{match.teamA?.teamName || 'Team A'}</option>
              <option value={match.teamB?._id}>{match.teamB?.teamName || 'Team B'}</option>
            </Select>
          </FormGroup>
        )}
        
        <ButtonContainer>
          <Button 
            type="submit" 
            disabled={submitting}
          >
            <FaSave /> {submitting ? 'Saving...' : 'Save Result'}
          </Button>
        </ButtonContainer>
      </FormContainer>
    </PageContainer>
  );
};

export default MatchUpdate;
