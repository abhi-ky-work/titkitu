import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/app/utils/utils-url";
import { Search, Menu, X, Calendar, Users, LogIn, UserPlus, Building2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

export default function Header() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = (e:any) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`${createPageUrl("SearchResults")}?q=${encodeURIComponent(searchQuery)}`);
      if (isMenuOpen) setIsMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={createPageUrl("Dashboard")} className="flex items-center space-x-2">
            <div className="luxury-gradient p-2 rounded-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              EventLux
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
              />
            </form>

            <Link to={createPageUrl("BrowseEvents")}>
              <Button variant="ghost" className="text-gray-700 hover:text-purple-600 transition-colors">
                Browse Events
              </Button>
            </Link>

            <Link to={createPageUrl("PartnerSignIn")}>
              <Button variant="ghost" className="text-gray-700 hover:text-purple-600 transition-colors">
                <Building2 className="w-4 h-4 mr-2" />
                For Partners
              </Button>
            </Link>
            
            <div className="h-6 border-l border-gray-200"></div>

            {/* Auth Buttons */}
            <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
            <Button className="luxury-gradient text-white hover:opacity-90 transition-opacity">
              <UserPlus className="w-4 h-4 mr-2" />
              Register
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle className="flex items-center space-x-2">
                    <div className="luxury-gradient p-2 rounded-lg">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      EventLux
                    </span>
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {/* Mobile Search */}
                  <form onSubmit={handleSearch}>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search events..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 border-gray-200 focus:border-purple-500"
                      />
                    </div>
                  </form>

                  {/* Mobile Navigation */}
                  <div className="space-y-2">
                    <Link
                      to={createPageUrl("BrowseEvents")}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Users className="w-5 h-5 text-gray-500" />
                      <span>Browse Events</span>
                    </Link>
                    <Link
                      to={createPageUrl("PartnerSignIn")}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Building2 className="w-5 h-5 text-gray-500" />
                      <span>For Partners</span>
                    </Link>
                    <div className="border-t border-gray-200 pt-4 space-y-2">
                      <Button variant="outline" className="w-full justify-start border-purple-200 text-purple-600">
                        <LogIn className="w-4 h-4 mr-2" />
                        Sign In
                      </Button>
                      <Button className="w-full justify-start luxury-gradient text-white">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Register
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}