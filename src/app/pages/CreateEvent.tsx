import React, { useState } from "react";
import Event from "../entities/Event.json";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/app/utils/utils-url";
import PartnerLayout from "../components/partner/PartnerLayout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
// import { Separator } from "../components/ui/separator";
// import { Badge } from "../components/ui/badge";
import { 
  Upload, 
  Eye, 
  Send, 
  Plus, 
  Minus, 
  Calendar, 
  Clock,
  MapPin,
  DollarSign,
  Users,
  FileText
} from "lucide-react";

export default function CreateEvent() {
  const navigate = useNavigate();
  const [isPreview, setIsPreview] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    venue: "",
    location: "",
    date: "",
    start_time: "",
    end_time: "",
    image_url: "",
    organizer_note: "",
    tickets_close_datetime: "",
    price_min: 0,
    price_max: 0,
    total_tickets: 0,
    terms_conditions: "",
    refund_policy: ""
  });

  const [ticketTypes, setTicketTypes] = useState([
    { type: "general", name: "General Admission", price: 50, quantity: 100, benefits: ["Entry to event"] }
  ]);

  const categories = [
    { value: "music", label: "Music" },
    { value: "sports", label: "Sports" },
    { value: "theater", label: "Theater" },
    { value: "comedy", label: "Comedy" },
    { value: "festivals", label: "Festivals" },
    { value: "conferences", label: "Conferences" },
    { value: "nightlife", label: "Nightlife" },
    { value: "food_drinks", label: "Food & Drinks" }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTicketType = () => {
    setTicketTypes(prev => [...prev, {
      type: "custom",
      name: "",
      price: 0,
      quantity: 0,
      benefits: [""]
    }]);
  };

  const updateTicketType = (index, field, value) => {
    setTicketTypes(prev => prev.map((ticket, i) => 
      i === index ? { ...ticket, [field]: value } : ticket
    ));
  };

  const removeTicketType = (index) => {
    setTicketTypes(prev => prev.filter((_, i) => i !== index));
  };

  const handlePreview = () => {
    setIsPreview(true);
    // In a real app, this would show a modal or new page with event preview
    alert("Preview functionality - this would show how the event looks to users");
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const totalTickets = ticketTypes.reduce((sum, ticket) => sum + ticket.quantity, 0);
      const minPrice = Math.min(...ticketTypes.map(t => t.price));
      const maxPrice = Math.max(...ticketTypes.map(t => t.price));

      const eventData = {
        ...formData,
        total_tickets: totalTickets,
        tickets_available: totalTickets,
        price_min: minPrice,
        price_max: maxPrice,
        is_featured: false,
        is_sold_out: false
      };

      await Event.create(eventData);
      navigate(createPageUrl("PartnerDashboard"));
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Error creating event. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <PartnerLayout>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Event</h1>
            <p className="text-gray-600">Fill in the details to create your event listing</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button variant="outline" onClick={handlePreview}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button 
              onClick={handlePublish} 
              disabled={isPublishing}
              className="luxury-gradient text-white"
            >
              {isPublishing ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Publishing...
                </div>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Publish Event
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Event Image */}
              <div className="space-y-2">
                <Label>Event Background Image</Label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                  <Input
                    type="url"
                    placeholder="Or paste image URL"
                    value={formData.image_url}
                    onChange={(e) => handleInputChange('image_url', e.target.value)}
                    className="mt-3"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Event Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Amazing Concert Night"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description & Promotion Text</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your event in detail. What can attendees expect?"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Date, Time & Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Date, Time & Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Event Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="start_time">Start Time *</Label>
                  <Input
                    id="start_time"
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => handleInputChange('start_time', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_time">End Time</Label>
                  <Input
                    id="end_time"
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => handleInputChange('end_time', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="venue">Venue Name *</Label>
                  <Input
                    id="venue"
                    value={formData.venue}
                    onChange={(e) => handleInputChange('venue', e.target.value)}
                    placeholder="Madison Square Garden"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="New York, NY"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tickets_close_datetime">Ticket Sales Close</Label>
                <Input
                  id="tickets_close_datetime"
                  type="datetime-local"
                  value={formData.tickets_close_datetime}
                  onChange={(e) => handleInputChange('tickets_close_datetime', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Ticket Types */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Ticket Types
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ticketTypes.map((ticket, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Ticket Type {index + 1}</h4>
                      {index > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTicketType(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Ticket Name</Label>
                        <Input
                          value={ticket.name}
                          onChange={(e) => updateTicketType(index, 'name', e.target.value)}
                          placeholder="General Admission"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Price ($)</Label>
                        <Input
                          type="number"
                          value={ticket.price}
                          onChange={(e) => updateTicketType(index, 'price', parseFloat(e.target.value))}
                          placeholder="50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          value={ticket.quantity}
                          onChange={(e) => updateTicketType(index, 'quantity', parseInt(e.target.value))}
                          placeholder="100"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button
                  variant="outline"
                  onClick={addTicketType}
                  className="w-full border-dashed"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Another Ticket Type
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="organizer_note">Note to Attendees</Label>
                <Textarea
                  id="organizer_note"
                  value={formData.organizer_note}
                  onChange={(e) => handleInputChange('organizer_note', e.target.value)}
                  placeholder="Any special instructions or information for attendees"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="terms_conditions">Terms & Conditions</Label>
                <Textarea
                  id="terms_conditions"
                  value={formData.terms_conditions}
                  onChange={(e) => handleInputChange('terms_conditions', e.target.value)}
                  placeholder="Event terms and conditions"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="refund_policy">Refund Policy</Label>
                <Textarea
                  id="refund_policy"
                  value={formData.refund_policy}
                  onChange={(e) => handleInputChange('refund_policy', e.target.value)}
                  placeholder="Describe your refund policy"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PartnerLayout>
  );
}