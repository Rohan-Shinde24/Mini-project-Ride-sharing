import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, ChevronDown } from 'lucide-react';
import Button from '../ui/Button';
import { cn } from '../../utils/cn';

import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = user ? [
    { name: 'Find a Ride', path: '/rides' },
    { name: 'Offer a Ride', path: '/create-ride' },
    { name: 'My Rides', path: '/my-rides' },
    { name: 'Profile', path: '/profile' },
    ...(user.role === 'admin' ? [{ name: 'Admin', path: '/admin' }] : [])
  ] : [];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={cn(
      "bg-white text-slate-900 sticky top-0 z-50 transition-all duration-300",
      scrolled ? "shadow-md" : "border-b border-slate-200"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <img 
                src="/assets/logo.png" 
                alt="RideShare Connect Logo" 
                className="h-10 w-10 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg" 
              />
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent group-hover:from-emerald-500 group-hover:to-emerald-700 transition-all duration-300">
                Rideshare 
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105",
                    isActive(link.path)
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Auth Buttons (Desktop) */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link 
                    to="/dashboard" 
                    className="text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center transition-all duration-300 hover:scale-105 px-3 py-2 rounded-lg hover:bg-slate-100"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={logout} 
                    className="text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all duration-300 transform hover:scale-105"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link to="/login">
                    <Button 
                      variant="ghost" 
                      className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-300 transform hover:scale-105"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button 
                      variant="primary" 
                      className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 transform hover:scale-105"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none transition-all duration-300 transform hover:scale-110"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "md:hidden bg-white border-t border-slate-200 overflow-hidden transition-all duration-300 ease-in-out",
        isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 transform hover:translate-x-2",
                isActive(link.path)
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              {link.name}
            </Link>
          ))}
          {user ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all duration-300 transform hover:translate-x-2"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all duration-300 transform hover:translate-x-2"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="mt-4 flex flex-col space-y-2 px-3">
              <Link to="/login" onClick={() => setIsOpen(false)}>
                <Button variant="secondary" className="w-full justify-center transition-all duration-300 transform hover:scale-105">Login</Button>
              </Link>
              <Link to="/register" onClick={() => setIsOpen(false)}>
                <Button variant="primary" className="w-full justify-center bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-300 transform hover:scale-105">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
