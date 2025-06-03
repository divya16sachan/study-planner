import React from 'react';
import { GoogleLogin, useGoogleOneTapLogin } from '@react-oauth/google';
import { useAuthStore } from '@/stores/authStore.js';

const GoogleLoginButton = ({ className }) => {
  const { googleLogin, isLoggingIn } = useAuthStore();

  // Trigger One Tap on component mount
  useGoogleOneTapLogin({
    onSuccess: credentialResponse => {
      const token = credentialResponse?.credential;
      if (token) {
        googleLogin({ token }); // ✅ send token
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
          const token = credentialResponse?.credential;
          if (token) {
            googleLogin({ token }); // ✅ send token
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
