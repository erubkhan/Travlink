import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import {
  ChevronRight,
  ChevronLeft,
  User,
  Globe,
  Clock,
  Shield,
  AlertCircle,
  Apple,
  Mail,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

interface UserOnboardingProps {
  onComplete?: () => void;
  isOpen?: boolean;
}

const UserOnboarding = ({
  onComplete = () => {},
  isOpen = true,
}: UserOnboardingProps) => {
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  // User profile data
  const [userData, setUserData] = useState({
    fullName: "",
    nationality: "",
    languages: "",
    interests: [] as string[],
    duration: "",
    availability: "",
    privacySettings: {
      showLocation: false,
      appearOffline: false,
      profileVisibility: "everyone",
    },
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.fullName || "",
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        toast({
          title: "Account created",
          description: "Please check your email to verify your account",
        });
        setStep(2); // Move to profile creation
      }
    } catch (error: any) {
      setError(error.message || "An error occurred during sign up");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        //Check if profile exists
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();

        if (profileError && profileError.code !== "PGRST116")
          throw profileError;

        if (!profile) {
          // Profile does not exist, move to profile creation
          setStep(2);
        } else {
          toast({
            title: "Welcome back",
            description: "You have successfully signed in",
          });
          onComplete();
        }
      }
    } catch (error: any) {
      setError(error.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) throw error;

      // The user will be redirected to Google for authentication
      // No need to handle success case here as the page will redirect
    } catch (error: any) {
      setError(error.message || "Failed to sign in with Google");
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "apple",
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) throw error;

      // The user will be redirected to Apple for authentication
      // No need to handle success case here as the page will redirect
    } catch (error: any) {
      setError(error.message || "Failed to sign in with Apple");
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step === 1 && activeTab === "register") {
      handleSignUp();
      return;
    } else if (step === 1 && activeTab === "login") {
      handleSignIn();
      return;
    }

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
        show_location: userData.privacySettings.showLocation,
        appear_offline: userData.privacySettings.appearOffline,
        profile_visibility: userData.privacySettings.profileVisibility,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });

      onComplete();
    } catch (error: any) {
      setError(error.message || "Failed to update profile");
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="w-full max-w-md bg-white">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-center">
            {step === 1 && "Welcome to Traveler Connect"}
            {step === 2 && "Create Your Profile"}
            {step === 3 && "Travel Preferences"}
            {step === 4 && "Privacy Settings"}
          </CardTitle>
          <CardDescription className="text-center">
            {step === 1 && "Sign up or log in to get started"}
            {step === 2 && "Tell us about yourself"}
            {step === 3 && "Set your travel interests and availability"}
            {step === 4 && "Control who can see your information"}
          </CardDescription>
          <Progress value={progress} className="h-1 mt-2" />
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {step === 1 && (
            <Tabs
              defaultValue={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="register">Register</TabsTrigger>
                <TabsTrigger value="login">Login</TabsTrigger>
              </TabsList>
              <TabsContent value="register" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-muted-foreground">
                        Or register with
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-col space-y-2">
                    <Button
                      variant="outline"
                      type="button"
                      disabled={loading}
                      onClick={handleGoogleSignIn}
                      className="flex items-center justify-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        className="h-5 w-5"
                      >
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Google
                    </Button>
                    <Button
                      variant="outline"
                      type="button"
                      disabled={loading}
                      onClick={handleAppleSignIn}
                      className="flex items-center justify-center gap-2"
                    >
                      <Apple className="h-5 w-5" />
                      Apple
                    </Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="login" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-col space-y-2">
                    <Button
                      variant="outline"
                      type="button"
                      disabled={loading}
                      onClick={handleGoogleSignIn}
                      className="flex items-center justify-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        className="h-5 w-5"
                      >
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Google
                    </Button>
                    <Button
                      variant="outline"
                      type="button"
                      disabled={loading}
                      onClick={handleAppleSignIn}
                      className="flex items-center justify-center gap-2"
                    >
                      <Apple className="h-5 w-5" />
                      Apple
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}

          {step === 2 && (
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
            </div>
          )}

          {step === 3 && (
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

          {step === 4 && (
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

export default UserOnboarding;
