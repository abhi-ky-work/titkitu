"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CalendarDays,
  Clock,
  Eye,
  PlusCircle,
  UploadCloud,
} from "lucide-react";

export default function CreateEventPage() {
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
            <Button className="rounded-xl bg-violet-600 px-5 text-white hover:bg-violet-700">
              <PlusCircle className="mr-2 h-4 w-4" />
              Publish Event
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
                      type="text"
                      placeholder="Or paste image URL"
                      className="h-10 bg-white"
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
                  placeholder="Amazing Concert Night"
                  className="h-10 bg-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800 shadow-xs outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100">
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
                  className="h-10 bg-white pr-10 text-sm"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Start Time <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Input type="time" className="h-10 bg-white pr-10 text-sm" />
                <Clock className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                End Time
              </label>
              <div className="relative">
                <Input type="time" className="h-10 bg-white pr-10 text-sm" />
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
                placeholder="Madison Square Garden"
                className="h-10 bg-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Location <span className="text-rose-500">*</span>
              </label>
              <Input
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
              <Input type="datetime-local" className="h-10 bg-white pr-10 text-sm" />
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

          <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
            <p className="text-sm font-medium text-slate-800">Ticket Type 1</p>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Ticket Name
                </label>
                <Input
                  placeholder="General Admission"
                  className="h-10 bg-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Price ($)
                </label>
                <Input placeholder="50" className="h-10 bg-white" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Quantity
                </label>
                <Input placeholder="100" className="h-10 bg-white" />
              </div>
            </div>
          </div>

          <button
            type="button"
            className="mt-4 flex w-full items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-3 text-sm font-medium text-slate-600 hover:border-slate-400 hover:bg-slate-100"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Another Ticket Type
          </button>
        </section>

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


