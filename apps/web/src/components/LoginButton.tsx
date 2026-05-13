"use client";

import { signIn } from 'next-auth/react';

export default function LoginButton() {
  return (
    <button 
      className="cursor-pointer mt-4 bg-slate-800 text-white px-6 py-3 rounded-lg"
      onClick={() => signIn('github', { callbackUrl: '/' })}
    >
      Sign in with Github
    </button>
  )
};