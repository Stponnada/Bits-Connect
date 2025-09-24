
import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-bits-dark p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-bits-red">BITS Connect</h1>
            <p className="text-bits-text-muted mt-2">The exclusive social network for BITSians.</p>
        </div>

        <div className="bg-bits-light-dark rounded-xl shadow-lg p-8">
          {isLogin ? <LoginForm /> : <SignUpForm />}

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-bits-red hover:underline"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
