import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import UserOnboarding from "./Auth/UserOnboarding";
import ProfileSetup from "./Profiles/ProfileSetup";

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          // Check if user has a profile
          const { data: profile, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.session.user.id)
            .single();

          if (error && error.code !== "PGRST116") {
            console.error("Error checking profile:", error);
          }

          if (profile) {
            setIsAuthenticated(true);
            setShowProfileSetup(false);
          } else {
            setIsAuthenticated(true);
            setShowProfileSetup(true);
          }
        }
      } catch (error) {
        console.error("Session check error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const handleAuthentication = () => {
    setIsAuthenticated(true);
    setShowProfileSetup(true);
  };

  const handleProfileSetupComplete = () => {
    setShowProfileSetup(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen bg-background">
      {!isAuthenticated ? (
        <UserOnboarding onComplete={handleAuthentication} />
      ) : showProfileSetup ? (
        <ProfileSetup onComplete={handleProfileSetupComplete} />
      ) : (
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome to Travlink</h1>
          <p className="text-muted-foreground">
            You have successfully signed in!
          </p>
          <button
            className="mt-6 px-4 py-2 bg-primary text-white rounded"
            onClick={() => setShowProfileSetup(true)}
          >
            Set Up Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
