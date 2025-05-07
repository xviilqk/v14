"use client";
import { useState } from 'react';
import Image from 'next/image';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your login logic here
    console.log('Logging in with:', { username, password });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="mb-8">
        <Image
          src="/images/WhelpsLogo.png"
          alt="WHELPS Logo"
          width={120}
          height={120}
          className="mx-auto"
        />
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-myOrage rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center text-white mb-6">Log In</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              id="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-white bg-opacity-20 placeholder-white text-white focus:outline-none focus:border-white focus:bg-opacity-30 rounded-md"
              required
            />
          </div>

          <div className="mt-6">
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white bg-opacity-20 placeholder-white text-white focus:outline-none focus:border-white focus:bg-opacity-30 rounded-md"
              required
            />
          </div>

          <button
            type="submit"
            className="mx-auto bg-white text-myOrage py-1 px-16 rounded-2xl hover:bg-opacity-90 transition duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 mt-8 font-medium text-lg block"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}