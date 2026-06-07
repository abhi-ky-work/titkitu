"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { publicGet } from "@/lib/apiClient";
import { BookTicketsModal } from "@/components/modals/BookTicketsModal";

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
  location: string;
  city: string;
  state?: string;
  zipCode?: string;
  ticketTypes: TicketType[];
  distance?: number;
}

const CITY_COORDINATES: Record<string, { lat: number; lon: number }> = {
  "Bengaluru": { lat: 12.9716, lon: 77.5946 },
  "Gandhinagar": { lat: 23.2156, lon: 72.6369 },
  "Mumbai": { lat: 19.0760, lon: 72.8777 },
  "Berlin": { lat: 52.5200, lon: 13.4050 },
  "London": { lat: 51.5074, lon: -0.1278 },
  "New York": { lat: 40.7128, lon: -74.0060 }
};

export default function BrowseEventsPage() {

  // Search filter states
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>(""); // empty represents "All Events"

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

  // Fetch event categories on page load
  useEffect(() => {
    fetchCategories();

    // Close autocomplete on click outside
    const handleOutsideClick = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
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
        // Fallback seed categories
        setCategories([
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
        ]);
      }
    } catch (error) {
      console.error("Failed to load categories, using fallback:", error);
      setCategories([
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
      ]);
    } finally {
      setLoadingCategories(false);
    }
  };

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

  // Autocomplete typing handler with debounce
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

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(e.target.value);
    setActiveCategory(""); // reset active category filter on city change
  };

  // Client-side filtering by category
  const filteredEvents = activeCategory
    ? events.filter(e => e.category?.toLowerCase() === activeCategory.toLowerCase())
    : events;

  const formatEventDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  // Compute minimum price from ticket types
  const getMinPrice = (event: EventSearchResult) => {
    if (!event.ticketTypes || event.ticketTypes.length === 0) return 0;
    return Math.min(...event.ticketTypes.map(t => t.price));
  };
  return (
    <div className="min-h-screen bg-background text-on-surface transition-colors duration-300">
      {/* Main layout container */}
      <div className="mx-auto flex w-11/12 max-w-7xl gap-8 py-10 flex-col lg:flex-row">
        {/* Categories Sidebar */}
        <aside className="w-full lg:max-w-xs rounded-3xl border border-outline-variant/30 bg-surface-container-low/80 p-6 shadow-sm backdrop-blur shrink-0 self-start">
          <div className="mb-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
              Browse Filter
            </p>
            <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-primary">tag</span>
              Categories
            </h2>
          </div>

          <nav className="space-y-1.5 max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar">
            {/* First item - All Events */}
            <button
              onClick={() => setActiveCategory("")}
              className={`w-full text-left justify-start gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition flex items-center cursor-pointer ${
                activeCategory === ""
                  ? "bg-primary/15 text-primary"
                  : "text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">confirmation_number</span>
              <span>All Events</span>
              {selectedCity && (
                <span className="ml-auto bg-surface-container-highest text-on-surface-variant text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {events.length}
                </span>
              )}
            </button>

            {/* Categories dynamic items */}
            {loadingCategories ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            ) : (
              categories.map((cat) => {
                const isActive = activeCategory.toLowerCase() === cat.code.toLowerCase();
                const catCount = events.filter(e => e.category?.toLowerCase() === cat.code.toLowerCase()).length;
                return (
                  <button
                    key={cat.code}
                    onClick={() => setActiveCategory(cat.code)}
                    className={`w-full text-left justify-start gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition flex items-center cursor-pointer ${
                      isActive
                        ? "bg-primary/15 text-primary"
                        : "text-on-surface-variant hover:bg-surface-container-high"
                    }`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-primary" : "bg-outline-variant"}`} />
                    <span className="truncate">{cat.name}</span>
                    {selectedCity && catCount > 0 && (
                      <span className="ml-auto bg-surface-container-highest text-on-surface-variant text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {catCount}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </nav>
        </aside>

        {/* Main section: Search bar & Grid */}
        <section className="flex-1 rounded-3xl border border-outline-variant/30 bg-surface-container px-8 py-10 shadow-sm min-h-[60vh] transition-colors duration-300">
          {/* Search Header Row */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center mb-8">
            {/* City Selector */}
            <div className="relative shrink-0 w-full md:w-56">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] pointer-events-none">
                location_on
              </span>
              <select
                value={selectedCity}
                onChange={handleCityChange}
                className="w-full h-11 pl-10 pr-8 bg-surface-container-low border border-outline-variant/50 rounded-2xl text-sm font-semibold text-on-surface appearance-none focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent cursor-pointer transition-colors"
              >
                <option value="">Select Location...</option>
                {Object.keys(CITY_COORDINATES).map((cityName) => (
                  <option key={cityName} value={cityName}>
                    {cityName}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] pointer-events-none">
                keyboard_arrow_down
              </span>
            </div>

            {/* Search Input with Autocomplete */}
            <div ref={suggestionsRef} className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] pointer-events-none">
                search
              </span>
              <input
                type="text"
                placeholder={selectedCity ? `Search events in ${selectedCity}...` : "Please select a location first..."}
                value={searchQuery}
                disabled={!selectedCity}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full h-11 pl-10 pr-4 bg-surface-container-low border border-outline-variant/50 rounded-2xl text-sm font-medium text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              />

              {/* Autocomplete Suggestions Box */}
              {showSuggestions && autocompleteSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-surface-container-high border border-outline-variant rounded-2xl shadow-lg z-50 overflow-hidden">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant px-4 pt-3 pb-1 border-b border-outline-variant/10">
                    Suggestions
                  </p>
                  <div className="py-1">
                    {autocompleteSuggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => selectSuggestion(suggestion)}
                        className="w-full text-left px-4 py-2.5 text-sm text-on-surface hover:bg-primary/10 hover:text-primary transition font-medium capitalize cursor-pointer"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Core Content Area */}
          {!selectedCity ? (
            /* Warning / Alert to select location */
            <div className="flex flex-col items-center justify-center py-16 text-center bg-surface-container-low/50 border border-outline-variant/50 border-dashed rounded-3xl">
              <div className="rounded-full bg-primary/10 p-4 text-primary mb-4 animate-bounce">
                <span className="material-symbols-outlined text-[32px]">location_on</span>
              </div>
              <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">Select a Location</h3>
              <p className="text-sm text-on-surface-variant max-w-sm">
                Enter or select a city location above to discover and browse events.
              </p>
            </div>
          ) : loadingEvents ? (
            /* Loading Spinner */
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-3" />
              <p className="text-sm text-on-surface-variant font-medium">Fetching events...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-16 text-center bg-surface-container-low/50 border border-outline-variant/50 border-dashed rounded-3xl">
              <div className="rounded-full bg-surface-container-highest p-4 text-on-surface-variant mb-4">
                <span className="material-symbols-outlined text-[32px]">warning</span>
              </div>
              <h3 className="text-lg font-bold text-[var(--foreground)] mb-1">No Events Found</h3>
              <p className="text-sm text-on-surface-variant max-w-xs">
                No events match your current selection in {selectedCity}. Try selecting a different category or clearing search query.
              </p>
            </div>
          ) : (
            /* Event Grid */
            <div>
              <div className="mb-6 flex justify-between items-center">
                <h3 className="font-bold text-[var(--foreground)] text-lg">
                  {activeCategory ? `Category: ${categories.find(c => c.code === activeCategory)?.name || activeCategory}` : "All Trending Events"}
                </h3>
                <span className="text-xs font-semibold text-on-surface-variant">
                  Showing {filteredEvents.length} events in {selectedCity}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredEvents.map((event) => {
                  const minPrice = getMinPrice(event);
                  return (
                    <div
                      key={event.id}
                      className="group flex flex-col bg-surface-container-high rounded-3xl border border-outline-variant/30 shadow-sm hover:shadow-md hover:border-primary/50 transition-colors duration-300 overflow-hidden"
                    >
                      {/* Image section */}
                      <div className="relative aspect-video w-full overflow-hidden bg-surface-container">
                        {event.backgroundImage ? (
                          <img
                            src={event.backgroundImage}
                            alt={event.name}
                            className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary-container/10 flex items-center justify-center text-primary/40">
                            <span className="material-symbols-outlined text-[48px]">confirmation_number</span>
                          </div>
                        )}
                        {/* Category badge */}
                        <div className="absolute bottom-3 left-3">
                          <span className="bg-surface/80 backdrop-blur-sm text-primary text-[10px] uppercase font-bold px-3 py-1 rounded-full border border-primary/30 shadow-sm tracking-wide">
                            {event.category}
                          </span>
                        </div>
                      </div>

                      {/* Content details section */}
                      <div className="p-5 flex-1 flex flex-col">
                        <h4 className="font-bold text-on-surface text-base mb-2 group-hover:text-primary transition line-clamp-1">
                          {event.name}
                        </h4>
                        <p className="text-xs text-on-surface-variant line-clamp-2 mb-4 leading-relaxed">
                          {event.description || "Join us for an amazing event experience. Book your tickets now!"}
                        </p>

                        <div className="space-y-2 mb-4 text-xs font-semibold text-on-surface-variant">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px] text-primary">location_on</span>
                            <span className="truncate">{event.venueName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px] text-primary">calendar_today</span>
                            <span>{formatEventDate(event.eventDate)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
                            <span>{event.startTime}</span>
                          </div>
                        </div>

                        {/* Price and Action Footer */}
                        <div className="mt-auto pt-4 border-t border-outline-variant/10 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-on-surface-variant font-bold block uppercase tracking-wider">
                              Starts From
                            </span>
                            <span className="text-lg font-extrabold text-primary">
                              ${minPrice.toFixed(2)}
                            </span>
                          </div>
                          <Button
                            onClick={() => handleBookClick(event)}
                            className="bg-primary-container text-on-primary-container hover:scale-105 active:scale-95 transition-transform duration-150 rounded-2xl px-5 py-2.5 font-bold text-xs cursor-pointer"
                          >
                            Book Tickets
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Booking Modal */}
      {selectedEventForBooking && (
        <BookTicketsModal
          isOpen={isBookModalOpen}
          onClose={() => {
            setIsBookModalOpen(false);
            setSelectedEventForBooking(null);
            fetchEvents(); // refresh events status (available seats)
          }}
          catalogEventId={selectedEventForBooking.id}
          eventName={selectedEventForBooking.name}
        />
      )}
    </div>
  );
}
