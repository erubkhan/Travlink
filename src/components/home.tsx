import React, { useState } from "react";
import { MapPin, Filter, MessageSquare, Settings, User } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import TravelerMap from "./Map/TravelerMap";
import TravelerFilters from "./Filters/TravelerFilters";
import ProfileCard from "./Profiles/ProfileCard";
import UserOnboarding from "./Auth/UserOnboarding";

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState<null | {
    id: string;
    name: string;
    nationality: string;
    languages: string[];
    interests: string[];
    availability: string;
    avatar: string;
  }>(null);

  // Mock function to handle user authentication
  const handleAuthentication = () => {
    setIsAuthenticated(true);
  };

  // Mock function to handle user selection from map
  const handleUserSelect = (user: any) => {
    setSelectedUser(user);
  };

  // Mock function to close profile card
  const handleCloseProfile = () => {
    setSelectedUser(null);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-background">
      {!isAuthenticated ? (
        <div className="flex items-center justify-center h-full w-full">
          <UserOnboarding onComplete={handleAuthentication} />
        </div>
      ) : (
        <>
          {/* Header */}
          <header className="flex items-center justify-between px-4 py-2 border-b">
            <div className="flex items-center space-x-2">
              <MapPin className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Traveler Connect</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-5 w-5" />
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar>
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user123" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <div className="flex flex-col space-y-4 mt-6">
                    <div className="flex flex-col items-center space-y-2">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user123" />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <h2 className="text-xl font-semibold">Your Profile</h2>
                    </div>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Edit Profile
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-destructive"
                      >
                        Log Out
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </header>

          {/* Filters */}
          {showFilters && (
            <div className="px-4 py-2 border-b">
              <TravelerFilters />
            </div>
          )}

          {/* Main Content - Map */}
          <main className="flex-1 relative">
            <TravelerMap onUserSelect={handleUserSelect} />

            {/* Selected User Profile Card */}
            {selectedUser && (
              <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-full max-w-sm px-4">
                <ProfileCard user={selectedUser} onClose={handleCloseProfile} />
              </div>
            )}
          </main>

          {/* Bottom Navigation */}
          <nav className="flex items-center justify-around px-4 py-3 border-t bg-background">
            <Button variant="ghost" className="flex flex-col items-center">
              <MapPin className="h-5 w-5" />
              <span className="text-xs">Map</span>
            </Button>
            <Button variant="ghost" className="flex flex-col items-center">
              <MessageSquare className="h-5 w-5" />
              <span className="text-xs">Messages</span>
            </Button>
            <Button variant="ghost" className="flex flex-col items-center">
              <Settings className="h-5 w-5" />
              <span className="text-xs">Settings</span>
            </Button>
          </nav>
        </>
      )}
    </div>
  );
};

export default Home;
