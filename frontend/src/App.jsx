import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LogInPage from './pages/LogInPage';
import SettingsPage from './pages/SettingsPage';
import SignUpPage from './pages/SignUpPage';
import { Button } from './components/ui/button';
import { useAuthStore } from './stores/useAuthStore';
import Navbar from './components/Navbar';

const App = () => {
  const { checkAuth, authUser } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to='/login' />} />
        <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to='/login' />} />
        <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to='/' />} />
        <Route path='/login' element={!authUser ? <LogInPage /> : <Navigate to='/' />} />
        <Route path='/settings' element={<SettingsPage />} />
      </Routes>
    </div>
  );
};

export default App;
