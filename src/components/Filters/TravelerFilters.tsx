import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { ChevronDown, Filter, X } from "lucide-react";
import React, { useEffect, useState } from "react";

interface TravelerFiltersProps {
  onFilterChange?: (filters: FilterValues) => void;
}

interface InterestCategory {
  category: string;
  items: string[];
}

export interface FilterValues {
  languages: string[];
  nationalities: string[];
  stayDuration: [number, number]; // [min, max] in days
  interests: string[];
}

const TravelerFilters: React.FC<TravelerFiltersProps> = ({
  onFilterChange = () => {},
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({
    languages: [],
    nationalities: [],
    stayDuration: [1, 30],
    interests: [],
  });

  // Sample data - in a real app, these would come from an API
  // Fetch languages from API
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);
  const [availableNationalities, setAvailableNationalities] = useState<
    string[]
  >([]);
  const [availableInterests, setAvailableInterests] = useState<
    InterestCategory[]
  >([]);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then((res) => res.json())
      .then((data) => {
        // Extract unique languages
        const langSet = new Set<string>();
        // Extract unique nationalities (country demonyms or names)
        const nationalitySet = new Set<string>();

        data.forEach((country: any) => {
          if (country.languages) {
            Object.values(country.languages).forEach((lang: any) =>
              langSet.add(lang),
            );
          }
          // Nationalities (demonyms or country names)
          if (country.demonyms && country.demonyms.eng) {
            nationalitySet.add(country.demonyms.eng.m);
          } else if (country.name && country.name.common) {
            nationalitySet.add(country.name.common);
          }
        });
        setAvailableLanguages(Array.from(langSet).sort());
        setAvailableNationalities(Array.from(nationalitySet).sort());
      });
  }, []);

  // For interests category
  useEffect(() => {
    fetch("http://localhost:3001/api/interests")
      .then((res) => res.json())
      .then((data) => {
        console.log("Interests data received:", data);
        setAvailableInterests(data.interests || []);
      })
      .catch((error) => {
        console.error("Error fetching interests:", error);
        // Fallback data if API fails
        setAvailableInterests([
          {
            category: "Outdoor",
            items: ["Hiking", "Sightseeing", "Photography", "halulu"],
          },
          {
            category: "Culture",
            items: ["Museums", "Local Culture"],
          },
          {
            category: "Food & Drink",
            items: ["Food", "Nightlife", "Shopping"],
          },
        ]);
      });
  }, []);

  const handleFilterChange = (key: keyof FilterValues, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const addFilter = (
    key: "languages" | "nationalities" | "interests",
    value: string,
  ) => {
    if (!filters[key].includes(value)) {
      const newValues = [...filters[key], value];
      handleFilterChange(key, newValues);
    }
  };

  const removeFilter = (
    key: "languages" | "nationalities" | "interests",
    value: string,
  ) => {
    const newValues = filters[key].filter((item) => item !== value);
    handleFilterChange(key, newValues);
  };

  const clearAllFilters = () => {
    const resetFilters: FilterValues = {
      languages: [],
      nationalities: [],
      stayDuration: [1, 30],
      interests: [],
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const activeFilterCount =
    filters.languages.length +
    filters.nationalities.length +
    filters.interests.length +
    (filters.stayDuration[0] > 1 || filters.stayDuration[1] < 30 ? 1 : 0);

  console.log("Available Interests:", availableInterests);

  return (
    <div className="w-full bg-background border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2"
          >
            <Filter size={16} />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {activeFilterCount}
              </Badge>
            )}
            <ChevronDown
              size={16}
              className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
            />
          </Button>

          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-muted-foreground"
            >
              Clear all
            </Button>
          )}
        </div>

        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pb-2">
            {/* Languages Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Languages
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    Select Languages
                    <ChevronDown size={16} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <div className="p-2 max-h-60 overflow-auto">
                    {availableLanguages.map((language) => (
                      <div
                        key={language}
                        className="flex items-center p-2 hover:bg-accent rounded-md cursor-pointer"
                        onClick={() => addFilter("languages", language)}
                      >
                        {language}
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              {filters.languages.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {filters.languages.map((lang) => (
                    <Badge
                      key={lang}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {lang}
                      <X
                        size={12}
                        className="cursor-pointer"
                        onClick={() => removeFilter("languages", lang)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Nationalities Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Nationalities
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    Select Nationalities
                    <ChevronDown size={16} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <div className="p-2 max-h-60 overflow-auto">
                    {availableNationalities.map((nationality) => (
                      <div
                        key={nationality}
                        className="flex items-center p-2 hover:bg-accent rounded-md cursor-pointer"
                        onClick={() => addFilter("nationalities", nationality)}
                      >
                        {nationality}
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              {filters.nationalities.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {filters.nationalities.map((nat) => (
                    <Badge
                      key={nat}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {nat}
                      <X
                        size={12}
                        className="cursor-pointer"
                        onClick={() => removeFilter("nationalities", nat)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Interests Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Interests
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    Select Interests
                    <ChevronDown size={16} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-full p-0"
                  align="start"
                  side="bottom"
                  sideOffset={5}
                >
                  <div className="p-2 max-h-60 overflow-auto">
                    {availableInterests && availableInterests.length > 0 ? (
                      availableInterests.map((cat) => (
                        <div key={cat.category} className="mb-3">
                          <div className="font-semibold text-sm px-2 py-1 bg-muted text-foreground">
                            {cat.category}
                          </div>
                          {cat.items.map((interest) => (
                            <div
                              key={interest}
                              className="flex items-center p-2 hover:bg-accent rounded-md cursor-pointer"
                              onClick={() => addFilter("interests", interest)}
                            >
                              <div className="flex items-center w-full">
                                <div
                                  className={`w-4 h-4 mr-2 rounded-sm border ${filters.interests.includes(interest) ? "bg-primary border-primary" : "border-input"} flex items-center justify-center`}
                                >
                                  {filters.interests.includes(interest) && (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="10"
                                      height="10"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="3"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="text-white"
                                    >
                                      <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                  )}
                                </div>
                                <span>{interest}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-muted-foreground">
                        No interests available
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
              {filters.interests.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {filters.interests.map((interest) => (
                    <Badge
                      key={interest}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {interest}
                      <X
                        size={12}
                        className="cursor-pointer"
                        onClick={() => removeFilter("interests", interest)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Stay Duration Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Stay Duration: {filters.stayDuration[0]} -{" "}
                {filters.stayDuration[1]} days
              </label>
              <div className="px-2 py-4">
                <Slider
                  defaultValue={[1, 30]}
                  min={1}
                  max={30}
                  step={1}
                  value={filters.stayDuration}
                  onValueChange={(value) =>
                    handleFilterChange("stayDuration", value)
                  }
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelerFilters;
