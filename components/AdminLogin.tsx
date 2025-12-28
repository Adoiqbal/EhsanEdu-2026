import React, { useState } from 'react';
import { Lock, ShieldCheck } from 'lucide-react';

interface AdminLoginProps {
  onSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Ehsan2026') {
      onSuccess();
      setError(false);
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)] animate-fade-in">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 w-full max-w-md text-center">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-blue-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Admin Access Required</h2>
        <p className="text-slate-500 mb-8 leading-relaxed">
          This area is restricted to school administrators. <br/>
          Please enter your secure password to continue.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                Password
              </label>
              <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-4 outline-none transition-all font-medium
                    ${error 
                      ? 'border-red-300 focus:ring-red-100 bg-red-50 text-red-900 placeholder-red-300' 
                      : 'border-slate-200 focus:ring-blue-100 focus:border-blue-400 bg-slate-50 text-slate-900'
                    }
                  `}
                  autoFocus
              />
              {error && (
                <p className="text-red-500 text-sm mt-2 font-medium flex items-center gap-1 animate-pulse">
                   Invalid password. Please try again.
                </p>
              )}
            </div>
            
            <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-blue-200 mt-2 flex items-center justify-center gap-2"
            >
                <ShieldCheck className="w-5 h-5" />
                Authenticate
            </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-slate-100">
          <p className="text-xs text-slate-400">
            Authorized personnel only. <br/>
            Contact IT support if you have lost your credentials.
          </p>
        </div>
      </div>
    </div>
  );
};