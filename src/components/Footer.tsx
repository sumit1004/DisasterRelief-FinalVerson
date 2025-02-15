import React from 'react';
import { Heart } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">DisasterRelief.AI</h3>
            <p className="text-gray-400">AI-Driven disaster relief platform connecting those in need with volunteers and resources.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/report" className="hover:text-white">Report Emergency</a></li>
              <li><a href="/volunteer" className="hover:text-white">Become a Volunteer</a></li>
              <li><a href="/map" className="hover:text-white">Live Disaster Map</a></li>
              <li><a href="/about" className="hover:text-white">About Us</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/training" className="hover:text-white">Volunteer Training</a></li>
              <li><a href="/guidelines" className="hover:text-white">Emergency Guidelines</a></li>
              <li><a href="/faq" className="hover:text-white">FAQ</a></li>
              <li><a href="/contact" className="hover:text-white">Contact Us</a></li>
            </ul>
          </div>
         
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p className="flex items-center justify-center">
            Made with <Heart className="h-4 w-4 mx-1 text-red-500" /> by DisasterRelief.AI Team
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;