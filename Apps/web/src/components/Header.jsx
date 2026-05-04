import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, Heart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCurrency, CURRENCIES } from '@/contexts/CurrencyContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const { wishlist } = useWishlist();
  const { currency, changeCurrency } = useCurrency();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Bridal', path: '/bridal-consultation' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/logo.png" 
              alt="Inayat Royale Logo" 
              className="h-16 w-auto object-contain"
            />
            <span className="text-2xl font-bold font-serif text-foreground hidden sm:block">Inayat Royale</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-base font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'text-primary font-semibold'
                    : 'text-foreground hover:text-primary'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/wishlist"
              className={`relative p-2 rounded-full transition-colors ${
                isActive('/wishlist') ? 'text-primary bg-primary/10' : 'text-foreground hover:bg-muted'
              }`}
            >
              <Heart className={`w-6 h-6 ${isActive('/wishlist') ? 'fill-current' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-background">
                  {wishlist.length}
                </span>
              )}
            </Link>
            
            <div className="w-24">
              <Select value={currency.code} onValueChange={changeCurrency}>
                <SelectTrigger className="h-9 text-xs border-primary/20 bg-transparent">
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(CURRENCIES).map((curr) => (
                    <SelectItem key={curr.code} value={curr.code} className="text-xs">
                      {curr.code} ({curr.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <ThemeToggle />
          </nav>

          <div className="flex items-center space-x-2 md:hidden">
            <Link
              to="/wishlist"
              className={`relative p-2 rounded-full transition-colors ${
                isActive('/wishlist') ? 'text-primary bg-primary/10' : 'text-foreground hover:bg-muted'
              }`}
            >
              <Heart className={`w-5 h-5 ${isActive('/wishlist') ? 'fill-current' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-background">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <ThemeToggle />
            <button
              className="p-2 rounded-lg hover:bg-muted transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border bg-background">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-base font-medium transition-colors duration-200 ${
                    isActive(link.path)
                      ? 'text-primary font-semibold'
                      : 'text-foreground hover:text-primary'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="pt-4 border-t border-border">
                <p className="text-xs font-semibold text-muted-foreground mb-3 px-1 uppercase tracking-wider">Select Currency</p>
                <div className="grid grid-cols-3 gap-2">
                  {Object.values(CURRENCIES).map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => {
                        changeCurrency(curr.code);
                        setIsMenuOpen(false);
                      }}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                        currency.code === curr.code 
                          ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                          : 'bg-muted text-foreground hover:bg-muted/80'
                      }`}
                    >
                      {curr.code}
                    </button>
                  ))}
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;