import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, User, Moon, Sun, Monitor, LogOut, Settings, Menu } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext.jsx';

const Topbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const notifications = [
    { id: 1, text: 'API usage at 80% of monthly limit', time: '2 hours ago', type: 'warning' },
    { id: 2, text: 'New feature: Bulk keyword analysis', time: '1 day ago', type: 'info' },
    { id: 3, text: 'Monthly report ready for download', time: '2 days ago', type: 'success' }
  ];

  const themeOptions = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System', icon: Monitor }
  ];

  const handleThemeChange = (next) => {
    setTheme(next);
    if (typeof pendo !== 'undefined') {
      pendo.track('theme_changed', {
        theme: next,
        source: 'topbar_user_menu'
      });
    }
  };

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </button>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchValue.trim()) {
                  if (typeof pendo !== 'undefined') {
                    pendo.track('search_executed', {
                      query: searchValue.trim().substring(0, 100),
                      searchContext: 'global_topbar'
                    });
                  }
                }
              }}
              placeholder="Search tools, reports, or keywords..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 z-50">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-4 border-b border-slate-100 dark:border-slate-700 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-700">
                      <p className="text-sm text-slate-900 dark:text-slate-100 mb-1">{notification.text}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{notification.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">John Doe</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Pro Plan</p>
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 z-50">
                {/* User header */}
                <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">John Doe</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">john.doe@example.com</p>
                </div>

                {/* Actions */}
                <div className="p-2">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      if (typeof pendo !== 'undefined') {
                        pendo.track('account_settings_opened', {
                          source: 'topbar_user_menu'
                        });
                      }
                      navigate('/account-settings');
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Account Settings</span>
                  </button>
                </div>

                {/* Theme picker */}
                <div className="px-3 pb-3 pt-1 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 px-1 mb-2 mt-2">
                    Theme
                  </p>
                  <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg">
                    {themeOptions.map((opt) => {
                      const Icon = opt.icon;
                      const active = theme === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleThemeChange(opt.id)}
                          aria-pressed={active}
                          className={`flex flex-col items-center justify-center space-y-1 px-2 py-2 rounded-md text-xs font-medium transition-all ${
                            active
                              ? 'bg-white dark:bg-slate-700 text-violet-600 dark:text-violet-300 shadow-sm'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Sign out */}
                <div className="p-2 border-t border-slate-200 dark:border-slate-700">
                  <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
