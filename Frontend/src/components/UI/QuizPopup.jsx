import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const QuizPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Show popup every time website loads
    setShowPopup(true);
  }, []);

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleStartQuiz = () => {
    setShowPopup(false);
    if (!user) {
      navigate('/login'); // Redirect to login if not authenticated
    } else {
      navigate('/gemstone-finder'); // Navigate to the quiz page if logged in
    }
  };

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 relative animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={handleClosePopup}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Content */}
        <div className="text-center">
          <div className="mb-6">
            <svg
              className="w-16 h-16 mx-auto text-purple-600 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Free Quiz Available!
            </h2>
            <p className="text-gray-600 mb-6">
              Discover your perfect gemstones with our personalized quiz. Find out which stones resonate with your energy!
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleClosePopup}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleStartQuiz}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-colors"
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPopup;
