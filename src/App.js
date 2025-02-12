import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "./firebase"; // Firebase initialization
import HomePage from "./routes/HomePage";
import LoginPage from "./routes/LoginPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import SignupPage from "./routes/SignupPage";
import LeaderboardPage from "./routes/LeaderboardPage";
import { AppProvider } from "./context/AppContext";
import PostCommentPage from "./routes/PostCommentPage";
import "./App.css"; // Adjust the path as needed

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Loading is complete
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <AutoRedirect />
      {loading && (
        <div className="loaderContainer">
          <span className="loader"></span>
        </div>
      )}
      <Routes>
        {!loading && (
          <>
            <Route
              path="/"
              element={
                <ProtectedRoute user={user}>
                  <AppProvider>
                    <HomePage />
                  </AppProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/leaderboard"
              element={
                <ProtectedRoute user={user}>
                  <AppProvider>
                    <LeaderboardPage />
                  </AppProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/comments"
              element={
                <ProtectedRoute user={user}>
                  <AppProvider>
                    <PostCommentPage />
                  </AppProvider>
                </ProtectedRoute>
              }
            />
          </>
        )}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </Router>
  );
}

// AutoRedirect Component to handle refresh redirects
function AutoRedirect() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname !== "/") {
      navigate("/");
    }
  }, []);

  return null; // This component does not render anything
}

export default App;
