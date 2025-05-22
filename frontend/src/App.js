import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
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
import GameTournaments from './pages/public/GameTournaments';

// Organizer Pages
import MatchUpdate from './pages/organizer/MatchUpdate';
import TournamentCreate from './pages/organizer/TournamentCreate';
import AddGame from './pages/organizer/AddGame';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
`;

function App() {
  // ✅ ProtectedRoute must be declared **after** AuthProvider is active
  const ProtectedRoute = ({ element, requiredRole }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!user) {
      return <Navigate to="/login" />;
    }

    if (requiredRole && user.role !== requiredRole) {
      return <Navigate to="/" />;
    }

    return element;
  };

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
              <Route path="/tournaments/:gameId" element={<GameTournaments />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Organizer Routes */}
              <Route
                path="/match/:id/update"
                element={<ProtectedRoute element={<MatchUpdate />} requiredRole="organizer" />}
              />
              <Route
                path="/tournaments/add"
                element={<ProtectedRoute element={<TournamentCreate />} requiredRole="organizer" />}
              />
              <Route
                path="/games/add"
                element={<ProtectedRoute element={<AddGame />} requiredRole="organizer" />}
              />
              <Route
                path="/dashboard/organizer/*"
                element={<ProtectedRoute element={<div>Organizer Dashboard (To be implemented)</div>} requiredRole="organizer" />}
              />

              {/* Admin Routes */}
              <Route
                path="/dashboard/admin/*"
                element={<ProtectedRoute element={<div>Admin Dashboard (To be implemented)</div>} requiredRole="admin" />}
              />

              {/* Player Routes */}
              <Route
                path="/dashboard/player/*"
                element={<ProtectedRoute element={<div>Player Dashboard (To be implemented)</div>} requiredRole="player" />}
              />

              {/* Fallback */}
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
