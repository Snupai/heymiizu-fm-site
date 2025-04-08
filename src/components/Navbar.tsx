import React, { useState, useEffect } from 'react';
import { Link } from 'react-scroll';
import { scrollConfig } from '../utils/scrollConfig';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold">Logo</div>
          <div className="hidden md:flex space-x-8">
            <Link
              to="home"
              {...scrollConfig}
              className="cursor-pointer hover:text-blue-500 transition-colors"
            >
              Home
            </Link>
            <Link
              to="about"
              {...scrollConfig}
              className="cursor-pointer hover:text-blue-500 transition-colors"
            >
              About
            </Link>
            <Link
              to="services"
              {...scrollConfig}
              className="cursor-pointer hover:text-blue-500 transition-colors"
            >
              Services
            </Link>
            <Link
              to="contact"
              {...scrollConfig}
              className="cursor-pointer hover:text-blue-500 transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 