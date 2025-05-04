import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaUser, FaLock, FaEnvelope, FaUserTag, FaUserPlus } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Loader from '../../components/common/Loader';

const RegisterContainer = styled.div`
  max-width: 500px;
  margin: 3rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const RegisterHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const RegisterTitle = styled.h2`
  color: #1a2a6c;
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const RegisterSubtitle = styled.p`
  color: #666;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
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

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  
  &:focus-within {
    border-color: #1a2a6c;
    box-shadow: 0 0 0 2px rgba(26, 42, 108, 0.2);
  }
`;

const InputIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;
  background: #f8f9fa;
  color: #6c757d;
  border-right: 1px solid #ddd;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: none;
  outline: none;
  font-size: 1rem;
  
  &:focus {
    outline: none;
  }
`;

const Select = styled.select`
  flex: 1;
  padding: 0.75rem;
  border: none;
  outline: none;
  font-size: 1rem;
  background: white;
  
  &:focus {
    outline: none;
  }
`;

const ButtonContainer = styled.div`
  margin-top: 1rem;
`;

const LoginLink = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
  
  a {
    color: #1a2a6c;
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'player'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const { name, email, password, confirmPassword, role } = formData;
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await register({
        name,
        email,
        password,
        role
      });
      
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <RegisterContainer>
      <RegisterHeader>
        <RegisterTitle>Create Account</RegisterTitle>
        <RegisterSubtitle>Join the TEC Esports community</RegisterSubtitle>
      </RegisterHeader>
      
      {error && <Alert type="danger">{error}</Alert>}
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="name">Full Name</Label>
          <InputGroup>
            <InputIcon>
              <FaUser />
            </InputIcon>
            <Input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your full name"
              value={name}
              onChange={handleChange}
              required
            />
          </InputGroup>
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="email">Email Address</Label>
          <InputGroup>
            <InputIcon>
              <FaEnvelope />
            </InputIcon>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleChange}
              required
            />
          </InputGroup>
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="password">Password</Label>
          <InputGroup>
            <InputIcon>
              <FaLock />
            </InputIcon>
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="Create a password"
              value={password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </InputGroup>
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <InputGroup>
            <InputIcon>
              <FaLock />
            </InputIcon>
            <Input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={handleChange}
              required
              minLength="6"
            />
          </InputGroup>
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="role">Account Type</Label>
          <InputGroup>
            <InputIcon>
              <FaUserTag />
            </InputIcon>
            <Select
              id="role"
              name="role"
              value={role}
              onChange={handleChange}
            >
              <option value="player">Player</option>
              <option value="organizer">Tournament Organizer</option>
            </Select>
          </InputGroup>
        </FormGroup>
        
        <ButtonContainer>
          <Button 
            type="submit" 
            disabled={loading} 
            style={{ width: '100%' }}
          >
            {loading ? (
              <>
                <Loader size="small" text="" /> Creating Account...
              </>
            ) : (
              <>
                <FaUserPlus /> Create Account
              </>
            )}
          </Button>
        </ButtonContainer>
      </Form>
      
      <LoginLink>
        Already have an account? <Link to="/login">Sign in</Link>
      </LoginLink>
    </RegisterContainer>
  );
};

export default Register;
