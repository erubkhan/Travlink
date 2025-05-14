import React, { useState, useEffect } from "react";
import { ZoomIn, ZoomOut, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";

interface TravelerMapProps {
  travelers?: Traveler[];
  onUserSelect?: (user: any) => void;
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

// World map JSON data
const geoUrl =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

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
      location: { lat: 51.507351, lng: -0.127758 },
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
      status: "busy",
    },
    {
      id: "3",
      name: "Carlos Rodriguez",
      nationality: "Spain",
      languages: ["Spanish", "English", "Portuguese"],
      location: { lat: 40.416775, lng: -3.70379 },
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carlos",
      status: "available",
    },
    {
      id: "4",
      name: "Yuki Tanaka",
      nationality: "Japan",
      languages: ["Japanese", "English"],
      location: { lat: 35.689487, lng: 139.691706 },
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=yuki",
      status: "available",
    },
    {
      id: "5",
      name: "Maria Silva",
      nationality: "Brazil",
      languages: ["Portuguese", "Spanish"],
      location: { lat: -23.55052, lng: -46.633309 },
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maria",
      status: "busy",
    },
    {
      id: "6",
      name: "Ahmed Hassan",
      nationality: "Egypt",
      languages: ["Arabic", "English"],
      location: { lat: 30.04442, lng: 31.235712 },
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ahmed",
      status: "offline",
    },
  ],
  onUserSelect = () => {},
  currentLocation = { lat: 40.712776, lng: -74.005974 },
  zoom = 1,
}) => {
  const [mapZoom, setMapZoom] = useState(zoom);
  const [selectedUser, setSelectedUser] = useState<Traveler | null>(null);
  const [position, setPosition] = useState<[number, number]>([0, 0]);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [clusters, setClusters] = useState<
    Array<{ lat: number; lng: number; travelers: Traveler[]; count: number }>
  >([]);

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
    const clusterRadius = 5; // degrees (roughly 500km at equator)
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
    setMapZoom((prev) => Math.min(prev + 1, 8));
  };

  const handleZoomOut = () => {
    setMapZoom((prev) => Math.max(prev - 1, 1));
  };

  const handleUserClick = (traveler: Traveler) => {
    setSelectedUser(traveler);
    onUserSelect(traveler);
  };

  const handleClusterClick = (cluster: {
    lat: number;
    lng: number;
    travelers: Traveler[];
    count: number;
  }) => {
    if (cluster.count === 1) {
      // If only one traveler in the cluster, select them directly
      onUserSelect(cluster.travelers[0]);
    } else {
      // Otherwise, zoom in to the cluster location
      setPosition([cluster.lng, cluster.lat]);
      setMapZoom((prev) => Math.min(prev + 2, 8));
    }
  };

  const handleCurrentLocationClick = () => {
    // Navigate to current location
    setPosition([currentLocation.lng, currentLocation.lat]);
    setMapZoom(4);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "#10b981"; // green-500
      case "busy":
        return "#f59e0b"; // amber-500
      default:
        return "#9ca3af"; // gray-400
    }
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
          {/* Earth Map */}
          <div className="absolute inset-0 bg-[#f0f8ff]">
            <ComposableMap
              projection="geoEqualEarth"
              style={{ width: "100%", height: "100%" }}
            >
              <ZoomableGroup
                zoom={mapZoom}
                center={position}
                maxZoom={8}
                onMoveEnd={({ zoom, coordinates }) => {
                  setMapZoom(zoom);
                  setPosition(coordinates as [number, number]);
                }}
              >
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill="#d1d5db" // gray-300
                        stroke="#f9fafb" // gray-50
                        strokeWidth={0.5}
                        style={{
                          default: { outline: "none" },
                          hover: { outline: "none", fill: "#9ca3af" },
                          pressed: { outline: "none" },
                        }}
                      />
                    ))
                  }
                </Geographies>

                {/* Clusters */}
                {clusters.map((cluster, index) => (
                  <Marker
                    key={index}
                    coordinates={[cluster.lng, cluster.lat]}
                    onClick={() => handleClusterClick(cluster)}
                  >
                    {cluster.count === 1 ? (
                      <g
                        transform="translate(-12, -24)"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleUserClick(cluster.travelers[0])}
                      >
                        <circle
                          r={8}
                          fill="white"
                          stroke={getStatusColor(cluster.travelers[0].status)}
                          strokeWidth={2}
                        />
                        <image
                          href={cluster.travelers[0].avatar}
                          width={16}
                          height={16}
                          x={-8}
                          y={-8}
                          clipPath={`url(#circleClip-${cluster.travelers[0].id})`}
                        />
                        <defs>
                          <clipPath
                            id={`circleClip-${cluster.travelers[0].id}`}
                          >
                            <circle r={7} cx={0} cy={0} />
                          </clipPath>
                        </defs>
                      </g>
                    ) : (
                      <g
                        transform="translate(-12, -12)"
                        style={{ cursor: "pointer" }}
                      >
                        <circle
                          r={10 + Math.min(cluster.count, 10)}
                          fill="#3b82f6" // blue-500
                          opacity={0.8}
                          stroke="white"
                          strokeWidth={2}
                        />
                        <text
                          textAnchor="middle"
                          y={4}
                          style={{
                            fill: "white",
                            fontSize: 10,
                            fontWeight: "bold",
                          }}
                        >
                          {cluster.count}
                        </text>
                      </g>
                    )}
                  </Marker>
                ))}

                {/* Current location marker */}
                <Marker
                  coordinates={[currentLocation.lng, currentLocation.lat]}
                >
                  <circle r={4} fill="#3b82f6" stroke="white" strokeWidth={2} />
                </Marker>
              </ZoomableGroup>
            </ComposableMap>
          </div>

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
        </>
      )}
    </div>
  );
};

export default TravelerMap;
