import React, { useState, useEffect } from "react";
import Event from "../entities/Event.json";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import EventCard from "./EventCard";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/app/utils/utils-url";

export default function PopularEventsCarousel() {
  const [events, setEvents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFeaturedEvents();
  }, []);

  const loadFeaturedEvents = async () => {
    try {
      const featuredEvents = await Event.filter({ is_featured: true }, "-created_date", 8);
      setEvents(featuredEvents);
    } catch (error) {
      console.error("Error loading featured events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    { name: "Music", key: "music", color: "from-purple-500 to-pink-500" },
    { name: "Sports", key: "sports", color: "from-blue-500 to-cyan-500" },
    { name: "Theater", key: "theater", color: "from-red-500 to-orange-500" },
    { name: "Comedy", key: "comedy", color: "from-yellow-500 to-orange-500" },
    { name: "Festivals", key: "festivals", color: "from-green-500 to-emerald-500" },
    { name: "Nightlife", key: "nightlife", color: "from-pink-500 to-purple-500" }
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, events.length - 2));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, events.length - 2)) % Math.max(1, events.length - 2));
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Categories Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Discover Popular Categories
          </h2>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {categories.map((category) => (
              <Link 
                key={category.key}
                to={`${createPageUrl("BrowseEvents")}?category=${category.key}`}
                className={`px-6 py-3 rounded-full bg-gradient-to-r ${category.color} text-white font-semibold hover:scale-105 transform transition-all duration-200 shadow-lg hover:shadow-xl`}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Events Carousel */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">Featured Events</h3>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={prevSlide}
                className="rounded-full"
                disabled={events.length <= 3}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextSlide}
                className="rounded-full"
                disabled={events.length <= 3}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-300 ease-in-out gap-6"
              style={{ transform: `translateX(-${currentIndex * 33.333}%)` }}
            >
              {events.map((event) => (
                <div key={event.id} className="min-w-[300px] flex-shrink-0">
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link to={createPageUrl("BrowseEvents")}>
            <Button size="lg" className="luxury-gradient text-white px-8 py-4 rounded-full text-lg">
              View All Events
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}