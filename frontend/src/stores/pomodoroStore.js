import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";

export const usePomodoroStore = create(
  persist(
    (set, get) => ({
      // Timer settings
      pomodoro: 25 * 60,
      shortBreak: 5 * 60,
      longBreak: 15 * 60,

      // Session state (always starts with these defaults)
      currentSession: "pomodoro",
      isRunning: false, // Always false initially
      remainingTime: 25 * 60,
      sessionStartTime: 0,
      timer: null,
      completedPomodoros: 0,
      currentTheme: "background/gradient-dark.jpg",
      currentSound: "/sounds/bell.mp3",

      // Initialize timer (call this when app loads)
      initTimer: () => {
        const {
          isRunning,
          sessionStartTime,
          remainingTime,
          getCurrentDuration,
        } = get();

        // If timer was running when page was closed
        if (isRunning && sessionStartTime > 0) {
          const elapsedSeconds = Math.floor(
            (Date.now() - sessionStartTime) / 1000
          );
          const newRemaining = Math.max(0, remainingTime - elapsedSeconds);

          set({
            remainingTime: newRemaining,
            isRunning: false, // Force stopped state on refresh
            sessionStartTime: 0,
          });

          if (newRemaining <= 0) {
            get().handleSessionComplete();
          }
        }
      },

      resetAll: () => {
        // Clear any active timer first
        clearInterval(get().timer);

        // Reset to default values
        set({
          pomodoro: 25 * 60,
          shortBreak: 5 * 60,
          longBreak: 15 * 60,
          currentSession: "pomodoro",
          currentTheme: "background/gradient-dark.jpg",
          currentSound: "/sounds/bell.mp3",
          currentSoundVolume: 50,
          shouldPlaySound: true,
          isRunning: false,
          usePomodoroSequence: true,
          remainingTime: 25 * 60,
          timer: null,
          completedPomodoros: 0,
          sessionStartTime: 0,
        });

        // Optional: Notify user
        toast.success("All settings reset to defaults");
      },

      // Play sound helper
      playSound: () => {
        const { currentSound, currentSoundVolume, shouldPlaySound } = get();
        if (!shouldPlaySound || !currentSound) return;

        try {
          const audio = new Audio(currentSound);
          audio.volume = Math.min(1, Math.max(0, currentSoundVolume / 100));
          audio.play().catch((e) => console.error("Audio play error:", e));
        } catch (e) {
          console.error("Audio initialization failed:", e);
        }
      },

      // Start timer
      startTimer: () => {
        if (get().isRunning) return;

        set({
          isRunning: true,
          sessionStartTime:
            Date.now() -
            (get().getCurrentDuration() - get().remainingTime) * 1000,
        });

        const timer = setInterval(() => {
          const { sessionStartTime, getCurrentDuration } = get();
          const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
          const remaining = Math.max(0, getCurrentDuration() - elapsed);

          set({ remainingTime: remaining });

          if (remaining <= 0) {
            clearInterval(timer);
            get().handleSessionComplete();
          }
        }, 1000);

        set({ timer });
      },

      // Stop timer
      stopTimer: () => {
        clearInterval(get().timer);
        set({
          isRunning: false,
          sessionStartTime: 0,
          timer: null,
        });
      },

      // Reset timer
      resetTimer: () => {
        get().stopTimer();
        set({
          remainingTime: get().getCurrentDuration(),
          sessionStartTime: 0,
        });
      },

      // Session completion handler
      handleSessionComplete: () => {
        const { currentSession, completedPomodoros, usePomodoroSequence } =
          get();

        get().playSound();
        toast.success("Session completed!");

        const newPomodoroCount =
          currentSession === "pomodoro"
            ? completedPomodoros + 1
            : completedPomodoros;

        let nextSession = "pomodoro";
        if (currentSession === "pomodoro") {
          nextSession =
            usePomodoroSequence && newPomodoroCount % 4 === 0
              ? "longBreak"
              : "shortBreak";
        }

        const nextDuration = get().getCurrentDuration(nextSession);

        set({
          isRunning: false,
          timer: null,
          completedPomodoros: newPomodoroCount,
          currentSession: nextSession,
          remainingTime: nextDuration,
          sessionStartTime: 0,
        });
      },

      // Manual session switch
      manualSwitchSession: (sessionType) => {
        get().stopTimer();
        set({
          currentSession: sessionType,
          remainingTime: get().getCurrentDuration(sessionType),
          isRunning: false,
          lastUpdateTimestamp: 0,
        });
      },

      // Get current duration
      getCurrentDuration: (sessionType = null) => {
        const { currentSession, pomodoro, shortBreak, longBreak } = get();
        const session = sessionType || currentSession;
        return session === "pomodoro"
          ? pomodoro
          : session === "shortBreak"
          ? shortBreak
          : longBreak;
      },

      setCurrentTheme: (theme) => set({ currentTheme: theme }),
      setCurrentSound: (sound) => set({ currentSound: sound }),
      setCurrentSoundVolume: (volume) => set({ currentSoundVolume: volume }),
      setShouldPlaySound: (value) => set({ shouldPlaySound: value }),
      setPomodoro: (value) => set({ pomodoro: value }),
      setShortBreak: (value) => set({ shortBreak: value }),
      setLongBreak: (value) => set({ longBreak: value }),
      setUsePomodoroSequence: (value) => set({ usePomodoroSequence: value }),
    }),
    {
      name: "pomodoro-storage",
      partialize: (state) => {
        const { timer, ...rest } = state;
        return rest;
      },
    }
  )
);
