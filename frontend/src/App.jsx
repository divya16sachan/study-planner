import React, { useEffect } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Navbar from "./components/Navbar";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { useAuthStore } from "./stores/authStore";
import { Loader } from "lucide-react";
import WeeklyTaskPage from "./pages/WeeklyTaskPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import { TooltipProvider } from "@radix-ui/react-tooltip";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (!authUser && isCheckingAuth) {
    return (
      <div className="flex gap-2 items-center justify-center h-screen">
        <Loader className="animate-spin" />
        <p className="text-center">Study Planner</p>
      </div>
    )
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>

        <Toaster />
          <Navbar />
          <div>
            <Routes>
              <Route path="/" element={authUser ? <HomePage /> : <Navigate to='/login' />} />
              <Route path="/weekly-task" element={authUser || true ? <WeeklyTaskPage /> : <Navigate to='/login' />} />
              <Route path="/forgot-password" element={authUser || true ? <ForgotPasswordPage /> : <Navigate to='/login' />} />
              <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to='/' />} />
              <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to='/' />} />
            </Routes>
          </div>
      </TooltipProvider>
    </ThemeProvider>
  );
};

export default App;
