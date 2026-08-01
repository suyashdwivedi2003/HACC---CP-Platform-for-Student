import React from 'react';
import { Link, useLocation } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  
  return (
    <footer className={`bg-gray-900 text-white ${location.pathname==='/signup'} ? 'mt-10':'mt-20' `}>
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {/* Company Info */}
          <div className="flex flex-col">
            <h3 className="text-2xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">HACC</span>
            </h3>
            <p className="text-gray-400 mb-6">CP platform for college Students</p>
          </div>
          
          {/* Quick Links */}
          <div className="flex flex-col">
            <h3 className="text-2xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Quick Links</span>
            </h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/team" className="text-gray-400 hover:text-white transition-colors">Team</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/blogs" className="text-gray-400 hover:text-white transition-colors">Blogs</Link></li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div className="flex flex-col">
            <h3 className="text-2xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Contact Us</span>
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <MapPin size={20} className="text-gray-400 mr-3" />
                <span className="text-gray-400">Hostel-H, NIT Raipur, Chhattisgarh, India</span>
              </div>
              <div className="flex items-center">
                <Mail size={20} className="text-gray-400 mr-3" />
                <a href="https://mail.google.com/mail/?view=cm&to=dipteshraj2003@gmail.com" className="text-gray-400 hover:text-white transition-colors">dipteshraj2003@gmail.com</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Copyright Bar */}
      <div className="bg-gray-950 py-4">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© {currentYear} HACC. All rights reserved.</p>
          <div className="mt-2 md:mt-0">
            <p className="text-gray-400 text-sm">Made with <span class="beating-heart text-red-500 text-1xl">❤️</span> in NIT Raipur</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;