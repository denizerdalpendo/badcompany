import React, { useState } from "react";
import Layout from "../components/Layout";
import { User, Mail, Lock, CreditCard, Trash2, Camera } from "lucide-react";

const AccountSettings = () => {
  const [account, setAccount] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    company: "Acme Inc",
    position: "SEO Manager",
  });
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Account Settings
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your personal account details, password, and plan
          </p>
        </div>

        {/* Profile */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-2 mb-6">
            <User className="w-5 h-5 text-violet-600" />
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Profile
            </h2>
          </div>

          <div className="flex items-center space-x-6 mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-violet-600 to-indigo-500 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <button
                className="absolute -bottom-1 -right-1 p-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600"
                aria-label="Change avatar"
              >
                <Camera className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
              </button>
            </div>
            <div>
              <p className="font-medium text-slate-900 dark:text-slate-100">
                {account.name}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {account.email}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={account.name}
                onChange={(e) =>
                  setAccount({ ...account, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={account.email}
                onChange={(e) =>
                  setAccount({ ...account, email: e.target.value })
                }
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Company
              </label>
              <input
                type="text"
                value={account.company}
                onChange={(e) =>
                  setAccount({ ...account, company: e.target.value })
                }
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Position
              </label>
              <input
                type="text"
                value={account.position}
                onChange={(e) =>
                  setAccount({ ...account, position: e.target.value })
                }
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 mt-6 border-t border-slate-200 dark:border-slate-700">
            <button className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium">
              Cancel
            </button>
            <button
              onClick={() => {
                if (typeof pendo !== "undefined") {
                  pendo.track("account_profile_updated", {
                    hasName: Boolean(account.name),
                    hasEmail: Boolean(account.email),
                    hasCompany: Boolean(account.company),
                    hasPosition: Boolean(account.position),
                  });
                }
              }}
              className="px-6 py-2 bg-gradient-to-r from-violet-600 to-indigo-500 text-white rounded-lg font-medium hover:from-violet-700 hover:to-indigo-600"
            >
              Save Changes
            </button>
          </div>
        </section>

        {/* Password */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-2 mb-6">
            <Lock className="w-5 h-5 text-violet-600" />
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Password
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="password"
              placeholder="Current password"
              value={passwords.current}
              onChange={(e) =>
                setPasswords({ ...passwords, current: e.target.value })
              }
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
            <input
              type="password"
              placeholder="New password"
              value={passwords.next}
              onChange={(e) =>
                setPasswords({ ...passwords, next: e.target.value })
              }
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={passwords.confirm}
              onChange={(e) =>
                setPasswords({ ...passwords, confirm: e.target.value })
              }
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => {
                if (typeof pendo !== "undefined") {
                  pendo.track("password_changed", {
                    success: true,
                    source: "account_settings",
                  });
                }
                setPasswords({ current: "", next: "", confirm: "" });
              }}
              className="px-6 py-2 bg-gradient-to-r from-violet-600 to-indigo-500 text-white rounded-lg font-medium hover:from-violet-700 hover:to-indigo-600"
            >
              Update Password
            </button>
          </div>
        </section>

        {/* Plan */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-2 mb-6">
            <CreditCard className="w-5 h-5 text-violet-600" />
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Plan
            </h2>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            <div>
              <p className="font-medium text-slate-900 dark:text-slate-100">
                Pro Plan
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Renews on Jun 1, 2026 — $49/month
              </p>
            </div>
            <a
              href="/billing"
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-white dark:hover:bg-slate-700"
            >
              Manage Billing
            </a>
          </div>
        </section>

        {/* Linked Email */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-2 mb-6">
            <Mail className="w-5 h-5 text-violet-600" />
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Connected Accounts
            </h2>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <div>
              <p className="font-medium text-slate-900 dark:text-slate-100">
                Google
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Connected as {account.email}
              </p>
            </div>
            <button
              onClick={() => {
                if (typeof pendo !== "undefined") {
                  pendo.track("connected_account_disconnected", {
                    provider: "Google",
                    accountEmail: account.email,
                  });
                }
              }}
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg"
            >
              Disconnect
            </button>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="p-6 rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
          <div className="flex items-center space-x-2 mb-2">
            <Trash2 className="w-5 h-5 text-red-600" />
            <h2 className="text-xl font-semibold text-red-900 dark:text-red-100">
              Danger Zone
            </h2>
          </div>
          <p className="text-sm text-red-700 dark:text-red-300 mb-4">
            Permanently delete your account and all associated data. This action
            cannot be undone.
          </p>
          <button
            onClick={() => {
              if (typeof pendo !== "undefined") {
                pendo.track("account_deleted", {
                  source: "account_settings",
                });
              }
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Account</span>
          </button>
        </section>
      </div>
    </Layout>
  );
};

export default AccountSettings;
