"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { publicGet } from "@/lib/apiClient";
import { BookTicketsModal } from "@/components/modals/BookTicketsModal";
import { Loader2 } from "lucide-react";
import { useThemeStore } from "@/lib/themeStore";

interface TicketType {
  id: string;
  name: string;
  categoryCode: string;
  price: number;
  quantity: number;
}

interface EventSearchResult {
  id: string;
  name: string;
  category: string;
  description?: string;
  backgroundImage?: string;
  eventDate: string;
  startTime: string;
  endTime?: string;
  venueName: string;
  location?: {
    lat: number;
    lon: number;
  };
  city: string;
  state?: string;
  zipCode?: string;
  ticketTypes: TicketType[];
  distance?: number;
}

const CITY_COORDINATES: Record<string, { lat: number; lon: number; label: string; currency: string }> = {
  "Bengaluru": { lat: 12.9716, lon: 77.5946, label: "Bengaluru, India", currency: "₹" },
  "Gandhinagar": { lat: 23.2156, lon: 72.6369, label: "Gandhinagar, India", currency: "₹" },
  "Mumbai": { lat: 19.0760, lon: 72.8777, label: "Mumbai, India", currency: "₹" },
  "Berlin": { lat: 52.5200, lon: 13.4050, label: "Berlin, Germany", currency: "€" },
  "London": { lat: 51.5074, lon: -0.1278, label: "London, UK", currency: "£" },
  "New York": { lat: 40.7128, lon: -74.0060, label: "New York, USA", currency: "$" }
};

const DEFAULT_VIBES = ["Underground", "Luxury", "Rooftop", "Warehouse"];

export default function BrowseEventsPage2() {
  const router = useRouter();

  // Theme state using global store
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  // Search/Filter states
  const [selectedCity, setSelectedCity] = useState<string>("Bengaluru");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [checkedCategories, setCheckedCategories] = useState<string[]>([]);
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(250);

  // Data states
  const [events, setEvents] = useState<EventSearchResult[]>([]);
  const [categories, setCategories] = useState<{ code: string; name: string }[]>([]);
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<string[]>([]);

  // UI status states
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Booking Modal states
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [selectedEventForBooking, setSelectedEventForBooking] = useState<{ id: string; name: string } | null>(null);

  // References
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const autocompleteTimeout = useRef<NodeJS.Timeout | null>(null);

  // Enforce dark mode class on HTML body for modal rendering consistency
  useEffect(() => {
    fetchCategories();

    // Close autocomplete on click outside
    const handleOutsideClick = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Fetch events when city coordinates or search query changes
  useEffect(() => {
    if (selectedCity) {
      fetchEvents();
    } else {
      setEvents([]);
    }
  }, [selectedCity, searchQuery]);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const data = await publicGet<{ code: string; name: string }[]>("/api/v1/partner/event-categories");
      if (data && data.length > 0) {
        setCategories(data);
      } else {
        setCategories(getFallbackCategories());
      }
    } catch (error) {
      console.error("Failed to load categories, using fallback:", error);
      setCategories(getFallbackCategories());
    } finally {
      setLoadingCategories(false);
    }
  };

  const getFallbackCategories = () => [
    { code: "club-nights", name: "Club Nights" },
    { code: "gigs", name: "Gigs" },
    { code: "fun-things", name: "Fun Things" },
    { code: "food-drink", name: "Food & Drink" },
    { code: "festivals", name: "Festivals" },
    { code: "business-conferences", name: "Business Conferences" },
    { code: "dating", name: "Dating" },
    { code: "comedy", name: "Comedy" },
    { code: "arts-performance", name: "Arts & Performance" },
    { code: "classes", name: "Classes" },
    { code: "sports-fitness", name: "Sports & Fitness" }
  ];

  const fetchEvents = async () => {
    const coords = CITY_COORDINATES[selectedCity];
    if (!coords) return;

    setLoadingEvents(true);
    try {
      const url = `/api/v1/events/search?lat=${coords.lat}&lon=${coords.lon}&city=${selectedCity}&q=${searchQuery}`;
      const response = await publicGet(url);
      if (response && response.data) {
        setEvents(response.data);
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error("Failed to fetch search events:", error);
      setEvents([]);
    } finally {
      setLoadingEvents(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);

    if (autocompleteTimeout.current) {
      clearTimeout(autocompleteTimeout.current);
    }

    if (!selectedCity || value.trim().length < 2) {
      setAutocompleteSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    autocompleteTimeout.current = setTimeout(async () => {
      try {
        const url = `/api/v1/events/autocomplete?city=${selectedCity}&q=${value}`;
        const response = await publicGet<{ data: string[] }>(url);
        if (response && response.data) {
          setAutocompleteSuggestions(response.data);
          setShowSuggestions(response.data.length > 0);
        }
      } catch (err) {
        console.error("Autocomplete fetch failed:", err);
      }
    }, 250);
  };

  const selectSuggestion = (suggestion: string) => {
    setSearchQuery(suggestion);
    setAutocompleteSuggestions([]);
    setShowSuggestions(false);
  };

  const handleBookClick = (event: EventSearchResult) => {
    setSelectedEventForBooking({ id: event.id, name: event.name });
    setIsBookModalOpen(true);
  };

  const toggleCategory = (code: string) => {
    setCheckedCategories(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const toggleVibe = (vibe: string) => {
    setSelectedVibes(prev =>
      prev.includes(vibe) ? prev.filter(v => v !== vibe) : [...prev, vibe]
    );
  };

  const clearAllFilters = () => {
    setCheckedCategories([]);
    setSelectedVibes([]);
    setMaxPrice(250);
    setSearchQuery("");
  };

  // Get dynamic local currency symbol
  const activeCurrency = CITY_COORDINATES[selectedCity]?.currency || "€";

  // Filter events client-side based on Category Checkboxes, Vibe, and Price range
  const filteredEvents = events.filter(event => {
    // 1. Category Filter
    if (checkedCategories.length > 0) {
      const matchesCategory = checkedCategories.includes(event.category?.toLowerCase());
      if (!matchesCategory) return false;
    }

    // 2. Vibe Filter
    if (selectedVibes.length > 0) {
      const descriptionText = (event.description || "").toLowerCase();
      const matchesVibe = selectedVibes.some(vibe => descriptionText.includes(vibe.toLowerCase()));
      if (!matchesVibe) return false;
    }

    // 3. Price Filter
    const minTicketPrice = event.ticketTypes && event.ticketTypes.length > 0
      ? Math.min(...event.ticketTypes.map(t => t.price))
      : 0;

    if (maxPrice < 250 && minTicketPrice > maxPrice) {
      return false;
    }

    return true;
  });

  const formatEventDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className={`stitch-theme min-h-screen relative font-body-md text-body-md transition-colors duration-300 ${
      isDarkMode ? "dark-theme" : "light-theme"
    }`}>
      {/* Header rendered globally */}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-5 py-10 flex flex-col md:flex-row gap-8">
        
        {/* Filter Sidebar */}
        <aside className="w-full md:w-64 lg:w-72 shrink-0 space-y-6">
          <div className="glass-card rounded-xl p-6 sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-headline-md text-xl text-primary font-bold">Filters</h2>
              <button 
                onClick={clearAllFilters}
                className="text-xs text-on-surface-variant hover:text-secondary-container transition-colors"
              >
                Clear All
              </button>
            </div>

            {/* City Location Select */}
            <div className="mb-6">
              <h3 className="font-title-lg text-sm font-semibold mb-3 text-on-surface">Location</h3>
              <select 
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-2.5 text-sm text-[var(--foreground)] focus:ring-1 focus:ring-primary focus:outline-none"
              >
                <option value="">Select Location</option>
                {Object.keys(CITY_COORDINATES).map((city) => (
                  <option key={city} value={city}>
                    {CITY_COORDINATES[city].label}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Checkboxes */}
            <div className="mb-6">
              <h3 className="font-title-lg text-sm font-semibold mb-3 text-on-surface">Categories</h3>
              {loadingCategories ? (
                <div className="flex items-center gap-2 py-2 text-on-surface-variant text-xs">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  Loading...
                </div>
              ) : (
                <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {categories.map((cat) => (
                    <label key={cat.code} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox"
                        checked={checkedCategories.includes(cat.code)}
                        onChange={() => toggleCategory(cat.code)}
                        className="w-4 h-4 rounded border-outline-variant bg-surface-container-low text-primary focus:ring-primary-container"
                      />
                      <span className="text-sm text-on-surface-variant group-hover:text-primary transition-colors">
                        {cat.name}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Vibe Selection Pills */}
            <div className="mb-6">
              <h3 className="font-title-lg text-sm font-semibold mb-3 text-on-surface">Vibe</h3>
              <div className="flex flex-wrap gap-2">
                {DEFAULT_VIBES.map((vibe) => {
                  const isSelected = selectedVibes.includes(vibe);
                  return (
                    <button
                      key={vibe}
                      onClick={() => toggleVibe(vibe)}
                      className={`px-3 py-1 rounded-full border text-xs transition-colors cursor-pointer ${
                        isSelected 
                          ? "border-primary text-primary bg-primary/10" 
                          : "border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
                      }`}
                    >
                      {vibe}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Range Slider */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-title-lg text-sm font-semibold text-on-surface">Max Ticket Price</h3>
                <span className="text-xs text-primary font-semibold">
                  {maxPrice === 250 ? "Any Price" : `${activeCurrency}${maxPrice}`}
                </span>
              </div>
              <input 
                type="range"
                min="0"
                max="250"
                step="5"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="w-full accent-primary h-1.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between mt-2 text-xs text-on-surface-variant">
                <span>{activeCurrency}0</span>
                <span>{activeCurrency}250+</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Events Content Grid */}
        <section className="flex-1">
          
          {/* Header Area */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h1 className="font-display-lg text-2xl md:text-3xl font-extrabold text-[var(--foreground)]">Trending Events</h1>
              {selectedCity ? (
                <p className="text-on-surface-variant text-sm mt-1">
                  Showing {filteredEvents.length} events in {selectedCity}
                </p>
              ) : (
                <p className="text-on-surface-variant text-sm mt-1">
                  Choose a location to search events
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 bg-surface-container p-1 rounded-lg border border-outline-variant">
              <button className="p-2 rounded-md bg-surface-container-highest text-primary">
                <span className="material-symbols-outlined">grid_view</span>
              </button>
              <button className="p-2 rounded-md text-on-surface-variant hover:bg-surface-container-highest">
                <span className="material-symbols-outlined">view_list</span>
              </button>
            </div>
          </div>

          {/* Conditional Rendering */}
          {!selectedCity ? (
            <div className="glass-card rounded-xl p-8 text-center max-w-md mx-auto my-12 border border-primary/20 shadow-[0_0_30px_rgba(188,19,254,0.1)]">
              <span className="material-symbols-outlined text-5xl text-primary mb-4 animate-pulse">location_on</span>
              <h3 className="text-xl font-bold text-[var(--foreground)] mb-2 font-title-lg">Select a Location</h3>
              <p className="text-on-surface-variant text-sm mb-6 font-body-md">
                Please select a city in the filters sidebar to browse and search the best events in your area.
              </p>
            </div>
          ) : loadingEvents ? (
            <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm font-medium">Fetching trending events near you...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="glass-card rounded-xl p-8 text-center max-w-md mx-auto my-12 border border-outline-variant">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4">search_off</span>
              <h3 className="text-lg font-bold text-[var(--foreground)] mb-2 font-title-lg">No Events Found</h3>
              <p className="text-on-surface-variant text-sm mb-4 font-body-md">
                We couldn&apos;t find any events matching your selected filter options. Try resetting your filters.
              </p>
              <button 
                onClick={clearAllFilters}
                className="px-6 py-2 rounded-full bg-primary text-on-primary font-semibold text-xs transition-transform hover:scale-105 active:scale-95"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredEvents.map((event) => {
                const minPrice = event.ticketTypes && event.ticketTypes.length > 0
                  ? Math.min(...event.ticketTypes.map((t) => t.price))
                  : 0;

                const categoryLabel = event.category
                  ? event.category.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
                  : "Event";

                const imageUrl = event.backgroundImage || "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=60";

                return (
                  <div 
                    key={event.id}
                    className="group glass-card rounded-xl overflow-hidden flex flex-col hover:border-primary/50 transition-colors"
                  >
                    <div className="relative h-52 overflow-hidden">
                      <img 
                        alt={event.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        src={imageUrl}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
                      
                      <div className="absolute top-3 left-3 bg-primary-container text-on-primary-container rounded-full p-1.5 flex items-center justify-center neon-glow-primary">
                        <span className="material-symbols-outlined text-[18px] fill">local_fire_department</span>
                      </div>
                      
                      {event.distance !== undefined && (
                        <div className="absolute top-3 right-3 bg-surface-container/80 backdrop-blur-md text-[var(--foreground)] text-[10px] font-semibold px-2 py-1 rounded border border-outline-variant/30">
                          {event.distance.toFixed(1)} km away
                        </div>
                      )}

                      <div className="absolute bottom-3 left-3">
                        <span className="bg-surface/60 backdrop-blur-md text-primary text-[10px] uppercase font-bold px-3 py-1 rounded-full border border-primary/30">
                          {categoryLabel}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-headline-md text-base font-bold text-[var(--foreground)] mb-2 truncate group-hover:text-primary transition-colors">
                        {event.name}
                      </h3>
                      
                      <div className="space-y-1.5 mb-4">
                        <div className="flex items-center gap-2 text-on-surface-variant text-xs">
                          <span className="material-symbols-outlined text-[18px]">location_on</span>
                          <span className="truncate">{event.venueName}, {event.city}</span>
                        </div>
                        <div className="flex items-center gap-2 text-on-surface-variant text-xs">
                          <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                          <span>{formatEventDate(event.eventDate)} at {event.startTime}</span>
                        </div>
                      </div>

                      {event.description && (
                        <p className="text-on-surface-variant text-xs line-clamp-2 mb-4">
                          {event.description}
                        </p>
                      )}

                      <div className="mt-auto flex items-center justify-between">
                        <span className="text-primary font-bold text-lg">
                          {minPrice > 0 ? `${activeCurrency}${minPrice.toFixed(2)}` : "Free"}
                        </span>
                        <button 
                          onClick={() => handleBookClick(event)}
                          className="px-5 py-2 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold hover:scale-105 active:scale-95 transition-all cursor-pointer"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Footer rendered globally */}

      {/* FAB for Quick Dashboard Access */}
      <button 
        onClick={() => router.push("/dashboard")}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-primary-container text-on-primary-container shadow-2xl flex items-center justify-center z-40 md:hidden neon-glow-primary cursor-pointer"
      >
        <span className="material-symbols-outlined">confirmation_number</span>
      </button>

      {/* Tickets checkout modal */}
      {selectedEventForBooking && (
        <BookTicketsModal
          isOpen={isBookModalOpen}
          onClose={() => {
            setIsBookModalOpen(false);
            setSelectedEventForBooking(null);
          }}
          catalogEventId={selectedEventForBooking.id}
          eventName={selectedEventForBooking.name}
        />
      )}
    </div>
  );
}
