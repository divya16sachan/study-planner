import React, { useEffect } from "react";
import { Play, RotateCcw, Pause } from "lucide-react";
import { PomodoroSetting } from "./PomodoroSetting";
import { usePomodoroStore } from "@/stores/pomodoroStore";

const Pomodoro = ({className}) => {
  const {
    remainingTime,
    isRunning,
    startTimer,
    stopTimer,
    resetTimer,
    currentSession,
    manualSwitchSession,
    currentTheme,
    completedPomodoros,
    usePomodoroSequence,
    initTimer,
  } = usePomodoroStore();

  // Initialize timer on mount
  useEffect(() => {
    initTimer();

    // Cleanup on unmount
    return () => {
      stopTimer();
    };
  }, [initTimer, stopTimer]);

  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (secs % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const toggleTimer = () => {
    isRunning ? stopTimer() : startTimer();
  };

  return (
    <div className={`p-8 overflow-hidden relative rounded-xl flex flex-col items-center justify-center ${className}`}>
      <div className="absolute z-10 inset-0 bg-black/40" />
      <img
        className="inset z-0 absolute w-full h-full object-cover"
        src={currentTheme}
        alt="backdrop"
      />

      <div className="relative z-20 flex flex-col gap-6 items-center">
        {/* Session Selector */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-2">
            {["pomodoro", "shortBreak", "longBreak"].map((session) => (
              <button
                key={session}
                onClick={() => manualSwitchSession(session)}
                className={`h-8 whitespace-nowrap ${
                  currentSession === session
                    ? "bg-white text-black"
                    : "bg-transparent border border-white text-white"
                } flex items-center justify-center gap-2 rounded-full font-semibold px-4 hover:brightness-75 transition-all`}
              >
                {session === "pomodoro"
                  ? "Pomodoro"
                  : session === "shortBreak"
                  ? "Short Break"
                  : "Long Break"}
              </button>
            ))}
          </div>

          {/* Progress Dots */}
          {currentSession === "pomodoro" && usePomodoroSequence && (
            <div className="flex gap-1 mt-1">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i < completedPomodoros % 4 ? "bg-white" : "bg-white/30"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Timer Display */}
        <div className="text-6xl text-white font-bold text-shadow-md">
          {formatTime(remainingTime)}
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <button
            onClick={toggleTimer}
            className="bg-white hover:brightness-75 transition-all rounded-full text-black h-10 shadow-md w-24 font-semibold flex items-center justify-center gap-2"
          >
            {isRunning ? (
              <Pause className="size-5" />
            ) : (
              <Play className="size-5" />
            )}
            {isRunning ? "Pause" : "Start"}
          </button>

          <button
            onClick={resetTimer}
            className="bg-white hover:brightness-75 transition-all rounded-full text-black size-10 shadow-md grid place-items-center"
          >
            <RotateCcw className="size-5" />
          </button>

          <PomodoroSetting />
        </div>
      </div>
    </div>
  );
};

export default Pomodoro;
