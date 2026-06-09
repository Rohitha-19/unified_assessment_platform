import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { useNavigate } from 'react-router-dom';
import { Menu, LogOut, Moon, Sun } from 'lucide-react';
import { Button } from './UI';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [theme, setTheme] = useTheme();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg" />
            <span className="font-bold text-lg text-white hidden sm:inline">Assessment Platform</span>
          </div>

          {user && (
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <div className="hidden sm:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </Button>
              </div>

              <button
                className="sm:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors"
                onClick={() => setIsOpen(!isOpen)}
              >
                <Menu size={20} className="text-white" />
              </button>
            </div>
          )}
        </div>

        {isOpen && user && (
          <div className="sm:hidden pb-4 space-y-2">
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-white">{user.name}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start"
            >
              <LogOut size={16} />
              Logout
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};
