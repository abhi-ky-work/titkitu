import React from "react";
import { Button } from "./ui/button";
import { Building2, TrendingUp, Users, Shield } from "lucide-react";

export default function BusinessOnboarding() {
  return (
    <section className="py-20 luxury-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Partner with EventLux
            </h2>
            <p className="text-xl mb-8 text-purple-100">
              Join our premium booking platform and reach millions of event-goers. 
              Grow your business with our cutting-edge tools and marketing support.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start space-x-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Boost Revenue</h3>
                  <p className="text-purple-100">Increase ticket sales by 40%</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Wider Reach</h3>
                  <p className="text-purple-100">Access to 10M+ users</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Easy Management</h3>
                  <p className="text-purple-100">Intuitive dashboard & tools</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Secure Payments</h3>
                  <p className="text-purple-100">Enterprise-grade security</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 rounded-full">
                Get Started Today
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 rounded-full">
                Schedule Demo
              </Button>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="aspect-square rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-8 flex items-center justify-center">
              <div className="text-center text-white space-y-6">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                  <Building2 className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-bold">Join 5,000+</h3>
                <p className="text-lg text-purple-100">Premium Venues</p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">98%</div>
                    <div className="text-sm text-purple-100">Satisfaction</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">24/7</div>
                    <div className="text-sm text-purple-100">Support</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">Zero</div>
                    <div className="text-sm text-purple-100">Setup Fee</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}