"use client";

import { useState } from 'react';
import { Menu, X, Cake } from 'lucide-react';
import Link from "next/link";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: 'Accueil', href: '/home' },
    { name: 'Nos Produits', href: '/products' },
    { name: 'Réservation', href: '/reservation' },
    { name: 'Contact', href: '/contact' },
    { name: 'Admin', href: '/admin' }
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Cake className="h-8 w-8 text-amber-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Artisan Pâtisserie</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`${
                  location.pathname === item.href
                    ? 'text-amber-600'
                    : 'text-gray-600 hover:text-amber-600'
                } px-3 py-2 rounded-md text-sm font-medium transition-colors`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500"
            >
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`${
                  location.pathname === item.href
                    ? 'bg-amber-50 text-amber-600'
                    : 'text-gray-600 hover:bg-amber-50 hover:text-amber-600'
                } block px-3 py-2 rounded-md text-base font-medium transition-colors`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;