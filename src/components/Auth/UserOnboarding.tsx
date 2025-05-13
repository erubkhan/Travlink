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
} from "lucide-react";

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

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
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
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                  />
                </div>
              </TabsContent>
              <TabsContent value="login" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                  />
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
                <Input id="name" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality</Label>
                <Select>
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
                <Select>
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
                    <Checkbox id="food" />
                    <Label htmlFor="food">Food & Dining</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="culture" />
                    <Label htmlFor="culture">Culture & Arts</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="nature" />
                    <Label htmlFor="nature">Nature & Outdoors</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="nightlife" />
                    <Label htmlFor="nightlife">Nightlife</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="history" />
                    <Label htmlFor="history">History</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="adventure" />
                    <Label htmlFor="adventure">Adventure</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mt-6">
                <Label htmlFor="duration">Duration of Stay</Label>
                <Select>
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
                <Select>
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
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Appear offline</h3>
                  <p className="text-sm text-muted-foreground">
                    Hide your online status from other users
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Profile visibility</h3>
                  <p className="text-sm text-muted-foreground">
                    Control who can view your full profile
                  </p>
                </div>
                <Select>
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
            <Button onClick={handleNext}>
              {step < totalSteps ? (
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
