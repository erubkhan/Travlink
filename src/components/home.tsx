import React, { useState } from "react";
import UserOnboarding from "./Auth/UserOnboarding";

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthentication = () => {
    setIsAuthenticated(true);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-background">
      {isAuthenticated ? (
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">
            Welcome to Traveler Connect
          </h1>
          <p className="text-muted-foreground">
            You have successfully signed in!
          </p>
        </div>
      ) : (
        <UserOnboarding onComplete={handleAuthentication} />
      )}
    </div>
  );
};

export default Home;
