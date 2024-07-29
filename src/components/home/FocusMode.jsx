import React, { useState, useEffect } from 'react';

const FocusMode = ({ isOpen, onClose }) => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let timer;
    if (isActive) {
      timer = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setIsActive(false);
            clearInterval(timer);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive, seconds, minutes]);

  const handleStart = () => {
    setIsActive(true);
  };

  const handleReset = () => {
    setIsActive(false);
    setMinutes(25);
    setSeconds(0);
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center">
        <div className="bg-gray-800 p-6 rounded-lg text-gray-100 w-3/4 sm:w-1/2 md:w-1/4">
          <h2 className="text-xl font-bold mb-4">Focus Mode</h2>
          <div className="text-4xl mb-4">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
          <input
            type="number"
            min="1"
            max="120"
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
            className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
          />
          <button
            onClick={handleStart}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Start
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 ml-4"
          >
            Reset
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 mt-4"
          >
            Close
          </button>
        </div>
      </div>
    )
  );
};

export default FocusMode;
