import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Public Pages
import Home from './pages/public/Home';
import Games from './pages/public/Games';
import TournamentDetails from './pages/public/TournamentDetails';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Protected Route Component
const ProtectedRoute = ({ element, requiredRole }) => {
  // This is a placeholder for the actual implementation
  // The real implementation will check if the user is authenticated and has the required role
  return element;
};

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
`;

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContainer>
          <Navbar />
          <MainContent>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/games" element={<Games />} />
              <Route path="/tournament/:id" element={<TournamentDetails />} />
              <Route path="/tournaments/:gameId" element={<Games />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Admin Routes */}
              <Route 
                path="/dashboard/admin/*" 
                element={
                  <ProtectedRoute 
                    element={<div>Admin Dashboard (To be implemented)</div>} 
                    requiredRole="admin" 
                  />
                } 
              />
              
              {/* Organizer Routes */}
              <Route 
                path="/dashboard/organizer/*" 
                element={
                  <ProtectedRoute 
                    element={<div>Organizer Dashboard (To be implemented)</div>} 
                    requiredRole="organizer" 
                  />
                } 
              />
              
              {/* Player Routes */}
              <Route 
                path="/dashboard/player/*" 
                element={
                  <ProtectedRoute 
                    element={<div>Player Dashboard (To be implemented)</div>} 
                    requiredRole="player" 
                  />
                } 
              />
              
              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </MainContent>
          <Footer />
          <ToastContainer position="bottom-right" />
        </AppContainer>
      </Router>
    </AuthProvider>
  );
}

export default App;
