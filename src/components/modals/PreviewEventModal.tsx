import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { apiPost } from "@/lib/apiClient";
import { Loader2, Calendar, Clock, MapPin, Tag } from "lucide-react";

interface TicketType {
  categoryCode: string;
  categoryName: string;
  name: string;
  price: string;
  quantity: string;
}

interface PreviewEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventData: {
    name: string;
    category: string;
    description: string;
    eventDate: string;
    startTime: string;
    endTime?: string;
    venueName: string;
    location: string;
    ticketTypes: TicketType[];
    noteToAttendees?: string;
    termsConditions?: string;
    refundPolicy?: string;
  };
  onPublishSuccess: () => void;
}

export function PreviewEventModal({ isOpen, onClose, eventId, eventData, onPublishSuccess }: PreviewEventModalProps) {
  const [loading, setLoading] = useState(false);

  const handlePublish = async () => {
    if (!eventId) return;
    setLoading(true);
    try {
      // POST /api/v1/partner/events/:id/publish
      const response = await apiPost(`/api/v1/partner/events/${eventId}/publish`);
      console.log("Event published successfully:", response);
      alert("Event published successfully and propagated to OpenSearch/Redis!");
      onPublishSuccess();
      onClose();
    } catch (error: any) {
      console.error("Failed to publish event:", error);
      alert(error.message || "Failed to publish event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900">Preview Event Details</DialogTitle>
          <DialogDescription>
            Review your event details before making it public. Once published, it will be indexed for search.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Details */}
          <div>
            <h3 className="text-2xl font-bold text-violet-700">{eventData.name}</h3>
            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700 capitalize">
              <Tag className="h-3 w-3" />
              {eventData.category}
            </span>
            {eventData.description && (
              <p className="mt-3 text-sm text-slate-600 border-l-4 border-violet-200 pl-3 italic">
                "{eventData.description}"
              </p>
            )}
          </div>

          <hr className="border-slate-100" />

          {/* Date, Time & Venue */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400">Date</p>
                <p className="text-sm font-semibold text-slate-800">{eventData.eventDate}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400">Time</p>
                <p className="text-sm font-semibold text-slate-800">
                  {eventData.startTime} {eventData.endTime ? `to ${eventData.endTime}` : ""}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 md:col-span-2">
              <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400">Venue & Location</p>
                <p className="text-sm font-semibold text-slate-800">{eventData.venueName}</p>
                <p className="text-xs text-slate-500">{eventData.location}</p>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Ticket Types */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3">Ticket Tiers</h4>
            <div className="space-y-2">
              {eventData.ticketTypes.length === 0 ? (
                <p className="text-xs text-slate-500">No ticket tiers defined.</p>
              ) : (
                eventData.ticketTypes.map((ticket, index) => (
                  <div key={index} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{ticket.name}</p>
                      <p className="text-xs text-slate-500 capitalize">Category: {ticket.categoryName} ({ticket.categoryCode})</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400">Price</p>
                        <p className="text-sm font-bold text-slate-800">${ticket.price}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400">Qty</p>
                        <p className="text-sm font-bold text-slate-800">{ticket.quantity}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Additional info conditional blocks */}
          {(eventData.noteToAttendees || eventData.termsConditions || eventData.refundPolicy) && (
            <>
              <hr className="border-slate-100" />
              <div className="space-y-3">
                {eventData.noteToAttendees && (
                  <div>
                    <h5 className="text-xs font-bold text-slate-700">Note to Attendees</h5>
                    <p className="text-xs text-slate-500 mt-1">{eventData.noteToAttendees}</p>
                  </div>
                )}
                {eventData.termsConditions && (
                  <div>
                    <h5 className="text-xs font-bold text-slate-700">Terms & Conditions</h5>
                    <p className="text-xs text-slate-500 mt-1">{eventData.termsConditions}</p>
                  </div>
                )}
                {eventData.refundPolicy && (
                  <div>
                    <h5 className="text-xs font-bold text-slate-700">Refund Policy</h5>
                    <p className="text-xs text-slate-500 mt-1">{eventData.refundPolicy}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Back to Edit
          </Button>
          <Button type="button" onClick={handlePublish} disabled={loading} className="bg-violet-600 hover:bg-violet-700 text-white font-medium px-6">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publishing...
              </>
            ) : (
              "Publish Event"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
