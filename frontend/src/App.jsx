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

const App = () => {
  const {authUser, checkAuth, isCheckingAuth} = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      const { checkAuth } = useAuthStore.getState();
      await checkAuth();
    };
    checkAuth();
  }, []);

  if(!authUser && isCheckingAuth) {
    return (
      <div className="flex gap-2 items-center justify-center h-screen">
        <Loader className="animate-spin"/>
        <p className="text-center">Study Planner</p>
      </div>
    )
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Toaster/>
        <Navbar />
      <div>
        <Routes>
          <Route path="/" element={authUser? <HomePage/> : <Navigate to='/login'/> }  />
          <Route path="/login" element={!authUser? <LoginPage /> : <Navigate to='/' /> } />
          <Route path="/signup" element={!authUser? <SignupPage /> : <Navigate to='/' /> } />
        </Routes>
      </div>
    </ThemeProvider>
  );
};

export default App;
