"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Building, Phone, ArrowLeft, ShieldCheck, CheckCircle2, CreditCard, MapPin, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiPost, apiGet } from "@/lib/apiClient";
import { AddAddressModal } from "@/components/modals/AddAddressModal";
import { useEffect } from "react";

export default function AccountPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "Partner Admin",
    email: "admin@eventlux.com",
    companyName: "EventLux Business",
    phone: "+1 (555) 123-4567",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateAccount = async () => {
    setLoading(true);
    try {
      console.log("Updating account...", formData);
      const response = await apiPost("/api/v1/partner/savePartnerProfileDetails", formData);
      console.log("Response:", response);
      alert("Account information updated successfully!");
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Failed to update account.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const data = await apiGet<any[]>("/api/v1/partner/event-venues");
      if (data) setAddresses(data);
    } catch (error) {
      console.error("Failed to fetch addresses", error);
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    if (activeTab === "addresses") {
      fetchAddresses();
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-background text-on-surface transition-colors duration-300">
      <div className="mx-auto flex w-11/12 max-w-7xl gap-8 py-10">
        
        {/* Sidebar */}
        <aside className="w-full max-w-xs rounded-3xl border border-outline-variant/30 bg-surface-container-low/80 p-6 shadow-sm backdrop-blur">
          {/* Header & Back */}
          <div className="mb-8">
            <Button 
                variant="ghost" 
                className="mb-4 w-fit text-on-surface-variant hover:text-on-surface gap-2 px-0 cursor-pointer"
                onClick={() => router.push("/dashboard")}
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
            </Button>
            <h2 className="text-xl font-semibold text-on-surface">Account Settings</h2>
          </div>

          <div>
             <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Settings</p>
             <nav className="space-y-2">
                <Button
                    variant={activeTab === "profile" ? "secondary" : "ghost"}
                    className={`w-full justify-start gap-3 rounded-2xl py-5 text-base transition cursor-pointer ${
                        activeTab === "profile"
                            ? "bg-primary/15 text-primary hover:bg-primary/20"
                            : "text-on-surface-variant hover:bg-surface-container-high"
                    }`}
                    onClick={() => setActiveTab("profile")}
                >
                    <User className="size-5" />
                    Profile Details
                </Button>
                <Button
                    variant={activeTab === "payment" ? "secondary" : "ghost"}
                    className={`w-full justify-start gap-3 rounded-2xl py-5 text-base transition cursor-pointer ${
                        activeTab === "payment"
                            ? "bg-primary/15 text-primary hover:bg-primary/20"
                            : "text-on-surface-variant hover:bg-surface-container-high"
                    }`}
                    onClick={() => setActiveTab("payment")}
                >
                    <CreditCard className="size-5" />
                    Payment Details
                </Button>
                <Button
                    variant={activeTab === "addresses" ? "secondary" : "ghost"}
                    className={`w-full justify-start gap-3 rounded-2xl py-5 text-base transition cursor-pointer ${
                        activeTab === "addresses"
                            ? "bg-primary/15 text-primary hover:bg-primary/20"
                            : "text-on-surface-variant hover:bg-surface-container-high"
                    }`}
                    onClick={() => setActiveTab("addresses")}
                >
                    <MapPin className="size-5" />
                    Addresses
                </Button>
             </nav>
          </div>
        </aside>

        {/* Main Content */}
        <section className="flex-1 rounded-3xl border border-outline-variant/30 bg-surface-container px-8 py-10 shadow-sm transition-colors duration-300">
           {activeTab === "profile" && (
             <div className="animate-in fade-in duration-300 slide-in-from-bottom-2">
                <h1 className="text-3xl font-semibold text-[var(--foreground)] mb-1">Profile Details</h1>
                <p className="text-sm text-on-surface-variant mb-8">Update your personal and company information</p>

                <div className="grid gap-8 xl:grid-cols-3">
                    {/* Left Column - Profile Card */}
                    <div className="xl:col-span-1 space-y-6">
                        <div className="rounded-3xl border border-outline-variant/30 bg-surface-container-low/50 p-6 text-center shadow-sm">
                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                                <User className="h-10 w-10" />
                            </div>
                            <h2 className="text-xl font-medium text-on-surface">{formData.name}</h2>
                            <p className="text-sm text-on-surface-variant mb-6">{formData.companyName}</p>

                            <div className="flex flex-col items-center justify-center gap-2 text-sm text-emerald-600 bg-emerald-500/10 py-2 rounded-xl border border-emerald-500/20">
                                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                                <span className="font-medium">Verified Partner</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Form */}
                    <div className="xl:col-span-2">
                        <div className="rounded-3xl border border-outline-variant/30 bg-surface-container-high p-6 sm:p-8 shadow-sm">
                            <h3 className="text-lg font-semibold text-on-surface mb-6 flex items-center gap-2">
                                <User className="h-5 w-5 text-on-surface-variant" />
                                Personal Information
                            </h3>

                            <div className="space-y-5">
                                <div className="grid gap-2">
                                <label className="text-sm font-medium text-on-surface-variant">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
                                    <Input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="pl-10 h-11 bg-surface-container-low border-outline-variant/50 text-on-surface"
                                    />
                                </div>
                                </div>

                                <div className="grid gap-2">
                                <label className="text-sm font-medium text-on-surface-variant">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
                                    <Input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="pl-10 h-11 bg-surface-container-low border-outline-variant/50 text-on-surface-variant/70"
                                    disabled
                                    />
                                </div>
                                <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-1">
                                    <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Email is verified.
                                </p>
                                </div>

                                <div className="h-px bg-outline-variant/10 my-6"></div>

                                <h3 className="text-lg font-semibold text-on-surface mb-6 flex items-center gap-2 pt-2">
                                <Building className="h-5 w-5 text-on-surface-variant" />
                                Company Details
                                </h3>

                                <div className="grid gap-2">
                                <label className="text-sm font-medium text-on-surface-variant">Company Name</label>
                                <div className="relative">
                                    <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
                                    <Input
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleInputChange}
                                    className="pl-10 h-11 bg-surface-container-low border-outline-variant/50 text-on-surface"
                                    />
                                </div>
                                </div>

                                <div className="grid gap-2">
                                <label className="text-sm font-medium text-on-surface-variant">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
                                    <Input
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="pl-10 h-11 bg-surface-container-low border-outline-variant/50 text-on-surface"
                                    />
                                </div>
                                </div>

                                <div className="pt-6">
                                <Button
                                    onClick={handleUpdateAccount}
                                    disabled={loading}
                                    className="w-full sm:w-auto rounded-xl bg-primary text-on-primary hover:scale-[1.02] active:scale-95 transition-all h-11 cursor-pointer"
                                >
                                    {loading ? "Saving changes..." : "Save Changes"}
                                </Button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
             </div>
           )}

           {activeTab === "payment" && (
             <div className="animate-in fade-in duration-300 slide-in-from-bottom-2">
                <h1 className="text-3xl font-semibold text-[var(--foreground)] mb-1">Payment Details</h1>
                <p className="text-sm text-on-surface-variant mb-8">Manage your payout methods and billing information</p>

                <div className="grid gap-6 rounded-2xl border border-dashed border-outline-variant/30 p-12 text-center text-on-surface-variant bg-surface-container-low/30">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-surface-container-low mb-2">
                        <CreditCard className="h-8 w-8 text-on-surface-variant/40" />
                    </div>
                    <p>No payment details added yet. Connect a bank account to receive event payouts.</p>
                    <Button
                        variant="outline"
                        className="mx-auto w-fit rounded-xl border-outline-variant text-primary hover:border-primary/50 hover:bg-primary/10 mt-4 cursor-pointer"
                    >
                        + Add Payment Method
                    </Button>
                </div>
             </div>
           )}

           {activeTab === "addresses" && (
             <div className="animate-in fade-in duration-300 slide-in-from-bottom-2">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h1 className="text-3xl font-semibold text-[var(--foreground)] mb-1">Addresses</h1>
                    <p className="text-sm text-on-surface-variant">Manage your business locations and billing addresses</p>
                  </div>
                  <Button 
                    onClick={() => setIsAddressModalOpen(true)}
                    className="bg-primary text-on-primary gap-2 rounded-xl h-10 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    Add Address
                  </Button>
                </div>

                {loadingAddresses ? (
                  <div className="flex h-32 items-center justify-center rounded-2xl border border-outline-variant/30 bg-surface-container-low">
                    <p className="text-sm text-on-surface-variant">Loading addresses...</p>
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="grid gap-6 rounded-2xl border border-dashed border-outline-variant/30 p-12 text-center text-on-surface-variant bg-surface-container-low/30">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-surface-container-low mb-2">
                          <MapPin className="h-8 w-8 text-on-surface-variant/40" />
                      </div>
                      <p>No addresses added yet. Add an address to use for your venues or billing.</p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {addresses.map((address) => (
                      <div key={address.id} className="relative rounded-2xl border border-outline-variant/30 bg-surface-container-high p-5 shadow-sm transition hover:border-primary/50 hover:shadow-md">
                        <div className="mb-3 flex items-start gap-3">
                          <div className="mt-0.5 rounded-full bg-primary/10 p-2 text-primary">
                            <MapPin className="h-4 w-4" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-on-surface line-clamp-1">
                              {address.customAddressName || address.city}
                            </h3>
                            {address.country === "IN" && <span className="text-[10px] font-medium uppercase tracking-wider text-on-surface-variant">India</span>}
                          </div>
                        </div>
                        <div className="text-sm text-on-surface-variant space-y-1 pl-[44px]">
                          <p className="line-clamp-1">{address.addressLine1}</p>
                          {address.addressLine2 && <p className="line-clamp-1">{address.addressLine2}</p>}
                          <p>{address.city}, {address.state} {address.zipCode}</p>
                          {(address.latitude && address.longitude) && (
                            <p className="text-[11px] text-on-surface-variant/70 pt-1 flex items-center gap-1">
                              <span className="material-symbols-outlined text-[12px]">location_on</span>
                              {address.latitude}, {address.longitude}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
             </div>
           )}
        </section>

        <AddAddressModal 
          isOpen={isAddressModalOpen} 
          onClose={() => setIsAddressModalOpen(false)} 
          onAddressAdded={fetchAddresses}
        />
      </div>
    </div>
  );
}
