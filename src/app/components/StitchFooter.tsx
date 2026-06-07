"use client";

export default function StitchFooter() {
  return (
    <footer className="bg-surface-container-lowest w-full py-10 mt-auto border-t border-outline-variant transition-colors duration-300">
      <div className="flex flex-col md:flex-row justify-between items-center px-5 max-w-7xl mx-auto gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="font-display-lg text-xl font-extrabold text-primary">TiketIt</span>
          <p className="text-on-surface-variant text-xs">TiketIt 2026 • Instant Access to the Best Nightlife.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          <span className="text-on-surface-variant hover:text-secondary-container transition-colors text-xs font-medium cursor-pointer">About Us</span>
          <span className="text-on-surface-variant hover:text-secondary-container transition-colors text-xs font-medium cursor-pointer">Contact Support</span>
          <span className="text-on-surface-variant hover:text-secondary-container transition-colors text-xs font-medium cursor-pointer">Terms of Service</span>
          <span className="text-on-surface-variant hover:text-secondary-container transition-colors text-xs font-medium cursor-pointer">Privacy Policy</span>
          <span className="text-on-surface-variant hover:text-secondary-container transition-colors text-xs font-medium cursor-pointer">Partner with Us</span>
        </div>
        <div className="flex gap-4">
          <button className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-on-surface-variant hover:text-primary transition-all cursor-pointer">
            <span className="material-symbols-outlined">share</span>
          </button>
          <button className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-on-surface-variant hover:text-primary transition-all cursor-pointer">
            <span className="material-symbols-outlined">public</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
