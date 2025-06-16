import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-automotive-gray dark:bg-automotive-darkBlue text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <img src="/lovable-uploads/ba58edb5-dff5-4ea5-bd20-8b0c24778236.png" alt="CarWhisperer Market Logo" className="h-18 w-18 mr-2" />
            </div>
            <p className="text-gray-300 mb-4">Your trusted marketplace for quality automotive parts and vehicles.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-display font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/parts" className="text-gray-300 hover:text-white transition-colors">Browse Parts</Link></li>
              <li><Link to="/cars" className="text-gray-300 hover:text-white transition-colors">Browse Cars</Link></li>
              <li><Link to="/sell" className="text-gray-300 hover:text-white transition-colors">Sell Items</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-display font-semibold mb-4">Customer Support</h4>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="text-gray-300 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/shipping" className="text-gray-300 hover:text-white transition-colors">Shipping Info</Link></li>
              <li><Link to="/returns" className="text-gray-300 hover:text-white transition-colors">Returns Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-display font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-start">
                <Mail size={18} className="mr-2 mt-1 text-gray-400" />
                <span className="text-gray-300">torqueup.contact@gmail.com</span>
              </div>
              <div className="flex items-start">
                <Phone size={18} className="mr-2 mt-1 text-gray-400" />
                <span className="text-gray-300">+213 788 95 56 52</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">© 2025 CarWhisperer Market. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
