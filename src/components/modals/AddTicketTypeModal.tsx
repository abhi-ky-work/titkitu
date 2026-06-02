import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiGet } from "@/lib/apiClient";
import { Loader2 } from "lucide-react";

interface TicketCategory {
  categoryCode: string;
  name: string;
  description?: string;
  isActive: boolean;
}

interface AddTicketTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTicket: (ticket: { categoryCode: string; name: string; price: string; quantity: string; categoryName: string }) => void;
}

export function AddTicketTypeModal({ isOpen, onClose, onAddTicket }: AddTicketTypeModalProps) {
  const [categories, setCategories] = useState<TicketCategory[]>([]);
  const [loading, setLoading] = useState(false);

  const [categoryCode, setCategoryCode] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      // Reset form
      setCategoryCode("");
      setName("");
      setPrice("");
      setQuantity("");
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      // Fetching active ticket categories from partner service
      const response = await apiGet<TicketCategory[]>("/api/v1/partner/ticket-categories");
      if (response) {
        setCategories(response.filter(c => c.isActive));
      }
    } catch (error) {
      console.error("Failed to fetch ticket categories", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryCode || !price || !quantity) return;

    const selectedCategory = categories.find((c) => c.categoryCode === categoryCode);
    const fallbackName = selectedCategory ? selectedCategory.name : "Unknown Category";
    
    // Default to the category name if no custom name is provided
    const ticketName = name.trim() !== "" ? name : fallbackName;

    onAddTicket({
      categoryCode,
      name: ticketName,
      price,
      quantity,
      categoryName: fallbackName,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Ticket Type</DialogTitle>
            <DialogDescription>
              Create a new ticket tier for your event.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="category" className="text-sm font-medium text-slate-700">
                Ticket Category <span className="text-rose-500">*</span>
              </label>
              {loading ? (
                <div className="flex h-10 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading categories...
                </div>
              ) : (
                <select
                  id="category"
                  value={categoryCode}
                  onChange={(e) => setCategoryCode(e.target.value)}
                  className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                  required
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.categoryCode} value={cat.categoryCode}>
                      {cat.name} ({cat.categoryCode})
                    </option>
                  ))}
                </select>
              )}
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium text-slate-700">
                Custom Ticket Name <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. VIP Backstage Pass"
                className="col-span-3 h-10"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="price" className="text-sm font-medium text-slate-700">
                  Price ($) <span className="text-rose-500">*</span>
                </label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="h-10"
                  required
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="quantity" className="text-sm font-medium text-slate-700">
                  Quantity <span className="text-rose-500">*</span>
                </label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  step="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="100"
                  className="h-10"
                  required
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!categoryCode || !price || !quantity} className="bg-violet-600 hover:bg-violet-700">
              Add Ticket
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
