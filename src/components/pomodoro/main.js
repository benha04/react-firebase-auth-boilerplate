// src/components/pomodoro/index.jsx
import React, { useState, useContext, useEffect } from 'react';
import Timer from "./Timer";
import Settings from "./Settings";
import SettingsContext from "./SettingsContext";
import './App.css'; // Import custom CSS for styling

export const CustomPomodoro = () => {
  return (
    <div className="pomodoro-container">
      <PomodoroProvider />
    </div>
  );
};

const PomodoroProvider = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [workMinutes, setWorkMinutes] = useState(45);
  const [breakMinutes, setBreakMinutes] = useState(15);

  return (
    <SettingsContext.Provider value={{
      showSettings,
      setShowSettings,
      workMinutes,
      breakMinutes,
      setWorkMinutes,
      setBreakMinutes,
    }}>
      {showSettings ? <Settings /> : <Timer />}
    </SettingsContext.Provider>
  );
};
