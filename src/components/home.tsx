import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserOnboarding from "./Auth/UserOnboarding";
import ProfileSetup from "./Profiles/ProfileSetup";

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  const navigate = useNavigate();

  // No session check - always show login

  const handleAuthentication = () => {
    setIsAuthenticated(true);
    setShowProfileSetup(true);
  };

  const handleProfileSetupComplete = () => {
    setShowProfileSetup(false);
    navigate("/maps");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-background">
      {showProfileSetup ? (
        <ProfileSetup onComplete={handleProfileSetupComplete} />
      ) : (
        <UserOnboarding onComplete={handleAuthentication} />
      )}
    </div>
  );
};

export default Home;
