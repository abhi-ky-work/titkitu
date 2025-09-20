
import React, { useState, useEffect, useMemo } from "react"; // Added useMemo
import Event from "../entities/Event.json";
import Header from "../components/Header";
import EventCard from "../components/EventCard";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

export default function BrowseEvents() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = useMemo(() => [ // Memoize categories if it's static data but defined inside component
    { key: "all", name: "All Events", count: 0 },
    { key: "music", name: "Music", count: 0 },
    { key: "sports", name: "Sports", count: 0 },
    { key: "theater", name: "Theater", count: 0 },
    { key: "comedy", name: "Comedy", count: 0 },
    { key: "festivals", name: "Festivals", count: 0 },
    { key: "conferences", name: "Conferences", count: 0 },
    { key: "nightlife", name: "Nightlife", count: 0 },
    { key: "food_drinks", name: "Food & Drinks", count: 0 }
  ], []); // Empty dependency array because categories array content is static

  useEffect(() => {
    // Check for category from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const categoryFromUrl = urlParams.get('category');
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
    loadEvents();
  }, []); // loadEvents is a stable function, no need to include in deps if it's defined outside or wrapped in useCallback

  useEffect(() => {
    // Filter events based on selected category
    if (selectedCategory === "all") {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(events.filter(event => event.category === selectedCategory));
    }
  }, [events, selectedCategory]); // Dependencies: events and selectedCategory

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const allEvents = await Event.list("-created_date", 100);
      setEvents(allEvents);
    } catch (error) {
      console.error("Error loading events:", error);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Memoize categoryCounts to only re-calculate when 'events' changes
  const categoryCounts = useMemo(() => {
    const counts = {};
    events.forEach(event => {
      counts[event.category] = (counts[event.category] || 0) + 1;
    });
    counts.all = events.length;
    return counts;
  }, [events]); // Dependency: events

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Browse Events</h1>
            <p className="text-xl text-gray-600">Discover amazing events in your area</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-xl p-6 premium-shadow sticky top-24">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.key}
                      onClick={() => setSelectedCategory(category.key)}
                      className={`w-full text-left flex items-center justify-between p-3 rounded-lg transition-colors ${
                        selectedCategory === category.key
                          ? 'bg-purple-100 text-purple-800 font-medium'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <span>{category.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {categoryCounts[category.key] || 0}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCategory === "all" ? "All Events" : 
                   categories.find(c => c.key === selectedCategory)?.name || "Events"}
                </h2>
                <p className="text-gray-600">
                  {isLoading ? 'Loading...' : `${filteredEvents.length} events`}
                </p>
              </div>

              {/* Events Grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array(9).fill(0).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-200 aspect-[16/10] rounded-t-xl"></div>
                      <div className="bg-white p-4 rounded-b-xl space-y-3">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🎭</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No events in this category yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Check back soon or explore other categories
                  </p>
                  <Button onClick={() => setSelectedCategory("all")}>
                    View All Events
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
