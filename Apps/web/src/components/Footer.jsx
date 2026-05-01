import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, MessageCircle, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

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
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 mt-0.5 text-primary flex-shrink-0" />
                <span className="text-sm text-secondary-foreground/80">Mumbai, Maharashtra, India</span>
              </li>
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
              <a href="#" className="w-10 h-10 rounded-lg bg-secondary-foreground/5 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-200">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://instagram.com/inayat_royale" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-secondary-foreground/5 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-200">
                <Instagram className="w-5 h-5" />
              </a>

              <a href="#" className="w-10 h-10 rounded-lg bg-secondary-foreground/5 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-200">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
            <a
              href="https://wa.me/919814589421"

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
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-secondary-foreground/60">
              © {currentYear} Inayat Royale. All rights reserved.
            </p>
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
    </footer>
  );
};

export default Footer;