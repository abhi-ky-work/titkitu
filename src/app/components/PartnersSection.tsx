import React from "react";

export default function PartnersSection() {
  const partners = [
    { name: "Spotify", logo: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=120&h=60&fit=crop" },
    { name: "Live Nation", logo: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=120&h=60&fit=crop" },
    { name: "Ticketmaster", logo: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=120&h=60&fit=crop" },
    { name: "Madison Square Garden", logo: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=120&h=60&fit=crop" },
    { name: "AEG Presents", logo: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=120&h=60&fit=crop" },
    { name: "Eventbrite", logo: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=120&h=60&fit=crop" }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of venues and organizers who trust EventLux to deliver exceptional experiences
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="group flex items-center justify-center p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="h-12 w-auto object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
              />
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-purple-600 mb-2">10M+</div>
            <div className="text-gray-600">Tickets Sold</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-600 mb-2">50K+</div>
            <div className="text-gray-600">Events Hosted</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-600 mb-2">99.9%</div>
            <div className="text-gray-600">Uptime Guarantee</div>
          </div>
        </div>
      </div>
    </section>
  );
}