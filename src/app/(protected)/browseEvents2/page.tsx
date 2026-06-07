"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { publicGet } from "@/lib/apiClient";
import { BookTicketsModal } from "@/components/modals/BookTicketsModal";
import { Loader2 } from "lucide-react";

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

  // Theme state (default dark mode)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

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

  // Manage dark mode classes on HTML/body for consistent modal rendering
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
      document.documentElement.classList.remove("dark");
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Update HTML class list dynamically when user toggles dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

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
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Montserrat:wght@600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');

        .stitch-theme {
          font-family: 'Inter', sans-serif;
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        .stitch-theme.dark-theme {
          --on-tertiary-fixed: #3f0019;
          --inverse-surface: #e5e2e3;
          --inverse-primary: #9800d0;
          --on-tertiary-container: #ffffff;
          --on-primary: #520072;
          --secondary-fixed: #63f7ff;
          --primary-fixed: #f8d8ff;
          --on-secondary-container: #006c71;
          --on-secondary: #003739;
          --tertiary: #ffb1c3;
          --on-secondary-fixed: #002021;
          --on-surface-variant: #d4c0d7;
          --background: #131314;
          --surface-bright: #3a393a;
          --outline-variant: #504254;
          --on-primary-container: #ffffff;
          --on-primary-fixed-variant: #74009f;
          --surface-container-low: #1c1b1c;
          --tertiary-fixed-dim: #ffb1c3;
          --surface-tint: #ebb2ff;
          --surface-container-highest: #353436;
          --on-error-container: #ffdad6;
          --primary-container: #bc13fe;
          --on-secondary-fixed-variant: #004f53;
          --surface-container: #201f20;
          --error-container: #93000a;
          --surface-container-high: #2a2a2b;
          --on-background: #e5e2e3;
          --on-surface: #e5e2e3;
          --error: #ffb4ab;
          --secondary-container: #00f4fe;
          --surface-container-lowest: #0e0e0f;
          --on-tertiary-fixed-variant: #8f0041;
          --surface-dim: #131314;
          --primary: #ebb2ff;
          --on-primary-fixed: #320047;
          --surface: #131314;
          --tertiary-container: #e8006e;
          --outline: #9d8ba0;
          --on-tertiary: #66002c;
          --on-error: #690005;
          --inverse-on-surface: #313031;
          --primary-fixed-dim: #ebb2ff;
          --surface-variant: #353436;
          --tertiary-fixed: #ffd9e0;
          --secondary: #e6feff;
          --secondary-fixed-dim: #00dce5;

          /* Overrides for Tailwind classes */
          --color-primary: #ebb2ff;
          --color-primary-container: #bc13fe;
          --color-on-primary-container: #ffffff;
          --color-secondary-container: #00f4fe;
          --color-on-secondary-container: #006c71;
          --color-background: #131314;
          --color-surface-container: #201f20;
          --color-surface-container-low: #1c1b1c;
          --color-surface-container-high: #2a2a2b;
          --color-surface-container-lowest: #0e0e0f;
          --color-surface-container-highest: #353436;
          --color-on-surface: #e5e2e3;
          --color-on-surface-variant: #d4c0d7;
          --color-outline-variant: #504254;

          --foreground: #e5e2e3;
          background-color: #0A0A0B;
          color: #e5e2e3;
        }

        .stitch-theme.light-theme {
          --on-tertiary-fixed: #3f0019;
          --inverse-surface: #313031;
          --inverse-primary: #ebb2ff;
          --on-tertiary-container: #ffffff;
          --on-primary: #ffffff;
          --secondary-fixed: #004f53;
          --primary-fixed: #320047;
          --on-secondary-container: #002021;
          --on-secondary: #ffffff;
          --tertiary: #8f0041;
          --on-secondary-fixed: #e6feff;
          --on-surface-variant: #4b5563;
          --background: #f3f4f6;
          --surface-bright: #ffffff;
          --outline-variant: #e5e7eb;
          --on-primary-container: #ffffff;
          --on-primary-fixed-variant: #ebb2ff;
          --surface-container-low: #f9fafb;
          --tertiary-fixed-dim: #8f0041;
          --surface-tint: #bc13fe;
          --surface-container-highest: #e5e7eb;
          --on-error-container: #ffdad6;
          --primary-container: #9800d0;
          --on-secondary-fixed-variant: #00f4fe;
          --surface-container: #e5e7eb;
          --error-container: #93000a;
          --surface-container-high: #ffffff;
          --on-background: #1f2937;
          --on-surface: #1f2937;
          --error: #ffb4ab;
          --secondary-container: #006c71;
          --surface-container-lowest: #f9fafb;
          --on-tertiary-fixed-variant: #ffd9e0;
          --surface-dim: #f3f4f6;
          --primary: #9800d0;
          --on-primary-fixed: #ebb2ff;
          --surface: #ffffff;
          --tertiary-container: #ffb1c3;
          --outline: #9d8ba0;
          --on-tertiary: #ffffff;
          --on-error: #ffffff;
          --inverse-on-surface: #e5e2e3;
          --primary-fixed-dim: #9800d0;
          --surface-variant: #e5e7eb;
          --tertiary-fixed: #ffb1c3;
          --secondary: #006c71;
          --secondary-fixed-dim: #00f4fe;

          /* Overrides for Tailwind classes */
          --color-primary: #9800d0;
          --color-primary-container: #bc13fe;
          --color-on-primary-container: #ffffff;
          --color-secondary-container: #006c71;
          --color-on-secondary-container: #ffffff;
          --color-background: #f3f4f6;
          --color-surface-container: #e5e7eb;
          --color-surface-container-low: #f9fafb;
          --color-surface-container-high: #ffffff;
          --color-surface-container-lowest: #f9fafb;
          --color-surface-container-highest: #e5e7eb;
          --color-on-surface: #1f2937;
          --color-on-surface-variant: #4b5563;
          --color-outline-variant: #e5e7eb;

          --foreground: #1f2937;
          background-color: #f3f4f6;
          color: #1f2937;
        }

        .stitch-theme .font-display-lg,
        .stitch-theme .font-headline-md,
        .stitch-theme .font-title-lg {
          font-family: 'Montserrat', sans-serif;
        }

        .stitch-theme .material-symbols-outlined {
          font-family: 'Material Symbols Outlined';
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          display: inline-block;
          line-height: 1;
          letter-spacing: normal;
          text-transform: none;
          white-space: nowrap;
          word-wrap: normal;
          direction: ltr;
          -webkit-font-smoothing: antialiased;
        }

        .stitch-theme .material-symbols-outlined.fill {
          font-variation-settings: 'FILL' 1;
        }

        .stitch-theme.dark-theme .glass-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .stitch-theme.light-theme .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
        }

        .stitch-theme .neon-glow-primary {
          box-shadow: 0 0 15px rgba(188, 19, 254, 0.4);
        }

        .stitch-theme .neon-glow-cyan {
          box-shadow: 0 0 15px rgba(0, 244, 254, 0.3);
        }

        .stitch-theme .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }

        .stitch-theme .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .stitch-theme .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #504254;
          border-radius: 10px;
        }
      `}} />

      {/* Top Navigation Bar */}
      <header className="bg-background/80 backdrop-blur-xl sticky top-0 z-50 border-b border-outline-variant/10 shadow-[0_0_20px_rgba(188,19,254,0.15)]">
        <nav className="flex justify-between items-center w-full px-5 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-8">
            <span 
              onClick={() => router.push("/dashboard")} 
              className="font-display-lg text-2xl md:text-3xl tracking-tighter text-primary cursor-pointer font-extrabold"
            >
              TiketIt
            </span>
            <div className="hidden md:flex gap-6 items-center">
              <span onClick={() => router.push("/browseEvents")} className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer text-sm font-medium">Standard Browse</span>
              <span className="text-primary border-b-2 border-primary pb-1 text-sm font-semibold cursor-default">Stitch Grid Theme</span>
              <span className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer text-sm font-medium">VIP Tables</span>
              <span className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer text-sm font-medium">My Tickets</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Search Input with Autocomplete */}
            <div ref={suggestionsRef} className="relative hidden sm:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input
                className="bg-surface-container-high border-none rounded-full pl-10 pr-4 py-2 text-sm text-[var(--foreground)] focus:ring-1 focus:ring-secondary-container w-64 transition-all"
                placeholder="Search clubs or events..."
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => {
                  if (autocompleteSuggestions.length > 0) setShowSuggestions(true);
                }}
              />
              {showSuggestions && autocompleteSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-surface-container-high border border-outline-variant rounded-xl overflow-hidden shadow-2xl z-50">
                  {autocompleteSuggestions.map((suggestion, idx) => (
                    <div
                      key={idx}
                      onClick={() => selectSuggestion(suggestion)}
                      className="px-4 py-2 text-sm text-[var(--foreground)] hover:bg-primary-container hover:text-on-primary-container cursor-pointer transition-colors"
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Dark/Light Theme Switcher Button */}
            <button
              onClick={() => setIsDarkMode(prev => !prev)}
              className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-primary hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              <span className="material-symbols-outlined text-[20px]">
                {isDarkMode ? "light_mode" : "dark_mode"}
              </span>
            </button>

            <button 
              onClick={() => router.push("/dashboard/create-event")}
              className="hidden lg:block px-6 py-2 rounded-full bg-primary-container text-on-primary-container text-xs font-semibold scale-95 active:scale-90 transition-transform neon-glow-primary cursor-pointer"
            >
              Join the Club
            </button>
            <button 
              onClick={() => router.push("/dashboard")}
              className="text-on-surface-variant hover:text-primary transition-colors text-xs font-semibold cursor-pointer"
            >
              Dashboard
            </button>
          </div>
        </nav>
      </header>

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

      {/* Footer */}
      <footer className="bg-surface-container-lowest w-full py-10 mt-16 border-t border-outline-variant">
        <div className="flex flex-col md:flex-row justify-between items-center px-5 max-w-7xl mx-auto gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="font-display-lg text-xl font-extrabold text-primary">TiketIt</span>
            <p className="text-on-surface-variant text-xs">TiketIt 2026 • Instant Access to the Best Nightlife.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <span className="text-on-surface-variant hover:text-secondary-container transition-colors text-xs font-medium cursor-pointer">About Us</span>
            <span className="text-on-surface-variant hover:text-secondary-container transition-colors text-xs font-medium cursor-pointer">Contact Support</span>
            <span className="text-on-surface-variant hover:text-secondary-container transition-colors text-xs font-medium cursor-pointer">Terms of Service</span>
            <span className="text-on-surface-variant hover:text-secondary-container transition-colors text-xs font-medium cursor-pointer">Privacy Policy</span>
            <span className="text-on-surface-variant hover:text-secondary-container transition-colors text-xs font-medium cursor-pointer">Partner with Us</span>
          </div>
          <div className="flex gap-4">
            <button className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-on-surface-variant hover:text-primary transition-all cursor-pointer">
              <span className="material-symbols-outlined">share</span>
            </button>
            <button className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-on-surface-variant hover:text-primary transition-all cursor-pointer">
              <span className="material-symbols-outlined">public</span>
            </button>
          </div>
        </div>
      </footer>

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
