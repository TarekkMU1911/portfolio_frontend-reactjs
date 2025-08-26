import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/register";
import Login from "./pages/login";
import Dashboard from "./pages/portfolioCreation";
import Portfolio from "./pages/portfolioView";
import Home from "./pages/home";
import { useAuth, AuthProvider } from "./context/authContext";
import { PortfolioProvider } from "./context/createPContext";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function DashboardWrapper() {
  const { user } = useAuth();
  if (!user) return <div>Loading user...</div>;

  return (
    <PortfolioProvider userId={user.id}>
      <Dashboard />
    </PortfolioProvider>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      
      {/* Home page */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      {/* Portfolio Creation */}
      <Route
        path="/portfolioCreation"
        element={
          <ProtectedRoute>
            <DashboardWrapper />
          </ProtectedRoute>
        }
      />

      {/* Portfolio View */}
      <Route
        path="/portfolio/:id"
        element={
          <ProtectedRoute>
            <Portfolio />
          </ProtectedRoute>
        }
      />

      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
