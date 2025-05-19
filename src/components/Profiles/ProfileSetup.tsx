import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

interface ProfileSetupProps {
  onComplete?: () => void;
}

const ProfileSetup = ({ onComplete = () => {} }: ProfileSetupProps) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // User profile data
  const [userData, setUserData] = useState({
    fullName: "",
    nationality: "",
    languages: "",
    interests: [] as string[],
    duration: "",
    availability: "",
    currentLocation: {
      city: "",
      country: "",
    },
    privacySettings: {
      showLocation: false,
      appearOffline: false,
      profileVisibility: "everyone",
    },
  });

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  // Load user data if available
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          // Try to get existing profile data
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          if (profile) {
            setUserData({
              fullName: profile.full_name || "",
              nationality: profile.nationality || "",
              languages: profile.languages || "",
              interests: profile.interests || [],
              duration: profile.duration_of_stay || "",
              availability: profile.availability_status || "",
              currentLocation: {
                city: profile.current_city || "",
                country: profile.current_country || "",
              },
              privacySettings: {
                showLocation: profile.show_location || false,
                appearOffline: profile.appear_offline || false,
                profileVisibility: profile.profile_visibility || "everyone",
              },
            });
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    loadUserData();
  }, []);

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Save profile data to Supabase
      saveUserProfile();
    }
  };

  const saveUserProfile = async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("User not found");

      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: userData.fullName,
        nationality: userData.nationality,
        languages: userData.languages,
        interests: userData.interests,
        duration_of_stay: userData.duration,
        availability_status: userData.availability,
        current_city: userData.currentLocation.city,
        current_country: userData.currentLocation.country,
        show_location: userData.privacySettings.showLocation,
        appear_offline: userData.privacySettings.appearOffline,
        profile_visibility: userData.privacySettings.profileVisibility,
        updated_at: new Date().toISOString(),
        profile_completed: true,
      });

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully created",
      });

      console.log("Calling onComplete");
      onComplete();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update profile",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleInterestToggle = (interest: string) => {
    setUserData((prev) => {
      const interests = [...prev.interests];
      if (interests.includes(interest)) {
        return { ...prev, interests: interests.filter((i) => i !== interest) };
      } else {
        return { ...prev, interests: [...interests, interest] };
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="w-full max-w-md bg-white">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-center">
            {step === 1 && "Create Your Profile"}
            {step === 2 && "Travel Preferences"}
            {step === 3 && "Privacy Settings"}
          </CardTitle>
          <CardDescription className="text-center">
            {step === 1 && "Tell us about yourself"}
            {step === 2 && "Set your travel interests and availability"}
            {step === 3 && "Control who can see your information"}
          </CardDescription>
          <Progress value={progress} className="h-1 mt-2" />
        </CardHeader>

        <CardContent>
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex justify-center mb-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=traveler" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </div>
              <div className="text-center mb-4">
                <Button variant="outline" size="sm">
                  Upload Photo
                </Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={userData.fullName}
                  onChange={(e) =>
                    setUserData({ ...userData, fullName: e.target.value })
                  }
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality</Label>
                <Select
                  value={userData.nationality}
                  onValueChange={(value) =>
                    setUserData({ ...userData, nationality: value })
                  }
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your nationality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="au">Australia</SelectItem>
                    <SelectItem value="fr">France</SelectItem>
                    <SelectItem value="de">Germany</SelectItem>
                    <SelectItem value="jp">Japan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="languages">Languages Spoken</Label>
                <Select
                  value={userData.languages}
                  onValueChange={(value) =>
                    setUserData({ ...userData, languages: value })
                  }
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select languages" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="zh">Chinese</SelectItem>
                    <SelectItem value="ja">Japanese</SelectItem>
                    <SelectItem value="ko">Korean</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="current-city">Current City</Label>
                <Input
                  id="current-city"
                  placeholder="Paris"
                  value={userData.currentLocation.city}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      currentLocation: {
                        ...userData.currentLocation,
                        city: e.target.value,
                      },
                    })
                  }
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="current-country">Current Country</Label>
                <Input
                  id="current-country"
                  placeholder="France"
                  value={userData.currentLocation.country}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      currentLocation: {
                        ...userData.currentLocation,
                        country: e.target.value,
                      },
                    })
                  }
                  disabled={loading}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Travel Interests</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="food"
                      checked={userData.interests.includes("food")}
                      onCheckedChange={() => handleInterestToggle("food")}
                      disabled={loading}
                    />
                    <Label htmlFor="food">Food & Dining</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="culture"
                      checked={userData.interests.includes("culture")}
                      onCheckedChange={() => handleInterestToggle("culture")}
                      disabled={loading}
                    />
                    <Label htmlFor="culture">Culture & Arts</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="nature"
                      checked={userData.interests.includes("nature")}
                      onCheckedChange={() => handleInterestToggle("nature")}
                      disabled={loading}
                    />
                    <Label htmlFor="nature">Nature & Outdoors</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="nightlife"
                      checked={userData.interests.includes("nightlife")}
                      onCheckedChange={() => handleInterestToggle("nightlife")}
                      disabled={loading}
                    />
                    <Label htmlFor="nightlife">Nightlife</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="history"
                      checked={userData.interests.includes("history")}
                      onCheckedChange={() => handleInterestToggle("history")}
                      disabled={loading}
                    />
                    <Label htmlFor="history">History</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="adventure"
                      checked={userData.interests.includes("adventure")}
                      onCheckedChange={() => handleInterestToggle("adventure")}
                      disabled={loading}
                    />
                    <Label htmlFor="adventure">Adventure</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mt-6">
                <Label htmlFor="duration">Duration of Stay</Label>
                <Select
                  value={userData.duration}
                  onValueChange={(value) =>
                    setUserData({ ...userData, duration: value })
                  }
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="How long are you staying?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="few-days">Few days</SelectItem>
                    <SelectItem value="week">About a week</SelectItem>
                    <SelectItem value="two-weeks">Two weeks</SelectItem>
                    <SelectItem value="month">A month</SelectItem>
                    <SelectItem value="few-months">Few months</SelectItem>
                    <SelectItem value="long-term">
                      Long term / Living here
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 mt-6">
                <Label htmlFor="availability">Availability Status</Label>
                <Select
                  value={userData.availability}
                  onValueChange={(value) =>
                    setUserData({ ...userData, availability: value })
                  }
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Set your availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available to meet</SelectItem>
                    <SelectItem value="busy">Busy now, message me</SelectItem>
                    <SelectItem value="planning">
                      Planning future meetups
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Show my exact location</h3>
                  <p className="text-sm text-muted-foreground">
                    Others can see your precise location on the map
                  </p>
                </div>
                <Switch
                  checked={userData.privacySettings.showLocation}
                  onCheckedChange={(checked) =>
                    setUserData({
                      ...userData,
                      privacySettings: {
                        ...userData.privacySettings,
                        showLocation: checked,
                      },
                    })
                  }
                  disabled={loading}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Appear offline</h3>
                  <p className="text-sm text-muted-foreground">
                    Hide your online status from other users
                  </p>
                </div>
                <Switch
                  checked={userData.privacySettings.appearOffline}
                  onCheckedChange={(checked) =>
                    setUserData({
                      ...userData,
                      privacySettings: {
                        ...userData.privacySettings,
                        appearOffline: checked,
                      },
                    })
                  }
                  disabled={loading}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Profile visibility</h3>
                  <p className="text-sm text-muted-foreground">
                    Control who can view your full profile
                  </p>
                </div>
                <Select
                  value={userData.privacySettings.profileVisibility}
                  onValueChange={(value) =>
                    setUserData({
                      ...userData,
                      privacySettings: {
                        ...userData.privacySettings,
                        profileVisibility: value,
                      },
                    })
                  }
                  disabled={loading}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Everyone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="everyone">Everyone</SelectItem>
                    <SelectItem value="connected">Connected only</SelectItem>
                    <SelectItem value="none">No one</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 w-2 rounded-full ${i + 1 <= step ? "bg-primary" : "bg-gray-200"}`}
                />
              ))}
            </div>
            <Button onClick={handleNext} disabled={loading}>
              {loading ? (
                "Loading..."
              ) : step < totalSteps ? (
                <>
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </>
              ) : (
                "Get Started"
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfileSetup;
