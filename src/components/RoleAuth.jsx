import React, { useState } from 'react';
import { LockKeyhole, LogIn, Sprout, Store, UserPlus } from 'lucide-react';

const demoUsers = {
  farmer: { username: 'farmer', password: 'farmer123' },
  merchant: { username: 'merchant', password: 'merchant123' },
};

const roleDetails = {
  farmer: {
    title: 'Farmer Login',
    subtitle: 'किसान केंद्र में प्रवेश करें',
    icon: Sprout,
    color: 'emerald',
  },
  merchant: {
    title: 'Merchant Login',
    subtitle: 'व्यापारी केंद्र में प्रवेश करें',
    icon: Store,
    color: 'amber',
  },
};

function getRegisteredUsers() {
  try {
    return JSON.parse(localStorage.getItem('kisan-setu-users') || '[]');
  } catch {
    return [];
  }
}

export function RoleAuth({ role, onAuthenticated }) {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const details = roleDetails[role];
  const Icon = details.icon;

  const submit = (event) => {
    event.preventDefault();
    const cleanUsername = username.trim();
    const registeredUser = getRegisteredUsers().find(
      (user) => user.role === role && user.username === cleanUsername && user.password === password,
    );
    const demoUser = demoUsers[role];

    if (mode === 'login') {
      if ((cleanUsername === demoUser.username && password === demoUser.password) || registeredUser) {
        onAuthenticated({ role, username: cleanUsername });
        return;
      }
      setMessage('Username or password is incorrect.');
      return;
    }

    if (!cleanUsername || !password) {
      setMessage('Enter a username and password to register.');
      return;
    }

    const users = getRegisteredUsers();
    if (users.some((user) => user.role === role && user.username === cleanUsername)) {
      setMessage('This username is already registered.');
      return;
    }

    localStorage.setItem(
      'kisan-setu-users',
      JSON.stringify([...users, { role, username: cleanUsername, password }]),
    );
    onAuthenticated({ role, username: cleanUsername });
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-[36px] p-6 sm:p-8 shadow-xl border-b-8 border-emerald-200">
      <div className="flex items-center gap-3 mb-6">
        <div className={`${details.color === 'amber' ? 'bg-amber-400 text-amber-950' : 'bg-emerald-600 text-white'} w-12 h-12 rounded-2xl flex items-center justify-center shadow-md`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-emerald-950">{details.title}</h1>
          <p className="text-sm font-semibold text-emerald-700">{details.subtitle}</p>
        </div>
      </div>

      <div className="flex gap-2 mb-5">
        <button type="button" onClick={() => { setMode('login'); setMessage(''); }} className={`flex-1 py-2.5 rounded-2xl text-sm font-black flex items-center justify-center gap-2 ${mode === 'login' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-900'}`}>
          <LogIn className="w-4 h-4" /> Login
        </button>
        <button type="button" onClick={() => { setMode('register'); setMessage(''); }} className={`flex-1 py-2.5 rounded-2xl text-sm font-black flex items-center justify-center gap-2 ${mode === 'register' ? 'bg-amber-400 text-amber-950' : 'bg-amber-50 text-amber-900'}`}>
          <UserPlus className="w-4 h-4" /> Register
        </button>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <label className="block text-xs font-black text-emerald-950">
          Username
          <input value={username} onChange={(event) => setUsername(event.target.value)} className="mt-1 w-full rounded-2xl border-2 border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm font-bold focus:outline-none focus:border-emerald-500" autoComplete="username" />
        </label>
        <label className="block text-xs font-black text-emerald-950">
          Password
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1 w-full rounded-2xl border-2 border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm font-bold focus:outline-none focus:border-emerald-500" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
        </label>

        {mode === 'login' && (
          <p className="rounded-2xl bg-sky-50 border border-sky-200 px-3 py-2 text-xs font-bold text-sky-900">
            Demo: <strong>{demoUsers[role].username}</strong> / <strong>{demoUsers[role].password}</strong>
          </p>
        )}
        {message && <p className="text-xs font-bold text-rose-700">{message}</p>}

        <button type="submit" className={`${mode === 'register' ? 'bg-amber-400 text-amber-950 border-amber-600' : 'bg-emerald-600 text-white border-emerald-800'} w-full rounded-2xl border-b-4 px-4 py-3 font-black shadow-md flex items-center justify-center gap-2`}>
          {mode === 'register' ? <UserPlus className="w-4 h-4" /> : <LockKeyhole className="w-4 h-4" />}
          {mode === 'register' ? 'Create Account' : `Login as ${role}`}
        </button>
      </form>
    </div>
  );
}
