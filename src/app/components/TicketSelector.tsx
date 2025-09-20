import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Minus, Plus, ShoppingCart, Star, Clock } from "lucide-react";

export default function TicketSelector({ event, onBooking }) {
  const [selectedTickets, setSelectedTickets] = useState({});

  const ticketTypes = [
    {
      type: "general",
      name: "General Admission",
      price: event?.price_min || 50,
      benefits: ["Entry to event", "Access to main floor", "Standard seating"],
      available: Math.floor((event?.tickets_available || 100) * 0.6)
    },
    {
      type: "premium",
      name: "Premium",
      price: Math.floor((event?.price_min || 50) * 1.5),
      benefits: ["Priority entry", "Premium seating", "Welcome drink", "Coat check"],
      available: Math.floor((event?.tickets_available || 100) * 0.3)
    },
    {
      type: "vip",
      name: "VIP Experience",
      price: event?.price_max || 150,
      benefits: ["VIP entrance", "Best seats", "Premium bar access", "Meet & greet", "Exclusive merchandise"],
      available: Math.floor((event?.tickets_available || 100) * 0.1)
    }
  ];

  const updateTicketCount = (type, change) => {
    setSelectedTickets(prev => {
      const current = prev[type] || 0;
      const newCount = Math.max(0, Math.min(10, current + change));
      if (newCount === 0) {
        const { [type]: removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [type]: newCount };
    });
  };

  const getTotalPrice = () => {
    return Object.entries(selectedTickets).reduce((total, [type, count]) => {
      const ticket = ticketTypes.find(t => t.type === type);
      return total + (ticket?.price || 0) * count;
    }, 0);
  };

  const getTotalTickets = () => {
    return Object.values(selectedTickets).reduce((total, count) => total + count, 0);
  };

  const handleBooking = () => {
    const booking = {
      eventId: event?.id,
      tickets: selectedTickets,
      totalPrice: getTotalPrice(),
      totalTickets: getTotalTickets()
    };
    onBooking && onBooking(booking);
  };

  return (
    <div className="space-y-6">
      {/* Ticket Options */}
      <div className="space-y-4">
        {ticketTypes.map((ticket) => (
          <Card key={ticket.type} className="border-2 hover:border-purple-200 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {ticket.name}
                    {ticket.type === 'vip' && <Star className="w-4 h-4 inline-block ml-2 text-yellow-500 fill-current" />}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-2xl font-bold text-purple-600">${ticket.price}</span>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {ticket.available} left
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateTicketCount(ticket.type, -1)}
                    disabled={!selectedTickets[ticket.type]}
                    className="h-8 w-8"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-8 text-center font-medium">
                    {selectedTickets[ticket.type] || 0}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateTicketCount(ticket.type, 1)}
                    disabled={selectedTickets[ticket.type] >= 10 || ticket.available === 0}
                    className="h-8 w-8"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="text-sm text-gray-600 space-y-1">
                {ticket.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Booking Summary */}
      {getTotalTickets() > 0 && (
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">
                  {getTotalTickets()} {getTotalTickets() === 1 ? 'Ticket' : 'Tickets'} Selected
                </h3>
                <p className="text-sm text-gray-600">Secure checkout in next step</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">
                  ${getTotalPrice()}
                </div>
                <div className="text-sm text-gray-500">Total</div>
              </div>
            </div>
            <Button 
              onClick={handleBooking} 
              className="w-full luxury-gradient text-white text-lg py-3 rounded-full"
              size="lg"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Proceed to Checkout
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}