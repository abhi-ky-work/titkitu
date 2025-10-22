
import React from "react";
// import { Link } from "react-router-dom";
// import { createPageUrl } from "./utils"; // Changed import path as per instructions
import { Calendar, MapPin, Users, Star } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
// import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { redirect } from "next/navigation";

interface Event {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  category?: string;
  is_featured?: boolean;
  is_sold_out?: boolean;
  date: string;
  time: string;
  venue: string;
  location: string;
  tickets_available: number;
  total_tickets: number;
  price_min: number;
  price_max: number;
}

export default function EventCard({ event }: { event: Event }) {
  const formatDate = (dateStr:any) => {
    try {
      return format(new Date(dateStr), "MMM dd");
    } catch {
      return dateStr;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      music: "bg-purple-100 text-purple-800",
      sports: "bg-blue-100 text-blue-800",
      theater: "bg-red-100 text-red-800",
      comedy: "bg-yellow-100 text-yellow-800",
      festivals: "bg-green-100 text-green-800",
      conferences: "bg-gray-100 text-gray-800",
      nightlife: "bg-pink-100 text-pink-800",
      food_drinks: "bg-orange-100 text-orange-800"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div onClick={()=> redirect('/')}>
    {/* <Link to={`${createPageUrl("EventDetails")}?id=${event.id}`}> */}
      <Card className="group hover:premium-shadow hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden">
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={event.image_url || `https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop&crop=center`}
            alt={event.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            {/* <Badge className={getCategoryColor(event.category)}>
              {event.category?.replace('_', ' ')}
            </Badge> */}
          </div>
          {event.is_featured && (
            <div className="absolute top-3 right-3">
              <div className="bg-amber-500 text-white p-1.5 rounded-full">
                <Star className="w-4 h-4 fill-current" />
              </div>
            </div>
          )}
          {event.is_sold_out && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              {/* <Badge variant="destructive" className="text-sm font-semibold">
                SOLD OUT
              </Badge> */}
            </div>
          )}
        </div>
        <CardContent className="p-5">
          <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
            {event.name}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {event.description}
          </p>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{formatDate(event.date)} • {event.time}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{event.venue} • {event.location}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Users className="w-4 h-4 mr-2" />
              <span>{event.tickets_available} of {event.total_tickets} tickets available</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-purple-600">
                ${event.price_min}
              </span>
              {event.price_max > event.price_min && (
                <span className="text-gray-500 ml-1">- ${event.price_max}</span>
              )}
            </div>
            <div className="text-sm text-gray-500">
              per ticket
            </div>
          </div>
        </CardContent>
      </Card>
    {/* </Link> */}

    </div>
  );
}
