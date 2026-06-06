import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiGet, apiPost } from "@/lib/apiClient";
import { Loader2, Search, MapPin } from "lucide-react";

interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddressAdded: (newAddressId?: string) => void;
}

interface Suggestion {
  Text: string;
  PlaceId: string;
}

export function AddAddressModal({ isOpen, onClose, onAddressAdded }: AddAddressModalProps) {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [fetchingSuggestions, setFetchingSuggestions] = useState(false);
  
  const [customAddressName, setCustomAddressName] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [latitude, setLatitude] = useState<number | "">("");
  const [longitude, setLongitude] = useState<number | "">("");

  useEffect(() => {
    if (!isOpen) return;
    setSearchQuery("");
    setSuggestions([]);
    setCustomAddressName("");
    setAddressLine1("");
    setAddressLine2("");
    setCity("");
    setStateName("");
    setZipCode("");
    setLatitude("");
    setLongitude("");
  }, [isOpen]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchQuery || searchQuery.length < 3) {
        setSuggestions([]);
        return;
      }
      setFetchingSuggestions(true);
      try {
        const response = await apiGet<Suggestion[]>(`/api/v1/partner/event-venues/autocomplete?text=${encodeURIComponent(searchQuery)}`);
        if (response) {
          setSuggestions(response);
        }
      } catch (error) {
        console.error("Failed to fetch address suggestions", error);
      } finally {
        setFetchingSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchSuggestions();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSelectSuggestion = async (placeId: string, text: string) => {
    setSearchQuery(text);
    setSuggestions([]);
    setLoading(true);
    try {
      const place = await apiGet<any>(`/api/v1/partner/event-venues/place?placeId=${placeId}`);
      if (place) {
        const addrParts = [];
        if (place.AddressNumber) addrParts.push(place.AddressNumber);
        if (place.Street) addrParts.push(place.Street);
        
        setAddressLine1(addrParts.join(' '));
        setCity(place.Municipality || place.Neighborhood || "");
        setStateName(place.Region || "");
        setZipCode(place.PostalCode || "");
        
        if (place.Geometry && place.Geometry.Point) {
          setLongitude(place.Geometry.Point[0]);
          setLatitude(place.Geometry.Point[1]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch place details", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAddressName || !addressLine1 || !city || !stateName || !zipCode) return;

    setLoading(true);
    try {
      const response = await apiPost<any>("/api/v1/partner/event-venues", {
        customAddressName,
        addressLine1,
        addressLine2,
        city,
        state: stateName,
        zipCode,
        latitude: latitude !== "" ? latitude : undefined,
        longitude: longitude !== "" ? longitude : undefined,
      });
      onAddressAdded(response?.id);
      onClose();
    } catch (error) {
      console.error("Failed to save address", error);
      alert("Failed to save address. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Address</DialogTitle>
            <DialogDescription>
              Search for your address or enter it manually below.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Autocomplete Search Input */}
            <div className="grid gap-2 relative">
              <label htmlFor="search" className="text-sm font-medium text-slate-700">
                Search Address
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Start typing an address..."
                  className="pl-9 h-10"
                  autoComplete="off"
                />
                {fetchingSuggestions && (
                  <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 animate-spin" />
                )}
              </div>
              
              {/* Suggestions Dropdown */}
              {suggestions.length > 0 && (
                <div className="absolute top-[70px] left-0 z-10 w-full rounded-md border border-slate-200 bg-white shadow-lg overflow-hidden">
                  <ul className="max-h-60 overflow-y-auto py-1">
                    {suggestions.map((suggestion, idx) => (
                      <li
                        key={idx}
                        className="flex cursor-pointer items-start gap-2 px-3 py-2 text-sm hover:bg-slate-50 text-slate-700"
                        onClick={() => handleSelectSuggestion(suggestion.PlaceId, suggestion.Text)}
                      >
                        <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-slate-400" />
                        <span className="line-clamp-2">{suggestion.Text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="h-px bg-slate-100 my-2"></div>

            {/* Manual Form Fields */}
            <div className="grid gap-2">
              <label htmlFor="customName" className="text-sm font-medium text-slate-700">
                Address Name <span className="text-rose-500">*</span> <span className="text-slate-400 font-normal">(e.g. Headquarters, Branch 1)</span>
              </label>
              <Input
                id="customName"
                value={customAddressName}
                onChange={(e) => setCustomAddressName(e.target.value)}
                placeholder="e.g. My Venue"
                className="h-10"
                required
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="addressLine1" className="text-sm font-medium text-slate-700">
                Address Line 1 <span className="text-rose-500">*</span>
              </label>
              <Input
                id="addressLine1"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                placeholder="Street address, building number"
                className="h-10"
                required
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="addressLine2" className="text-sm font-medium text-slate-700">
                Address Line 2
              </label>
              <Input
                id="addressLine2"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                placeholder="Apartment, suite, unit, etc. (optional)"
                className="h-10"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="city" className="text-sm font-medium text-slate-700">
                  City <span className="text-rose-500">*</span>
                </label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="h-10"
                  required
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="state" className="text-sm font-medium text-slate-700">
                  State/Region <span className="text-rose-500">*</span>
                </label>
                <Input
                  id="state"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  className="h-10"
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <label htmlFor="zipCode" className="text-sm font-medium text-slate-700">
                ZIP / Postal Code <span className="text-rose-500">*</span>
              </label>
              <Input
                id="zipCode"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="h-10"
                required
              />
            </div>

            {/* Read-only Coordinates */}
            {(latitude !== "" && longitude !== "") && (
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-slate-700">Latitude</label>
                  <Input value={latitude} disabled className="h-10 bg-slate-50 text-slate-500" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-slate-700">Longitude</label>
                  <Input value={longitude} disabled className="h-10 bg-slate-50 text-slate-500" />
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={!addressLine1 || !city || !stateName || !zipCode || loading} className="bg-violet-600 hover:bg-violet-700">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Save Address
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
