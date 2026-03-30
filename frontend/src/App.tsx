import { Route, Routes } from "react-router-dom";

import LoginModal from "./components/LoginModal";
import Navbar from "./components/Navbar";
import RegisterPage from "./pages/RegisterPage";
import VerifyPage from "./pages/VerifyPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import { useAuthStore } from "./stores/useAuthStore";
import { useEffect } from "react";
import LoadingOverlay from "./components/LoadingOverlay";
import HomePage from "./pages/HomePage";
import EventDetailPage from "./pages/EventDetailPage";
import OrganizerDashboard from "./pages/OrganizerDashboard";

const App = () => {
  const { isCheckingAuth, checkAuth, user } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  if (isCheckingAuth) return <LoadingOverlay />;
  return (
    <div className="min-h-screen">
      <Navbar />
      <LoginModal />
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/verify-email" element={<VerifyPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/:id" element={<EventDetailPage />} />
        <Route path="/dashboard" element={<OrganizerDashboard />} />
      </Routes>
    </div>
  );
};

export default App;
