"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { apiPost, publicGet } from "@/lib/apiClient";
import { getCurrentUser } from "@/lib/cognitoActions";
import {
  Loader2,
  Calendar,
  Clock,
  Ticket,
  Plus,
  Minus,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

interface TicketTypeInventory {
  id: string;
  eventInventoryId: string;
  catalogTicketTypeId: string;
  name: string;
  categoryCode: string;
  price: number;
  totalQuantity: number;
  availableQuantity: number;
  isActive: boolean;
  isSoldOut: boolean;
}

interface EventInventoryDetails {
  id: string;
  catalogEventId: string;
  title: string;
  description?: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  venueId: string;
  city: string;
  availableSeats: number;
  basePrice: number;
  noteToAttendees?: string;
  ticketTypeInventory: TicketTypeInventory[];
}

interface BookTicketsModalProps {
  isOpen: boolean;
  onClose: () => void;
  catalogEventId: string;
  eventName: string;
}

export function BookTicketsModal({
  isOpen,
  onClose,
  catalogEventId,
  eventName,
}: BookTicketsModalProps) {
  const [inventoryDetails, setInventoryDetails] = useState<EventInventoryDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTicketType, setSelectedTicketType] = useState<TicketTypeInventory | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<any | null>(null);

  // Fetch real-time inventory on open
  useEffect(() => {
    if (isOpen && catalogEventId) {
      fetchInventory();
    } else {
      // Reset state on close
      setInventoryDetails(null);
      setError(null);
      setSelectedTicketType(null);
      setQuantity(1);
      setBookingSuccess(null);
    }
  }, [isOpen, catalogEventId]);

  const fetchInventory = async () => {
    setLoading(true);
    setError(null);
    try {
      // Booking service endpoint: GET /api/v1/booking/events/:catalogEventId (which we updated to resolve catalogEventId)
      const response = await publicGet(`/api/v1/booking/events/${catalogEventId}`);
      if (response && response.data) {
        const details = response.data as EventInventoryDetails;
        setInventoryDetails(details);
        // Default select first available ticket type
        const availableTiers = details.ticketTypeInventory?.filter(t => !t.isSoldOut && t.availableQuantity > 0) || [];
        if (availableTiers.length > 0) {
          setSelectedTicketType(availableTiers[0]);
        }
      } else {
        setError("Event inventory details not found in the booking service.");
      }
    } catch (err: any) {
      console.error("Failed to fetch event inventory:", err);
      setError(err.message || "Could not retrieve ticket inventory from booking service.");
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!inventoryDetails) return;
    setBookingLoading(true);
    setError(null);

    try {
      const user = await getCurrentUser();
      const userId = user?.username || "anonymous_user_" + Math.random().toString(36).substr(2, 9);
      const idempotencyKey = crypto.randomUUID();

      const bookingPayload = {
        userId,
        eventInventoryId: inventoryDetails.id,
        ticketTypeInventoryId: selectedTicketType?.id || undefined,
        numberOfTickets: quantity,
        paymentMethod: "STRIPE",
        idempotencyKey,
      };

      const response = await apiPost("/api/v1/booking/bookings", bookingPayload);
      if (response) {
        setBookingSuccess(response);
      } else {
        throw new Error("No response received from booking transaction API.");
      }
    } catch (err: any) {
      console.error("Failed to create booking:", err);
      setError(err.message || "Failed to book tickets. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  const incrementQty = () => {
    const limit = selectedTicketType 
      ? selectedTicketType.availableQuantity 
      : (inventoryDetails?.availableSeats || 1);
    if (quantity < Math.min(limit, 10)) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQty = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const formatDateTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const formatTime = (timeStr: string) => {
    try {
      const d = new Date(timeStr);
      return d.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return timeStr.substring(11, 16) || timeStr;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-3xl p-6 overflow-hidden">
        {bookingSuccess ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-md mb-6">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <DialogTitle className="text-2xl font-bold text-slate-900 mb-2">
              Booking Confirmed!
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500 max-w-sm mb-6">
              Your tickets for **{eventName}** have been booked successfully.
            </DialogDescription>

            <div className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-100 text-left space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Booking Reference:</span>
                <span className="font-mono font-bold text-slate-900">
                  {bookingSuccess.booking?.bookingRef || "N/A"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Total Paid:</span>
                <span className="font-bold text-violet-600">
                  ${bookingSuccess.booking?.totalAmount?.toFixed(2) || "0.00"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Tickets Quantity:</span>
                <span className="font-bold text-slate-950">
                  {bookingSuccess.booking?.numberOfTickets}x {selectedTicketType?.name || "General Admission"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Payment Status:</span>
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                  {bookingSuccess.payment?.status || "CONFIRMED"}
                </span>
              </div>
            </div>

            <Button
              onClick={onClose}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-2xl py-5 font-semibold"
            >
              Done
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader className="mb-4">
              <DialogTitle className="text-xl font-bold text-slate-900 truncate">
                Book Tickets for {eventName}
              </DialogTitle>
              <DialogDescription>
                Select your ticket tier and quantity to complete your purchase.
              </DialogDescription>
            </DialogHeader>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-violet-600 mb-2" />
                <p className="text-sm text-slate-500">Checking seat inventory...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center text-center py-6">
                <div className="rounded-full bg-rose-50 p-3 text-rose-500 mb-3">
                  <AlertTriangle className="h-8 w-8" />
                </div>
                <p className="text-sm font-semibold text-slate-800 mb-2">Failed to load inventory</p>
                <p className="text-xs text-rose-500 max-w-sm mb-6">{error}</p>
                <Button onClick={fetchInventory} variant="outline" className="rounded-xl border-slate-200">
                  Try Again
                </Button>
              </div>
            ) : inventoryDetails ? (
              <div className="space-y-5">
                {/* Event mini summary */}
                <div className="flex flex-col gap-2 rounded-2xl bg-slate-50 p-4 border border-slate-100 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="h-4 w-4 text-violet-500" />
                    <span>{formatDateTime(inventoryDetails.eventDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="h-4 w-4 text-violet-500" />
                    <span>
                      {formatTime(inventoryDetails.startTime)}
                      {inventoryDetails.endTime ? ` - ${formatTime(inventoryDetails.endTime)}` : ""}
                    </span>
                  </div>
                </div>

                {/* Tiers List */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                    Ticket Tiers
                  </label>
                  <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                    {inventoryDetails.ticketTypeInventory?.length === 0 ? (
                      <p className="text-xs text-slate-500">No ticket types found.</p>
                    ) : (
                      inventoryDetails.ticketTypeInventory?.map((tier) => {
                        const isSelected = selectedTicketType?.id === tier.id;
                        const isSoldOut = tier.isSoldOut || tier.availableQuantity <= 0;
                        return (
                          <div
                            key={tier.id}
                            onClick={() => !isSoldOut && setSelectedTicketType(tier)}
                            className={`flex items-center justify-between rounded-2xl border p-4 cursor-pointer transition ${
                              isSoldOut 
                                ? "opacity-55 cursor-not-allowed bg-slate-50 border-slate-200" 
                                : isSelected
                                ? "border-violet-500 bg-violet-50/50"
                                : "border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <Ticket className={`h-5 w-5 mt-0.5 ${isSelected ? "text-violet-600" : "text-slate-400"}`} />
                              <div>
                                <p className="font-semibold text-slate-800 text-sm">{tier.name}</p>
                                <p className="text-xs text-slate-400">
                                  {isSoldOut ? "Sold Out" : `${tier.availableQuantity} seats left`}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-slate-900">${tier.price.toFixed(2)}</p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Quantity selector */}
                <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
                      Quantity
                    </label>
                    <p className="text-xs text-slate-500">Max 10 per checkout</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={decrementQty}
                      disabled={quantity <= 1}
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:pointer-events-none transition"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-6 text-center font-bold text-slate-850 text-base">{quantity}</span>
                    <button
                      onClick={incrementQty}
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Total amount */}
                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm font-semibold text-slate-600">Total Price:</span>
                  <span className="text-2xl font-bold text-violet-700">
                    ${((selectedTicketType?.price || inventoryDetails.basePrice) * quantity).toFixed(2)}
                  </span>
                </div>

                <DialogFooter className="pt-2">
                  <Button variant="ghost" onClick={onClose} disabled={bookingLoading} className="rounded-xl">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleBooking}
                    disabled={bookingLoading || !selectedTicketType}
                    className="bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl px-6"
                  >
                    {bookingLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Booking...
                      </>
                    ) : (
                      "Confirm Booking"
                    )}
                  </Button>
                </DialogFooter>
              </div>
            ) : null}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
