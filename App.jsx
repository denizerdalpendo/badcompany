import React from 'react';
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './src/pages/Home.jsx';
import Tools from './src/pages/Tools.jsx';
import Reports from './src/pages/Reports.jsx';
import Billing from './src/pages/Billing.jsx';
import Settings from './src/pages/Settings.jsx';
import AccountSettings from './src/pages/AccountSettings.jsx';
import Support from './src/pages/Support.jsx';
import NotFound from './src/pages/NotFound.jsx';
import Login from './src/pages/Login.jsx';
import Register from './src/pages/Register.jsx';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext.jsx';
import { AuthProvider } from './src/auth/AuthContext.jsx';
import ProtectedRoute from './src/components/ProtectedRoute.jsx';

function ThemedShell({ children }) {
  const { resolved } = useTheme();
  return (
    <Theme appearance={resolved} accentColor="gray" grayColor="slate" radius="large" scaling="100%">
      {children}
    </Theme>
  );
}

const protect = (el) => <ProtectedRoute>{el}</ProtectedRoute>;

export default function App() {
  return (
    <ThemeProvider>
      <ThemedShell>
        <AuthProvider>
          <Router>
            <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-50">
              <Routes>
                {/* Public */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected */}
                <Route path="/" element={protect(<Home />)} />
                <Route path="/tools/*" element={protect(<Tools />)} />
                <Route path="/reports" element={protect(<Reports />)} />
                <Route path="/billing" element={protect(<Billing />)} />
                <Route path="/settings" element={protect(<Settings />)} />
                <Route path="/account-settings" element={protect(<AccountSettings />)} />
                <Route path="/support" element={protect(<Support />)} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <ToastContainer
                position="top-right"
                autoClose={3000}
                newestOnTop
                closeOnClick
                pauseOnHover
              />
            </main>
          </Router>
        </AuthProvider>
      </ThemedShell>
    </ThemeProvider>
  );
}
