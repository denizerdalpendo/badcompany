import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, User, Moon, Sun, Monitor, LogOut, Settings, Menu, CornerDownLeft } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext.jsx';
import { useAuth } from '../auth/AuthContext.jsx';
import { searchItems } from '../search/searchIndex.js';

const Topbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const displayName =
    user?.user_metadata?.full_name ||
    (user?.email ? user.email.split('@')[0] : 'Account');
  const displayEmail = user?.email || '';
  const displayAccount = user?.user_metadata?.account || '';
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const searchWrapRef = useRef(null);
  const searchInputRef = useRef(null);

  const results = useMemo(() => searchItems(searchValue, 8), [searchValue]);

  useEffect(() => {
    setActiveIndex(0);
  }, [searchValue]);

  // Close search dropdown on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target)) {
        setShowSearch(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // Cmd/Ctrl + K to focus search
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setShowSearch(true);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

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

  const selectResult = (item) => {
    if (!item) return;
    if (typeof pendo !== 'undefined') {
      pendo.track('search_result_selected', {
        query: searchValue.trim().substring(0, 100),
        resultId: item.id,
        resultTitle: item.title,
        resultGroup: item.group,
        resultPath: item.path
      });
    }
    setShowSearch(false);
    setSearchValue('');
    navigate(item.path);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (results.length) setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (results.length) setActiveIndex((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results.length) {
        selectResult(results[activeIndex]);
      } else if (searchValue.trim() && typeof pendo !== 'undefined') {
        pendo.track('search_executed', {
          query: searchValue.trim().substring(0, 100),
          resultCount: results.length
        });
      }
    } else if (e.key === 'Escape') {
      setShowSearch(false);
    }
  };

  // Group results by group
  const grouped = useMemo(() => {
    const out = [];
    let last = null;
    results.forEach((r, i) => {
      if (r.group !== last) {
        out.push({ type: 'header', label: r.group, key: `h-${r.group}-${i}` });
        last = r.group;
      }
      out.push({ type: 'item', item: r, index: i, key: r.id });
    });
    return out;
  }, [results]);

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-4 lg:px-6 py-4">
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="p-2 rounded-[6px] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </button>
        {/* Spacer to keep the search centered on lg+ where there's no menu button */}
        <span className="hidden lg:block" aria-hidden="true" />

        {/* Search Bar — centered in available space */}
        <div className="w-full max-w-xl mx-auto" ref={searchWrapRef}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchValue}
              onFocus={() => setShowSearch(true)}
              onChange={(e) => {
                setSearchValue(e.target.value);
                setShowSearch(true);
              }}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search pages, tools, settings…"
              className="w-full pl-10 pr-16 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
            />
            <kbd className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 items-center space-x-1 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[10px] font-medium text-slate-500 dark:text-slate-400">
              <span>⌘</span><span>K</span>
            </kbd>

            {/* Results dropdown */}
            {showSearch && (
              <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-[6px] shadow-lg border border-slate-200 dark:border-slate-700 z-50 overflow-hidden">
                {searchValue.trim() === '' ? (
                  <div className="p-4 text-sm text-slate-500 dark:text-slate-400">
                    Search pages, SEO tools, or settings. Use{' '}
                    <kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-xs">↑</kbd>{' '}
                    <kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-xs">↓</kbd>{' '}
                    to navigate,{' '}
                    <kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-xs">Enter</kbd>{' '}
                    to open.
                  </div>
                ) : results.length === 0 ? (
                  <div className="p-4 text-sm text-slate-500 dark:text-slate-400">
                    No results for &ldquo;{searchValue}&rdquo;.
                  </div>
                ) : (
                  <ul className="max-h-96 overflow-y-auto py-1" role="listbox">
                    {grouped.map((row) => {
                      if (row.type === 'header') {
                        return (
                          <li
                            key={row.key}
                            className="px-3 pt-2 pb-1 text-[11px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500"
                          >
                            {row.label}
                          </li>
                        );
                      }
                      const { item, index } = row;
                      const Icon = item.icon || Search;
                      const isActive = index === activeIndex;
                      return (
                        <li key={row.key} role="option" aria-selected={isActive}>
                          <button
                            onMouseEnter={() => setActiveIndex(index)}
                            onClick={() => selectResult(item)}
                            className={`w-full flex items-center space-x-3 px-3 py-2 text-left transition-colors ${
                              isActive
                                ? 'bg-violet-50 dark:bg-violet-900/20'
                                : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                            }`}
                          >
                            <div
                              className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                                isActive
                                  ? 'bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-300'
                                  : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                                {item.title}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                {item.description}
                              </p>
                            </div>
                            {isActive && (
                              <CornerDownLeft className="w-3.5 h-3.5 text-slate-400" />
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}
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
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{displayName}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[140px]">
                  {displayEmail || 'Pro Plan'}
                </p>
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 z-50">
                {/* User header */}
                <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{displayName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{displayEmail}</p>
                  {displayAccount && (
                    <p className="mt-2 inline-flex items-center px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300">
                      {displayAccount}
                    </p>
                  )}
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
                  <button
                    onClick={async () => {
                      setShowUserMenu(false);
                      try {
                        await signOut();
                        if (typeof pendo !== 'undefined') {
                          pendo.track('user_signed_out', { source: 'topbar_user_menu' });
                        }
                        navigate('/login', { replace: true });
                      } catch (err) {
                        console.error('Failed to sign out', err);
                      }
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                  >
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
