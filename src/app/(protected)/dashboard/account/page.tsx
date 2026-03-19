"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Building, Phone, ArrowLeft, ShieldCheck, CheckCircle2, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiPost } from "@/lib/apiClient";

export default function AccountPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
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

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex w-11/12 max-w-7xl gap-8 py-10">
        
        {/* Sidebar */}
        <aside className="w-full max-w-xs rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
          {/* Header & Back */}
          <div className="mb-8">
            <Button 
                variant="ghost" 
                className="mb-4 w-fit text-slate-500 hover:text-slate-900 gap-2 px-0"
                onClick={() => router.push("/dashboard")}
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
            </Button>
            <h2 className="text-xl font-semibold text-slate-900">Account Settings</h2>
          </div>

          <div>
             <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Settings</p>
             <nav className="space-y-2">
                <Button
                    variant={activeTab === "profile" ? "secondary" : "ghost"}
                    className={`w-full justify-start gap-3 rounded-2xl py-5 text-base transition ${
                        activeTab === "profile"
                            ? "bg-violet-50 text-violet-600 hover:bg-violet-100"
                            : "text-slate-600 hover:bg-slate-100"
                    }`}
                    onClick={() => setActiveTab("profile")}
                >
                    <User className="size-5" />
                    Profile Details
                </Button>
                <Button
                    variant={activeTab === "payment" ? "secondary" : "ghost"}
                    className={`w-full justify-start gap-3 rounded-2xl py-5 text-base transition ${
                        activeTab === "payment"
                            ? "bg-violet-50 text-violet-600 hover:bg-violet-100"
                            : "text-slate-600 hover:bg-slate-100"
                    }`}
                    onClick={() => setActiveTab("payment")}
                >
                    <CreditCard className="size-5" />
                    Payment Details
                </Button>
             </nav>
          </div>
        </aside>

        {/* Main Content */}
        <section className="flex-1 rounded-3xl border border-slate-200 bg-white px-8 py-10 shadow-sm">
           {activeTab === "profile" && (
             <div className="animate-in fade-in duration-300 slide-in-from-bottom-2">
                <h1 className="text-3xl font-semibold text-slate-900 mb-1">Profile Details</h1>
                <p className="text-sm text-slate-500 mb-8">Update your personal and company information</p>

                <div className="grid gap-8 xl:grid-cols-3">
                    {/* Left Column - Profile Card */}
                    <div className="xl:col-span-1 space-y-6">
                        <div className="rounded-3xl border border-slate-200 bg-slate-50/50 p-6 text-center shadow-sm">
                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-violet-100 text-violet-600 mb-4">
                                <User className="h-10 w-10" />
                            </div>
                            <h2 className="text-xl font-medium text-slate-900">{formData.name}</h2>
                            <p className="text-sm text-slate-500 mb-6">{formData.companyName}</p>

                            <div className="flex flex-col items-center justify-center gap-2 text-sm text-emerald-600 bg-emerald-50 py-2 rounded-xl border border-emerald-100">
                                <ShieldCheck className="h-5 w-5" />
                                <span className="font-medium">Verified Partner</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Form */}
                    <div className="xl:col-span-2">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
                            <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                                <User className="h-5 w-5 text-slate-400" />
                                Personal Information
                            </h3>

                            <div className="space-y-5">
                                <div className="grid gap-2">
                                <label className="text-sm font-medium text-slate-700">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <Input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="pl-10 h-11 bg-slate-50"
                                    />
                                </div>
                                </div>

                                <div className="grid gap-2">
                                <label className="text-sm font-medium text-slate-700">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <Input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="pl-10 h-11 bg-slate-50 text-slate-500"
                                    disabled
                                    />
                                </div>
                                <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                                    <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Email is verified.
                                </p>
                                </div>

                                <div className="h-px bg-slate-100 my-6"></div>

                                <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2 pt-2">
                                <Building className="h-5 w-5 text-slate-400" />
                                Company Details
                                </h3>

                                <div className="grid gap-2">
                                <label className="text-sm font-medium text-slate-700">Company Name</label>
                                <div className="relative">
                                    <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <Input
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleInputChange}
                                    className="pl-10 h-11 bg-slate-50"
                                    />
                                </div>
                                </div>

                                <div className="grid gap-2">
                                <label className="text-sm font-medium text-slate-700">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <Input
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="pl-10 h-11 bg-slate-50"
                                    />
                                </div>
                                </div>

                                <div className="pt-6">
                                <Button
                                    onClick={handleUpdateAccount}
                                    disabled={loading}
                                    className="w-full sm:w-auto rounded-xl bg-violet-600 px-8 text-white hover:bg-violet-700 h-11"
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
                <h1 className="text-3xl font-semibold text-slate-900 mb-1">Payment Details</h1>
                <p className="text-sm text-slate-500 mb-8">Manage your payout methods and billing information</p>

                <div className="grid gap-6 rounded-2xl border border-dashed border-slate-200 p-12 text-center text-slate-400">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 mb-2">
                        <CreditCard className="h-8 w-8 text-slate-300" />
                    </div>
                    <p>No payment details added yet. Connect a bank account to receive event payouts.</p>
                    <Button
                        variant="outline"
                        className="mx-auto w-fit rounded-xl border-slate-200 text-violet-600 hover:border-violet-200 hover:bg-violet-50 mt-4"
                    >
                        + Add Payment Method
                    </Button>
                </div>
             </div>
           )}
        </section>
      </div>
    </div>
  );
}
