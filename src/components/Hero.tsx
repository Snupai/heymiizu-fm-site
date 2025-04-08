import React from 'react';
import { Link } from 'react-scroll';
import { scrollConfig } from '../utils/scrollConfig';

const Hero: React.FC = () => {
  return (
    <section id="home" className="h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="text-center text-white">
        <h1 className="text-5xl font-bold mb-4">Welcome to Our Website</h1>
        <p className="text-xl mb-8">Discover amazing content and services</p>
        <Link
          to="about"
          {...scrollConfig}
          className="bg-white text-blue-500 px-6 py-3 rounded-full font-semibold hover:bg-blue-100 transition-colors cursor-pointer"
        >
          Learn More
        </Link>
      </div>
    </section>
  );
};

export default Hero; 