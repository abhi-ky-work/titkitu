import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/app/utils/utils-url";
import { Calendar, MapPin, Users, Eye, Edit, MoreHorizontal } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { format } from "date-fns";

export default function PartnerEventCard({ event, onPreview, onEdit }) {
  const formatDate = (dateStr) => {
    try {
      return format(new Date(dateStr), "MMM dd, yyyy");
    } catch {
      return dateStr;
    }
  };

  const getStatusColor = (event) => {
    const eventDate = new Date(event.date);
    const now = new Date();
    
    if (eventDate < now) {
      return "bg-gray-100 text-gray-800"; // Past event
    } else if (event.is_sold_out) {
      return "bg-red-100 text-red-800"; // Sold out
    } else {
      return "bg-green-100 text-green-800"; // Active
    }
  };

  const getStatusText = (event) => {
    const eventDate = new Date(event.date);
    const now = new Date();
    
    if (eventDate < now) {
      return "Past Event";
    } else if (event.is_sold_out) {
      return "Sold Out";
    } else {
      return "Active";
    }
  };

  return (
    <Card className="group hover:premium-shadow hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={event.image_url || `https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop&crop=center`}
          alt={event.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <Badge className={getStatusColor(event)}>
            {getStatusText(event)}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="bg-black/20 hover:bg-black/40 text-white">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onPreview && onPreview(event)}>
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit && onEdit(event)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Event
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <CardContent className="p-5">
        <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
          {event.name}
        </h3>
        
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
            <span>{event.total_tickets - event.tickets_available} / {event.total_tickets} sold</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-purple-600">
              ${((event.total_tickets - event.tickets_available) * event.price_min).toFixed(0)}
            </span>
            <span className="text-gray-500 ml-1 text-sm">revenue</span>
          </div>
          <div className="text-sm text-gray-500">
            {Math.round(((event.total_tickets - event.tickets_available) / event.total_tickets) * 100)}% sold
          </div>
        </div>
      </CardContent>
    </Card>
  );
}