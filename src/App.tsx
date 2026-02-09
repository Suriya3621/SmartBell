import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Verify from "./pages/Verify";
import BellPage from "./pages/BellPage";
import React from "react";

function App() {
  const isAuthenticated = () => {
    return sessionStorage.getItem("access") === "true";
  };

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/verify" replace />;
    }
    return <>{children}</>;
  };

  return (
    <Router>
      <Routes>
        {/* Default route */}
        <Route
          path="/"
          element={
            isAuthenticated() ? (
              <Navigate to="/home" replace />
            ) : (
              <Navigate to="/verify" replace />
            )
          }
        />

        {/* Public */}
        <Route path="/verify" element={<Verify />} />

        {/* Protected with nested routes */}
        <Route
          path="/home/*"
          element={
            <ProtectedRoute>
              <BellPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/verify" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
