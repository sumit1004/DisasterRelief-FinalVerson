import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Users, Map, Home, Moon, Sun } from 'lucide-react';

interface NavbarProps {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
}

function Navbar({ isDarkMode, setIsDarkMode }: NavbarProps) {
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <span className="font-bold text-xl dark:text-white">DisasterRelief.com</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className="flex items-center text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400"
            >
              <Home className="h-6 w-6" />
              <span className="ml-2 font-semibold">Home</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-4">
              <Link 
                to="/map" 
                className="text-gray-700 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400 px-3 py-2 rounded-md"
              >
                Disaster Map
              </Link>
              <Link 
                to="/report" 
                className="text-gray-700 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400 px-3 py-2 rounded-md"
              >
                Report Emergency
              </Link>
              
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isDarkMode ? 
                <Sun className="h-6 w-6 text-yellow-500" /> : 
                <Moon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              }
            </button>
            <Link 
              to="/login" 
              className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
            >
              Login/Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;