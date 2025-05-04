import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import styled from 'styled-components';
import { FaSignOutAlt, FaUser, FaGamepad, FaTrophy, FaUsers } from 'react-icons/fa';

const NavbarContainer = styled.nav`
  background: linear-gradient(90deg, #1a2a6c, #b21f1f, #fdbb2d);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Logo = styled(Link)`
  font-size: 1.8rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  
  &:hover {
    color: #f0f0f0;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: white;
  margin-left: 1.5rem;
  text-decoration: none;
  display: flex;
  align-items: center;
  
  &:hover {
    color: #f0f0f0;
  }
  
  svg {
    margin-right: 0.5rem;
  }
`;

const Button = styled.button`
  background: transparent;
  border: 1px solid white;
  color: white;
  padding: 0.5rem 1rem;
  margin-left: 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  svg {
    margin-right: 0.5rem;
  }
`;

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <NavbarContainer>
      <Logo to="/">
        <FaTrophy style={{ marginRight: '0.5rem' }} /> TEC Esports
      </Logo>
      <NavLinks>
        <NavLink to="/games">
          <FaGamepad /> Games
        </NavLink>
        
        {user ? (
          <>
            {/* Links based on user role */}
            {user.role === 'admin' && (
              <NavLink to="/dashboard/admin">
                <FaUsers /> Admin Dashboard
              </NavLink>
            )}
            
            {user.role === 'organizer' && (
              <NavLink to="/dashboard/organizer">
                <FaTrophy /> Organizer Dashboard
              </NavLink>
            )}
            
            {user.role === 'player' && (
              <NavLink to="/dashboard/player">
                <FaGamepad /> Player Dashboard
              </NavLink>
            )}
            
            <NavLink to="/profile">
              <FaUser /> Profile
            </NavLink>
            
            <Button onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </Button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </NavLinks>
    </NavbarContainer>
  );
};

export default Navbar;
