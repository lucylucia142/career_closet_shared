import React, { useState } from "react";

const NewsletterBox = () => {
  const [email, setEmail] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleSubscribe = () => {
    if (email.trim()) {
      setShowPopup(true);
      setEmail("");

      // Hide popup after 3 seconds
      setTimeout(() => {
        setShowPopup(false);
      }, 3000);
    }
  };

  return (
    <div className="bg-gray-100 py-16 px-6 text-center">
      {/* Title & Subtitle */}
      <h2 className="text-2xl sm:text-3xl font-bold">
        Subscribe now & get 20% off
      </h2>
      <p className="text-gray-600 mt-2 max-w-lg mx-auto">
       Explore our full range of products, curated for quality, style, and modern elegance.
      </p>

      {/* Email Input & Button */}
      <div className="mt-6 flex justify-center">
        <div className="flex w-full max-w-md">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-2 rounded-l-lg border border-gray-300 focus:outline-none"
          />
          <button
            onClick={handleSubscribe}
            className="px-6 py-2 bg-black text-white rounded-r-lg hover:bg-gray-800 transition"
          >
            Subscribe
          </button>
        </div>
      </div>

      {/* Popup Toast */}
      {showPopup && (
        <div className="fixed top-5 right-5 bg-black text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          Thanks for subscribing 🎉
        </div>
      )}

      {/* Fade In Animation */}
      <style>
        {`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 0.3s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
};

export default NewsletterBox;
