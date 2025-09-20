import React, { useState, useEffect } from "react";
import Event from "../entities/Event.json";
import Header from "../components/Header";
import TicketSelector from "../components/TicketSelector";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Card, CardContent } from "../components/ui/card";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Share2, 
  Heart, 
  ArrowLeft,
  Star,
  Ticket,
  AlertTriangle
} from "lucide-react";
import { format } from "date-fns";

export default function EventDetails() {
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');
    if (eventId) {
      loadEvent(eventId);
    }
  }, []);

  const loadEvent = async (eventId) => {
    setIsLoading(true);
    try {
      const events = await Event.list();
      const foundEvent = events.find(e => e.id === eventId);
      setEvent(foundEvent);
    } catch (error) {
      console.error("Error loading event:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBooking = (booking) => {
    alert(`Booking ${booking.totalTickets} tickets for $${booking.totalPrice}. In a real app, this would redirect to payment.`);
  };

  const formatDate = (dateStr) => {
    try {
      return format(new Date(dateStr), "EEEE, MMMM do, yyyy");
    } catch {
      return dateStr;
    }
  };

  const getCategoryColor = (category) => {
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
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-64 bg-gray-200 rounded-xl"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  <div className="h-6 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-32 bg-gray-200 rounded"></div>
                </div>
                <div className="h-96 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
            <p className="text-gray-600 mb-6">The event you're looking for doesn't exist.</p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </div>
        </div>
      </div>
    );
  }

  // Mock resale tickets data
  const resaleTickets = [
    { id: 1, type: "General", originalPrice: event.price_min, price: Math.floor(event.price_min * 0.9), discount: 10 },
    { id: 2, type: "Premium", originalPrice: Math.floor(event.price_min * 1.5), price: Math.floor(event.price_min * 1.5 * 0.9), discount: 10 }
  ];

  const surgeTickets = event.is_sold_out ? [
    { id: 3, type: "General", originalPrice: event.price_min, price: Math.floor(event.price_min * 1.2), surge: 20 },
    { id: 4, type: "Premium", originalPrice: Math.floor(event.price_min * 1.5), price: Math.floor(event.price_min * 1.5 * 1.2), surge: 20 }
  ] : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Button>

          {/* Hero Section */}
          <div className="relative mb-8">
            <div className="aspect-[21/9] rounded-2xl overflow-hidden premium-shadow">
              <img
                src={event.image_url || `https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&h=600&fit=crop&crop=center`}
                alt={event.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <Badge className={getCategoryColor(event.category)}>
                    {event.category?.replace('_', ' ')}
                  </Badge>
                  {event.is_featured && (
                    <Badge className="bg-amber-500 text-white">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      Featured
                    </Badge>
                  )}
                  {event.is_sold_out && (
                    <Badge variant="destructive">Sold Out</Badge>
                  )}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">{event.name}</h1>
                <p className="text-xl text-gray-200">{event.venue} • {event.location}</p>
              </div>
              <div className="absolute top-6 right-6 flex gap-2">
                <Button variant="outline" size="icon" className="bg-white/20 border-white/20 text-white hover:bg-white hover:text-gray-900">
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="bg-white/20 border-white/20 text-white hover:bg-white hover:text-gray-900">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Event Details */}
            <div className="lg:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="details">Event Details</TabsTrigger>
                  <TabsTrigger value="resale" className="relative">
                    Resale Tickets
                    {(resaleTickets.length > 0 || surgeTickets.length > 0) && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                    )}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-6">
                  {/* Event Info */}
                  <Card>
                    <CardContent className="p-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-5 h-5 mr-3 text-purple-600" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-5 h-5 mr-3 text-purple-600" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-5 h-5 mr-3 text-purple-600" />
                          <span>{event.venue}, {event.location}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Users className="w-5 h-5 mr-3 text-purple-600" />
                          <span>{event.tickets_available} of {event.total_tickets} tickets available</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Description */}
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
                      <p className="text-gray-600 leading-relaxed text-lg">{event.description}</p>
                    </CardContent>
                  </Card>

                  {/* Organizer Note */}
                  {event.organizer_note && (
                    <Card className="border-l-4 border-purple-500">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Note from Organizer</h3>
                        <p className="text-gray-600 italic">{event.organizer_note}</p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Gallery */}
                  {event.gallery_images && event.gallery_images.length > 0 && (
                    <Card>
                      <CardContent className="p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Past Events at {event.venue}</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {event.gallery_images.slice(0, 6).map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`Gallery ${index + 1}`}
                              className="aspect-square object-cover rounded-lg hover:scale-105 transition-transform duration-200 cursor-pointer"
                            />
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="resale" className="space-y-6">
                  {/* Resale Info */}
                  <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="p-6">
                      <div className="flex items-start">
                        <Ticket className="w-5 h-5 text-blue-600 mr-3 mt-1" />
                        <div>
                          <h3 className="font-semibold text-blue-900 mb-1">Resale Tickets</h3>
                          <p className="text-blue-700 text-sm">
                            These are tickets being resold by other attendees. All transactions are secure and verified.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Discounted Resale Tickets */}
                  {!event.is_sold_out && resaleTickets.length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Available Resale Tickets (10% Off)</h3>
                      <div className="space-y-3">
                        {resaleTickets.map((ticket) => (
                          <Card key={ticket.id} className="border-green-200">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-semibold text-gray-900">{ticket.type} Admission</h4>
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg font-bold text-green-600">${ticket.price}</span>
                                    <span className="text-sm text-gray-500 line-through">${ticket.originalPrice}</span>
                                    <Badge className="bg-green-100 text-green-800">{ticket.discount}% OFF</Badge>
                                  </div>
                                </div>
                                <Button className="bg-green-600 hover:bg-green-700">
                                  Buy Now
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Surge Priced Tickets (Sold Out Events) */}
                  {event.is_sold_out && surgeTickets.length > 0 && (
                    <div>
                      <Card className="border-red-200 bg-red-50 mb-4">
                        <CardContent className="p-4">
                          <div className="flex items-start">
                            <AlertTriangle className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
                            <div>
                              <h3 className="font-semibold text-red-900 mb-1">High Demand Event</h3>
                              <p className="text-red-700 text-sm">
                                This event is sold out. Limited resale tickets available at premium pricing (+20%).
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Premium Resale Tickets (+20%)</h3>
                      <div className="space-y-3">
                        {surgeTickets.map((ticket) => (
                          <Card key={ticket.id} className="border-orange-200">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-semibold text-gray-900">{ticket.type} Admission</h4>
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg font-bold text-orange-600">${ticket.price}</span>
                                    <span className="text-sm text-gray-500">(was ${ticket.originalPrice})</span>
                                    <Badge className="bg-orange-100 text-orange-800">+{ticket.surge}%</Badge>
                                  </div>
                                </div>
                                <Button className="bg-orange-600 hover:bg-orange-700">
                                  Buy Now
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {resaleTickets.length === 0 && surgeTickets.length === 0 && (
                    <div className="text-center py-12">
                      <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No Resale Tickets Available</h3>
                      <p className="text-gray-600">Check back later for resale options</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Ticket Booking Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Card className="premium-shadow">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Tickets</h2>
                    <TicketSelector event={event} onBooking={handleBooking} />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}