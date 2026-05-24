"use client";

import { signIn } from 'next-auth/react';
import React from 'react';

export default function LoginButton() {
  const [isLoading, setIsLoading] = React.useState(false);
  return (
    <>
      <button 
        className="cursor-pointer mt-4 bg-slate-800 text-white px-6 py-3 rounded-lg"
        onClick={async () => {
          setIsLoading(true);
          await signIn('github', { callbackUrl: '/' });
          setIsLoading(false);
        }}
      >
        Sign in with Github
      </button>
      {isLoading && <span>Loading...</span>}
    </>
  )
};