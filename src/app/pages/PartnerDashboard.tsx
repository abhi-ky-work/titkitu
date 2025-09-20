import React, { useState, useEffect } from "react";
import Event from "../entities/Event.json";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import PartnerLayout from "../components/partner/PartnerLayout";
import PartnerEventCard from "../components/partner/EventCard";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { 
  Plus, 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp, 
  ArrowRight, 
  Eye,
  Bell
} from "lucide-react";

export default function PartnerDashboard() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const allEvents = await Event.list("-date");
      const now = new Date();
      
      const upcoming = allEvents.filter(event => new Date(event.date) >= now).slice(0, 3);
      const past = allEvents.filter(event => new Date(event.date) < now).slice(0, 3);
      
      setUpcomingEvents(upcoming);
      setPastEvents(past);
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
    window.location.href = `${createPageUrl("UpdateEvent")}?id=${event.id}`;
  };

  // Mock stats data
  const stats = [
    { title: "Total Events", value: "12", icon: Calendar, color: "bg-blue-500", change: "+2 this month" },
    { title: "Tickets Sold", value: "1,247", icon: Users, color: "bg-green-500", change: "+15% vs last month" },
    { title: "Revenue", value: "$45,320", icon: DollarSign, color: "bg-purple-500", change: "+22% vs last month" },
    { title: "Average Rating", value: "4.8", icon: TrendingUp, color: "bg-orange-500", change: "Based on 143 reviews" }
  ];

  return (
    <PartnerLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Manage your events and track performance</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Link to={createPageUrl("UserNotification")}>
              <Button variant="outline" className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Notify Users
              </Button>
            </Link>
            <Link to={createPageUrl("CreateEvent")}>
              <Button className="luxury-gradient text-white flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create Event
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.color} bg-opacity-20`}>
                    <stat.icon className={`w-5 h-5 ${stat.color.replace('bg-', 'text-')}`} />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Events Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Events */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
              <Link to={createPageUrl("MyEvents")}>
                <Button variant="ghost" className="text-purple-600 hover:text-purple-700">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 h-48 rounded-xl"></div>
                  </div>
                ))}
              </div>
            ) : upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <PartnerEventCard
                    key={event.id}
                    event={event}
                    onPreview={handlePreviewEvent}
                    onEdit={handleEditEvent}
                  />
                ))}
              </div>
            ) : (
              <Card className="border-dashed border-2 border-gray-200">
                <CardContent className="p-8 text-center">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Upcoming Events</h3>
                  <p className="text-gray-600 mb-4">Create your first event to get started</p>
                  <Link to={createPageUrl("CreateEvent")}>
                    <Button className="luxury-gradient text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Event
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Past Events */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Recent Past Events</h2>
              <Link to={createPageUrl("MyEvents")}>
                <Button variant="ghost" className="text-purple-600 hover:text-purple-700">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 h-48 rounded-xl"></div>
                  </div>
                ))}
              </div>
            ) : pastEvents.length > 0 ? (
              <div className="space-y-4">
                {pastEvents.map((event) => (
                  <PartnerEventCard
                    key={event.id}
                    event={event}
                    onPreview={handlePreviewEvent}
                    onEdit={handleEditEvent}
                  />
                ))}
              </div>
            ) : (
              <Card className="border-dashed border-2 border-gray-200">
                <CardContent className="p-8 text-center">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Past Events</h3>
                  <p className="text-gray-600">Your completed events will appear here</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </PartnerLayout>
  );
}