import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, User, Calendar, Globe, X } from "lucide-react";

interface ProfileCardProps {
  user?: {
    id: string;
    name: string;
    avatar: string;
    nationality: string;
    languages: string[];
    interests: string[];
    availability: "Available" | "Busy" | "Offline";
    duration: string;
  };
  onClose?: () => void;
  onViewProfile?: (userId: string) => void;
  onMessage?: (userId: string) => void;
}

const ProfileCard = ({
  user = {
    id: "1",
    name: "Sarah Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    nationality: "United States",
    languages: ["English", "Spanish", "French"],
    interests: ["Hiking", "Photography", "Local Cuisine"],
    availability: "Available",
    duration: "2 weeks",
  },
  onClose = () => {},
  onViewProfile = () => {},
  onMessage = () => {},
}: ProfileCardProps) => {
  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-500";
      case "Busy":
        return "bg-yellow-500";
      case "Offline":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card className="w-[350px] bg-white shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="relative pb-2">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        <div className="flex flex-col items-center">
          <Avatar className="h-20 w-20 mb-2">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <h3 className="text-xl font-bold">{user.name}</h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Globe className="h-4 w-4" />
            <span>{user.nationality}</span>
          </div>
          <div className="flex items-center mt-1">
            <div
              className={`h-2 w-2 rounded-full mr-2 ${getAvailabilityColor(user.availability)}`}
            ></div>
            <span className="text-sm">{user.availability}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold mb-1">Languages</h4>
          <div className="flex flex-wrap gap-1">
            {user.languages.map((language, index) => (
              <Badge key={index} variant="outline">
                {language}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-1">Interests</h4>
          <div className="flex flex-wrap gap-1">
            {user.interests.map((interest, index) => (
              <Badge key={index} variant="secondary">
                {interest}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">Staying for {user.duration}</span>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between pt-2">
        <Button
          variant="outline"
          size="sm"
          className="w-[48%]"
          onClick={() => onViewProfile(user.id)}
        >
          <User className="h-4 w-4 mr-2" />
          View Profile
        </Button>
        <Button
          variant="default"
          size="sm"
          className="w-[48%]"
          onClick={() => onMessage(user.id)}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Message
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;
