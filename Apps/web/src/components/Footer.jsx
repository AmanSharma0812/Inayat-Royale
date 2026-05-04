import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, MessageCircle, Mail, Phone, Lock, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import ConfirmDialog from './ConfirmDialog';
import { WHATSAPP_NUMBER } from '@/config/seo';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { isAuthenticated, logout } = useAuth();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    setIsLogoutDialogOpen(false);
  };

  return (
    <footer className="bg-secondary text-secondary-foreground border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src="/logo.png" 
                alt="Inayat Royale Logo" 
                className="h-12 w-auto object-contain rounded-sm"
              />
              <span className="text-xl font-bold font-serif">Inayat Royale</span>
            </div>
            <p className="text-sm text-secondary-foreground/80 leading-relaxed max-w-none">
              Where Every Sparkle Tells a Royal Story. Discover exquisite handcrafted jewellery with Inayat Royale.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 font-serif text-primary">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors duration-200">
                  Collections
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors duration-200">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 font-serif text-primary">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm text-secondary-foreground/80">+91 98145 89421</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm text-secondary-foreground/80">royaleinayat@gmail.com</span>
              </li>

            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 font-serif text-primary">Connect With Us</h3>
            <div className="flex space-x-4 mb-6">
              <a href="https://instagram.com/inayat_royale" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-secondary-foreground/5 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-200">
                <Instagram className="w-5 h-5" />
              </a>

            </div>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#25D366] text-white rounded-lg hover:bg-[#20BA5A] transition-all duration-200 shadow-lg shadow-[#25D366]/20"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium">WhatsApp Us</span>
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-secondary-foreground/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
              <p className="text-sm text-secondary-foreground/60">
                © {currentYear} Inayat Royale. All rights reserved.
              </p>
              <div className="flex items-center gap-4">
                <Link 
                  to="/admin" 
                  className="text-xs text-secondary-foreground/40 hover:text-primary flex items-center gap-1.5 transition-colors duration-200"
                >
                  <Lock className="w-3 h-3" />
                  Admin Panel
                </Link>
                {isAuthenticated && (
                  <button 
                    onClick={() => setIsLogoutDialogOpen(true)}
                    className="text-xs text-red-500/60 hover:text-red-500 flex items-center gap-1.5 transition-colors duration-200"
                  >
                    <LogOut className="w-3 h-3" />
                    Logout
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2">
              <Link to="/shipping-policy" className="text-sm text-secondary-foreground/60 hover:text-primary transition-colors duration-200">
                Shipping Policy
              </Link>
              <Link to="/return-policy" className="text-sm text-secondary-foreground/60 hover:text-primary transition-colors duration-200">
                Return Policy
              </Link>
              <Link to="/privacy-policy" className="text-sm text-secondary-foreground/60 hover:text-primary transition-colors duration-200">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <ConfirmDialog
        isOpen={isLogoutDialogOpen}
        onClose={() => setIsLogoutDialogOpen(false)}
        onConfirm={handleLogout}
        title="Logout Confirmation"
        description="Are you sure you want to log out of your admin account?"
        confirmText="Logout"
        variant="destructive"
      />
    </footer>
  );
};

export default Footer;