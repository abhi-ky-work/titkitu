"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiPost } from "@/lib/apiClient";
import {
  CalendarDays,
  Clock,
  Eye,
  PlusCircle,
  UploadCloud,
  Loader2,
  Trash2,
} from "lucide-react";
import { AddTicketTypeModal } from "@/components/modals/AddTicketTypeModal";

export default function CreateEventPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "Summer Music Festival 2024",
    category: "music",
    description: "Join us for an unforgettable night of live music and entertainment under the stars.",
    eventDate: "2024-07-15",
    startTime: "18:00",
    endTime: "23:00",
    venueName: "Sunset Arena",
    location: "Los Angeles, CA",
    ticketSalesClose: "2024-07-14T23:59",
    noteToAttendees: "Please bring your ID and a printed copy of your ticket.",
    termsConditions: "No refunds after purchase. Event will happen rain or shine.",
    refundPolicy: "Full refund if event is cancelled due to government restrictions.",
    ticketTypes: [] as Array<{
      categoryCode: string;
      categoryName: string;
      name: string;
      price: string;
      quantity: string;
    }>
  });

  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const removeTicketType = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ticketTypes: prev.ticketTypes.filter((_, i) => i !== index)
    }));
  };

  const handleAddTicket = (ticket: { categoryCode: string; name: string; price: string; quantity: string; categoryName: string }) => {
    setFormData(prev => ({
      ...prev,
      ticketTypes: [...prev.ticketTypes, ticket]
    }));
  };

  const handlePublish = async () => {
    setLoading(true);
    try {
      // For now, backgroundImage is handled as a placeholder in the backend API
      // We parse ticket string values to numbers
      const payload = {
        ...formData,
        ticketTypes: formData.ticketTypes.map(t => ({
          ...t,
          price: parseFloat(t.price),
          quantity: parseInt(t.quantity, 10),
        }))
      };

      // We send the form data to our Partner Service API
      const response = await apiPost("/api/v1/partner/events", payload);
      console.log("Event created successfully:", response);
      alert("Event published successfully!");
    } catch (error: any) {
      console.error("Failed to publish event:", error);
      alert(error.message || "Failed to publish event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto w-11/12 max-w-5xl space-y-8">
        {/* Page header */}
        <header className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">
              Create New Event
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Fill in the details to create your event listing
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="rounded-xl border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100"
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button
              onClick={handlePublish}
              disabled={loading}
              className="rounded-xl bg-violet-600 px-5 text-white hover:bg-violet-700"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <PlusCircle className="mr-2 h-4 w-4" />
              )}
              {loading ? "Publishing..." : "Publish Event"}
            </Button>
          </div>
        </header>

        {/* Basic Information */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-slate-900">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              📄
            </span>
            Basic Information
          </h2>

          <div className="space-y-6">
            {/* Event Background Image */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Event Background Image
              </label>
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-slate-500">
                <div className="flex flex-col items-center gap-3">
                  <UploadCloud className="h-8 w-8 text-slate-400" />
                  <p className="text-sm font-medium text-slate-700">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-slate-400">PNG, JPG up to 10MB</p>
                  <div className="mt-3 w-full max-w-xl">
                    <Input
                      type="file"
                      className="h-10 bg-white"
                      accept="image/*"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Event Name & Category */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Event Name <span className="text-rose-500">*</span>
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Amazing Concert Night"
                  className="h-10 bg-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800 shadow-xs outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                >
                  <option value="">Select category</option>
                  <option value="music">Music</option>
                  <option value="sports">Sports</option>
                  <option value="theatre">Theatre</option>
                  <option value="comedy">Comedy</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Description &amp; Promotion Text
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-xs outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                placeholder="Describe your event in detail. What can attendees expect?"
              />
            </div>
          </div>
        </section>

        {/* Date, Time & Location */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-slate-900">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              <CalendarDays className="h-4 w-4" />
            </span>
            Date, Time &amp; Location
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2 md:col-span-1">
              <label className="text-sm font-medium text-slate-700">
                Event Date <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleInputChange}
                  className="h-10 bg-white pr-10 text-sm"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Start Time <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className="h-10 bg-white pr-10 text-sm"
                />
                <Clock className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                End Time
              </label>
              <div className="relative">
                <Input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className="h-10 bg-white pr-10 text-sm"
                />
                <Clock className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Venue Name <span className="text-rose-500">*</span>
              </label>
              <Input
                name="venueName"
                value={formData.venueName}
                onChange={handleInputChange}
                placeholder="Madison Square Garden"
                className="h-10 bg-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Location <span className="text-rose-500">*</span>
              </label>
              <Input
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="New York, NY"
                className="h-10 bg-white"
              />
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Ticket Sales Close
            </label>
            <div className="relative">
              <Input
                type="datetime-local"
                name="ticketSalesClose"
                value={formData.ticketSalesClose}
                onChange={handleInputChange}
                className="h-10 bg-white pr-10 text-sm"
              />
            </div>
          </div>
        </section>

        {/* Ticket Types */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-slate-900">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              $
            </span>
            Ticket Types
          </h2>

          <div className="space-y-6">
            {formData.ticketTypes.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
                No ticket types added yet. Add your first ticket type below.
              </div>
            ) : (
              formData.ticketTypes.map((ticket, index) => (
                <div key={index} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex rounded-md bg-violet-100 px-2 py-1 text-xs font-semibold text-violet-700">
                        {ticket.categoryCode}
                      </span>
                      <p className="text-sm font-semibold text-slate-900">{ticket.name}</p>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      Category: {ticket.categoryName}
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Price</p>
                      <p className="text-sm font-semibold text-slate-900">${ticket.price}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Quantity</p>
                      <p className="text-sm font-semibold text-slate-900">{ticket.quantity}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeTicketType(index)}
                      className="ml-2 rounded-lg p-2 text-rose-500 hover:bg-rose-50"
                      title="Remove Ticket"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsTicketModalOpen(true)}
            className="mt-4 flex w-full items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-3 text-sm font-medium text-slate-600 hover:border-slate-400 hover:bg-slate-100"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Another Ticket Type
          </button>
        </section>

        <AddTicketTypeModal
          isOpen={isTicketModalOpen}
          onClose={() => setIsTicketModalOpen(false)}
          onAddTicket={handleAddTicket}
        />

        {/* Additional Information */}
        <section className="mb-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-slate-900">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              📄
            </span>
            Additional Information
          </h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Note to Attendees
              </label>
              <textarea
                name="noteToAttendees"
                value={formData.noteToAttendees}
                onChange={handleInputChange}
                rows={3}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-xs outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                placeholder="Any special instructions or information for attendees"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Terms &amp; Conditions
              </label>
              <textarea
                name="termsConditions"
                value={formData.termsConditions}
                onChange={handleInputChange}
                rows={3}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-xs outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                placeholder="Event terms and conditions"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Refund Policy
              </label>
              <textarea
                name="refundPolicy"
                value={formData.refundPolicy}
                onChange={handleInputChange}
                rows={3}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-xs outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                placeholder="Describe your refund policy"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}


