import React, { useState, useEffect } from "react";
import { MapPin, Navigation, ZoomIn, ZoomOut, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface TravelerMapProps {
  travelers?: Traveler[];
  onSelectTraveler?: (traveler: Traveler) => void;
  currentLocation?: { lat: number; lng: number };
  zoom?: number;
}

interface Traveler {
  id: string;
  name: string;
  nationality: string;
  languages: string[];
  location: { lat: number; lng: number };
  avatar?: string;
  status: "available" | "busy" | "offline";
}

const TravelerMap: React.FC<TravelerMapProps> = ({
  travelers = [
    {
      id: "1",
      name: "John Doe",
      nationality: "USA",
      languages: ["English", "Spanish"],
      location: { lat: 40.712776, lng: -74.005974 },
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
      status: "available",
    },
    {
      id: "2",
      name: "Jane Smith",
      nationality: "UK",
      languages: ["English", "French"],
      location: { lat: 40.714776, lng: -74.003974 },
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
      status: "busy",
    },
    {
      id: "3",
      name: "Carlos Rodriguez",
      nationality: "Spain",
      languages: ["Spanish", "English", "Portuguese"],
      location: { lat: 40.715776, lng: -74.006974 },
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carlos",
      status: "available",
    },
  ],
  onSelectTraveler = () => {},
  currentLocation = { lat: 40.712776, lng: -74.005974 },
  zoom = 15,
}) => {
  const [mapZoom, setMapZoom] = useState(zoom);
  const [selectedCluster, setSelectedCluster] = useState<null | {
    lat: number;
    lng: number;
    count: number;
  }>(null);
  const [clusters, setClusters] = useState<
    Array<{ lat: number; lng: number; travelers: Traveler[]; count: number }>
  >([]);

  // Simulate map loading
  const [isMapLoading, setIsMapLoading] = useState(true);

  useEffect(() => {
    // Simulate map loading delay
    const timer = setTimeout(() => {
      setIsMapLoading(false);
      // Generate clusters based on traveler proximity
      generateClusters();
    }, 1000);

    return () => clearTimeout(timer);
  }, [travelers]);

  const generateClusters = () => {
    // This is a simplified clustering algorithm for demonstration
    // In a real app, you would use a proper clustering library
    const clusterRadius = 0.001; // approximately 100 meters
    const newClusters: Array<{
      lat: number;
      lng: number;
      travelers: Traveler[];
      count: number;
    }> = [];

    travelers.forEach((traveler) => {
      // Check if traveler can be added to an existing cluster
      const existingCluster = newClusters.find((cluster) => {
        const distance = Math.sqrt(
          Math.pow(cluster.lat - traveler.location.lat, 2) +
            Math.pow(cluster.lng - traveler.location.lng, 2),
        );
        return distance < clusterRadius;
      });

      if (existingCluster) {
        existingCluster.travelers.push(traveler);
        existingCluster.count += 1;
      } else {
        // Create a new cluster
        newClusters.push({
          lat: traveler.location.lat,
          lng: traveler.location.lng,
          travelers: [traveler],
          count: 1,
        });
      }
    });

    setClusters(newClusters);
  };

  const handleZoomIn = () => {
    setMapZoom((prev) => Math.min(prev + 1, 20));
  };

  const handleZoomOut = () => {
    setMapZoom((prev) => Math.max(prev - 1, 1));
  };

  const handleClusterClick = (cluster: {
    lat: number;
    lng: number;
    travelers: Traveler[];
    count: number;
  }) => {
    if (cluster.count === 1) {
      // If only one traveler in the cluster, select them directly
      onSelectTraveler(cluster.travelers[0]);
    } else {
      // Otherwise, show the cluster details
      setSelectedCluster(cluster);
    }
  };

  const handleCurrentLocationClick = () => {
    // In a real app, this would use the browser's geolocation API
    console.log("Navigate to current location");
    // Reset the map view to the current location
  };

  return (
    <div className="relative w-full h-full bg-gray-100 overflow-hidden rounded-lg">
      {isMapLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Map background - in a real app, this would be replaced with an actual map library */}
          <div
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&q=50')] bg-cover bg-center"
            style={{ filter: `brightness(${0.8 + mapZoom / 50})` }}
          ></div>

          {/* Map controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={handleZoomIn}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Zoom in</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={handleZoomOut}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Zoom out</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={handleCurrentLocationClick}
                  >
                    <Navigation className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Current location</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Current location marker */}
          <div
            className="absolute"
            style={{
              left: `calc(50% + ${(currentLocation.lng - -74.005974) * 10000}px)`,
              top: `calc(50% - ${(currentLocation.lat - 40.712776) * 10000}px)`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="h-4 w-4 bg-blue-500 rounded-full animate-pulse border-2 border-white shadow-lg"></div>
          </div>

          {/* Traveler clusters */}
          {clusters.map((cluster, index) => (
            <div
              key={index}
              className="absolute cursor-pointer"
              style={{
                left: `calc(50% + ${(cluster.lng - -74.005974) * 10000}px)`,
                top: `calc(50% - ${(cluster.lat - 40.712776) * 10000}px)`,
                transform: "translate(-50%, -50%)",
              }}
              onClick={() => handleClusterClick(cluster)}
            >
              {cluster.count === 1 ? (
                <div className="relative">
                  <MapPin
                    className={`h-8 w-8 ${
                      cluster.travelers[0].status === "available"
                        ? "text-green-500"
                        : cluster.travelers[0].status === "busy"
                          ? "text-amber-500"
                          : "text-gray-400"
                    }`}
                    strokeWidth={2}
                  />
                  <div
                    className="absolute bottom-0 right-0 h-5 w-5 rounded-full bg-white overflow-hidden border-2 border-white"
                    style={{ transform: "translate(25%, 0%)" }}
                  >
                    <img
                      src={
                        cluster.travelers[0].avatar ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${cluster.travelers[0].id}`
                      }
                      alt={cluster.travelers[0].name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              ) : (
                <div className="relative flex items-center justify-center h-10 w-10 rounded-full bg-primary text-white font-medium shadow-lg border-2 border-white">
                  <Users className="h-4 w-4 absolute" />
                  <span className="text-xs font-bold">{cluster.count}</span>
                </div>
              )}
            </div>
          ))}

          {/* Selected cluster popup */}
          {selectedCluster && (
            <div
              className="absolute bg-white rounded-lg shadow-lg p-3 z-10 w-64"
              style={{
                left: `calc(50% + ${(selectedCluster.lng - -74.005974) * 10000}px)`,
                top: `calc(50% - ${(selectedCluster.lat - 40.712776) * 10000 + 60}px)`,
                transform: "translate(-50%, -100%)",
              }}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">
                  {selectedCluster.count} Travelers Nearby
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCluster(null)}
                >
                  ×
                </Button>
              </div>
              <div className="max-h-40 overflow-y-auto">
                {clusters
                  .find(
                    (c) =>
                      c.lat === selectedCluster.lat &&
                      c.lng === selectedCluster.lng,
                  )
                  ?.travelers.map((traveler) => (
                    <div
                      key={traveler.id}
                      className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                      onClick={() => {
                        onSelectTraveler(traveler);
                        setSelectedCluster(null);
                      }}
                    >
                      <div className="relative">
                        <div className="h-8 w-8 rounded-full overflow-hidden">
                          <img
                            src={
                              traveler.avatar ||
                              `https://api.dicebear.com/7.x/avataaars/svg?seed=${traveler.id}`
                            }
                            alt={traveler.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div
                          className={`absolute bottom-0 right-0 h-2 w-2 rounded-full border border-white ${
                            traveler.status === "available"
                              ? "bg-green-500"
                              : traveler.status === "busy"
                                ? "bg-amber-500"
                                : "bg-gray-400"
                          }`}
                        ></div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{traveler.name}</p>
                        <div className="flex gap-1">
                          <Badge variant="outline" className="text-xs py-0 h-4">
                            {traveler.nationality}
                          </Badge>
                          {traveler.languages[0] && (
                            <Badge
                              variant="secondary"
                              className="text-xs py-0 h-4"
                            >
                              {traveler.languages[0]}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TravelerMap;
