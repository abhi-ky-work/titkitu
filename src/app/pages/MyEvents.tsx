
import React, { useState, useEffect } from "react";
import Event from "../entities/Event.json";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/app/utils/utils-url";
import PartnerLayout from "../components/partner/PartnerLayout";
import PartnerEventCard from "../components/partner/EventCard";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Plus, Search, Filter, Calendar } from "lucide-react";

export default function MyEvents() {
  const navigate = useNavigate();
  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    // Filter and sort events directly in useEffect
    let filtered = [...allEvents];
    const now = new Date();

    // Filter by tab
    if (activeTab === "upcoming") {
      filtered = filtered.filter(event => new Date(event.date) >= now);
    } else if (activeTab === "past") {
      filtered = filtered.filter(event => new Date(event.date) < now);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort events
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.date) - new Date(a.date);
        case "name":
          return a.name.localeCompare(b.name);
        case "revenue":
          // Calculate estimated revenue for sorting
          const revenueA = (a.total_tickets - a.tickets_available) * a.price_min;
          const revenueB = (b.total_tickets - b.tickets_available) * b.price_min;
          return revenueB - revenueA; // Descending revenue
        default:
          return 0;
      }
    });

    setFilteredEvents(filtered);
  }, [allEvents, activeTab, searchQuery, sortBy]);

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const events = await Event.list("-created_date");
      setAllEvents(events);
    } catch (error) {
      console.error("Error loading events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviewEvent = (event) => {
    window.open(`${createPageUrl("EventDetails")}?id=${event.id}`, '_blank');
  };

  const handleEditEvent = (event) => {
    navigate(`${createPageUrl("UpdateEvent")}?id=${event.id}`);
  };

  const getTabCounts = () => {
    const now = new Date();
    const upcoming = allEvents.filter(event => new Date(event.date) >= now).length;
    const past = allEvents.filter(event => new Date(event.date) < now).length;
    return { all: allEvents.length, upcoming, past };
  };

  const tabCounts = getTabCounts();

  return (
    <PartnerLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Events</h1>
            <p className="text-gray-600">Manage all your events in one place</p>
          </div>
          <Button 
            onClick={() => navigate(createPageUrl("CreateEvent"))}
            className="luxury-gradient text-white mt-4 md:mt-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Event
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="revenue">Revenue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="all">
              All Events ({tabCounts.all})
            </TabsTrigger>
            <TabsTrigger value="upcoming">
              Upcoming ({tabCounts.upcoming})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past ({tabCounts.past})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, i) => (
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
                  <PartnerEventCard
                    key={event.id}
                    event={event}
                    onPreview={handlePreviewEvent}
                    onEdit={handleEditEvent}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {searchQuery ? "No events found" : "No events yet"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery 
                    ? "Try adjusting your search criteria" 
                    : "Create your first event to get started"
                  }
                </p>
                {!searchQuery && (
                  <Button 
                    onClick={() => navigate(createPageUrl("CreateEvent"))}
                    className="luxury-gradient text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Event
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PartnerLayout>
  );
}
