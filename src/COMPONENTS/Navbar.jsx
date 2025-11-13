import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {
  const { getCartCount, user, logout, setShowSearch } = useContext(ShopContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Collections', path: '/collection' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 w-full">
      <div className="flex justify-between items-center w-full py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center px-4">
          <img src="./public/logo.png" alt="Shop Logo" className="h-10" />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 px-4">
          {navLinks.map(link => (
            <Link
              key={link.name}
              to={link.path}
              className="relative text-gray-700 hover:text-black transition-colors duration-200
                after:content-[''] after:block after:w-0 after:h-[2px] after:bg-[#001f3f]
                after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4 px-4">
          {/* Search Icon */}
          <img
            src="/search.png"
            alt="Search"
            className="w-6 h-6 cursor-pointer"
            onClick={() => setShowSearch(prev => !prev)}
          />

          {/* Cart */}
          <Link to="/cart" className="relative text-gray-700 hover:text-black transition-colors duration-200">
            <img src="/cart.png" alt="Cart" className="w-6 h-6" />
            {getCartCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {getCartCount()}
              </span>
            )}
          </Link>

          {/* User Profile */}
          {user ? (
            <div className="relative group">
              <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold cursor-pointer">
                {user.userName ? user.userName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg
                opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200">
                <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Orders
                </Link>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="text-gray-700 hover:text-black transition-colors duration-200">
              <img src="/user.png" alt="Login" className="w-6 h-6" />
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden px-4">
          <button
            className="text-gray-700 hover:text-black focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={
                  isMobileMenuOpen
                    ? 'M6 18L18 6M6 6l12 12'
                    : 'M4 6h16M4 12h16m-7 6h7'
                }
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          {navLinks.map(link => (
            <Link
              key={link.name}
              to={link.path}
              className="block text-gray-700 hover:text-black px-4 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          {user ? (
            <>
              <Link
                to="/orders"
                className="block text-gray-700 hover:text-black px-4 py-2"
              >
                Orders
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left text-gray-700 hover:text-black px-4 py-2"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="block text-gray-700 hover:text-black px-4 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
