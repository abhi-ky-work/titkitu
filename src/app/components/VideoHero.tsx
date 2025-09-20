import React from "react";
import { Button } from "./ui/button";
import { Play, ArrowRight } from "lucide-react";

export default function VideoHero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video Placeholder */}
      <div className="absolute inset-0">
        <div 
          className="w-full h-full bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1920&h=1080&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Make Your Day
          <span className="block gold-accent">Unforgettable</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-200 font-light max-w-2xl mx-auto">
          Premium event experiences without any hassle. Discover, book, and enjoy the best events in your city.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button size="lg" className="bg-white text-purple-900 hover:bg-gray-100 text-lg px-8 py-4 rounded-full">
            Explore Events
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="border-white text-white hover:bg-white hover:text-purple-900 text-lg px-8 py-4 rounded-full"
          >
            <Play className="w-5 h-5 mr-2" />
            Watch Story
          </Button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Curated Events</h3>
            <p className="text-gray-300">Hand-picked premium experiences</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Instant Booking</h3>
            <p className="text-gray-300">Secure tickets in seconds</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <span className="text-2xl">🎭</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">VIP Experience</h3>
            <p className="text-gray-300">Exclusive access and perks</p>
          </div>
        </div>
      </div>
    </section>
  );
}