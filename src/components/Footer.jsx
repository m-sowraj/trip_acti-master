import React from 'react';

const Footer = () => (
  <footer className="py-4 px-6 flex justify-between items-center text-sm bg-white">
    <div className="flex items-center">
      <span className="text-teal-600 font-bold mr-2">trip</span>
      <span className="text-gray-600">©2024 All rights Reserved</span>
    </div>
    <div className="flex gap-4 text-gray-600">
      <a href="#" className="hover:text-gray-800">Terms & Conditions</a>
      <a href="#" className="hover:text-gray-800">Privacy Policy</a>
      <a href="#" className="hover:text-gray-800">Support</a>
      <a href="#" className="hover:text-gray-800">Contact</a>
    </div>
  </footer>
);

export default Footer;