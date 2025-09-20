import React, { useState, useEffect } from "react";
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
import { Alert, AlertDescription } from "../components/ui/alert";
import { 
  Save, 
  Eye, 
  ArrowLeft, 
  Calendar, 
  FileText,
  AlertTriangle
} from "lucide-react";

export default function UpdateEvent() {
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({});

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
      if (foundEvent) {
        setEvent(foundEvent);
        setFormData(foundEvent);
      }
    } catch (error) {
      console.error("Error loading event:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await Event.update(event.id, formData);
      alert("Event updated successfully!");
      navigate(createPageUrl("PartnerDashboard"));
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Error updating event. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    window.open(`${createPageUrl("EventDetails")}?id=${event.id}`, '_blank');
  };

  if (isLoading) {
    return (
      <PartnerLayout>
        <div className="p-6 max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded-xl"></div>
            <div className="h-32 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </PartnerLayout>
    );
  }

  if (!event) {
    return (
      <PartnerLayout>
        <div className="p-6 max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
          <p className="text-gray-600 mb-6">The event you're trying to edit doesn't exist.</p>
          <Button onClick={() => navigate(createPageUrl("PartnerDashboard"))}>
            Back to Dashboard
          </Button>
        </div>
      </PartnerLayout>
    );
  }

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

  return (
    <PartnerLayout>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate(createPageUrl("PartnerDashboard"))}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Update Event</h1>
              <p className="text-gray-600">Edit your event details</p>
            </div>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button variant="outline" onClick={handlePreview}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="luxury-gradient text-white"
            >
              {isSaving ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Saving...
                </div>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Warning for Past Events */}
        {new Date(event.date) < new Date() && (
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <AlertTriangle className="w-4 h-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              This is a past event. Changes may affect reporting and analytics.
            </AlertDescription>
          </Alert>
        )}

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
              <div className="space-y-2">
                <Label>Event Image URL</Label>
                <Input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image_url || ""}
                  onChange={(e) => handleInputChange('image_url', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Event Name *</Label>
                  <Input
                    id="name"
                    value={formData.name || ""}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select 
                    value={formData.category || ""} 
                    onValueChange={(value) => handleInputChange('category', value)}
                  >
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
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => handleInputChange('description', e.target.value)}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Event Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date || ""}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Event Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time || ""}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="venue">Venue Name *</Label>
                  <Input
                    id="venue"
                    value={formData.venue || ""}
                    onChange={(e) => handleInputChange('venue', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location || ""}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    required
                  />
                </div>
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
                  value={formData.organizer_note || ""}
                  onChange={(e) => handleInputChange('organizer_note', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price_min">Minimum Price ($)</Label>
                  <Input
                    id="price_min"
                    type="number"
                    value={formData.price_min || ""}
                    onChange={(e) => handleInputChange('price_min', parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price_max">Maximum Price ($)</Label>
                  <Input
                    id="price_max"
                    type="number"
                    value={formData.price_max || ""}
                    onChange={(e) => handleInputChange('price_max', parseFloat(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="total_tickets">Total Tickets</Label>
                  <Input
                    id="total_tickets"
                    type="number"
                    value={formData.total_tickets || ""}
                    onChange={(e) => handleInputChange('total_tickets', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tickets_available">Available Tickets</Label>
                  <Input
                    id="tickets_available"
                    type="number"
                    value={formData.tickets_available || ""}
                    onChange={(e) => handleInputChange('tickets_available', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PartnerLayout>
  );
}