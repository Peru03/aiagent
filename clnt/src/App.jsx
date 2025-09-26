import { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Box } from "@mui/material";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import Orders from "./pages/Orders";
import Sidebar from "./components/Sidebar";
import { AuthProvider, AuthContext } from "./AuthContext";
import ChatContainer from "./pages/ChatContainer";

// Protected Route: only accessible if token exists
function ProtectedRoute({ children }) {
  const { token } = useContext(AuthContext);
  const storedToken = localStorage.getItem("token");

  if (!token && !storedToken) return <Navigate to="/login" />;

  return children;
}

// Public Route: only accessible if NOT logged in
function PublicRoute({ children }) {
  const { token } = useContext(AuthContext);
  const storedToken = localStorage.getItem("token");

  if (token || storedToken) return <Navigate to="/dashboard" />;

  return children;
}

// Layout for authenticated pages (Sidebar + main content)
function AppLayout({ children }) {
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "#f5f5f5", minHeight: "100vh", p: 3 }}
      >
        {children}
      </Box>
    </Box>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Login Route */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ChatContainer />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Orders />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
