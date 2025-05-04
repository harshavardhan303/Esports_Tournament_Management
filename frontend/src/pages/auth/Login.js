import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Loader from '../../components/common/Loader';

const LoginContainer = styled.div`
  max-width: 500px;
  margin: 3rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const LoginTitle = styled.h2`
  color: #1a2a6c;
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const LoginSubtitle = styled.p`
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

const ButtonContainer = styled.div`
  margin-top: 1rem;
`;

const RegisterLink = styled.div`
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

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await login(email, password);
      
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <LoginContainer>
      <LoginHeader>
        <LoginTitle>Welcome Back</LoginTitle>
        <LoginSubtitle>Sign in to access your account</LoginSubtitle>
      </LoginHeader>
      
      {error && <Alert type="danger">{error}</Alert>}
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="email">Email Address</Label>
          <InputGroup>
            <InputIcon>
              <FaUser />
            </InputIcon>
            <Input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
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
                <Loader size="small" text="" /> Signing In...
              </>
            ) : (
              <>
                <FaSignInAlt /> Sign In
              </>
            )}
          </Button>
        </ButtonContainer>
      </Form>
      
      <RegisterLink>
        Don't have an account? <Link to="/register">Register now</Link>
      </RegisterLink>
    </LoginContainer>
  );
};

export default Login;
