import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/register";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Portfolio from "./pages/portfolio";
import { useAuth, AuthProvider } from "./context/authContext";
import { PortfolioProvider } from "./context/dashboardContext";


function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function DashboardWrapper() {
  const { user } = useAuth();
  if (!user) return <div>Loading user...</div>;

  return (
    <PortfolioProvider username={user.username}>
      <Dashboard />
    </PortfolioProvider>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardWrapper />
          </ProtectedRoute>
        }
      />
      <Route path="/:username" element={<Portfolio />} />
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
