import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Music2 } from 'lucide-react';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-stone-900 fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-[#f2e1c5]">
            <Music2 size={24} />
            <span className="font-bold text-xl">HOVDEN MUSIKKLUBB</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/events" className="text-[#f2e1c5] hover:text-white px-3 py-2 rounded-md">
                Arrangementer
              </Link>
              <Link to="/membership" className="text-[#f2e1c5] hover:text-white px-3 py-2 rounded-md">
                Medlemskap
              </Link>
              <Link to="/gallery" className="text-[#f2e1c5] hover:text-white px-3 py-2 rounded-md">
                Galleri
              </Link>
              <Link to="/contact" className="text-[#f2e1c5] hover:text-white px-3 py-2 rounded-md">
                Kontakt
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/events"
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Arrangementer
            </Link>
            <Link
              to="/membership"
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Medlemskap
            </Link>
            <Link
              to="/gallery"
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Galleri
            </Link>
            <Link
              to="/contact"
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Kontakt
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
} 