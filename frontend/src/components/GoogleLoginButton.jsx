import React from 'react';
import { GoogleLogin, useGoogleOneTapLogin } from '@react-oauth/google';
import { useAuthStore } from '@/stores/authStore.js';
import { jwtDecode } from 'jwt-decode';

const GoogleLoginButton = ({ className }) => {
  const { googleLogin, isLoggingIn } = useAuthStore();

  // Trigger One Tap on component mount
  useGoogleOneTapLogin({
    onSuccess: credentialResponse => {
      const user = jwtDecode(credentialResponse?.credential);
      if (user?.email) {
        googleLogin(user);
      }
    },
    onError: () => {
      console.log('One Tap Login Failed');
    },
  });

  return (
    <div className={`w-full flex justify-center ${className}`}>
      <GoogleLogin
        onSuccess={credentialResponse => {
          const user = jwtDecode(credentialResponse?.credential);
          if (user?.email) {
            googleLogin(user);
          }
        }}
        onError={() => {
          console.log('Login Failed');
        }}
        auto_select={true}
      />
    </div>
  );
};

export default GoogleLoginButton;
