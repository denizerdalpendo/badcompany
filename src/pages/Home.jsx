import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import Layout from '../components/Layout';
import StatsCard from '../components/StatsCard';
import QuickActions from '../components/QuickActions';
import RecentActivity from '../components/RecentActivity';
import { Search, BarChart3, Zap, CreditCard } from 'lucide-react';
import { useAuth } from '../auth/AuthContext.jsx';
import { useTheme } from '../theme/ThemeContext.jsx';

const usageData = [
  { day: 'Mon', queries: 142 },
  { day: 'Tue', queries: 198 },
  { day: 'Wed', queries: 167 },
  { day: 'Thu', queries: 241 },
  { day: 'Fri', queries: 213 },
  { day: 'Sat', queries: 89 },
  { day: 'Sun', queries: 73 }
];

const Home = () => {
  const { user } = useAuth();
  const { resolved } = useTheme();
  const firstName =
    user?.user_metadata?.full_name?.trim().split(/\s+/)[0] ||
    (user?.email ? user.email.split('@')[0] : '');
  const greeting = firstName ? `Welcome back, ${firstName}!` : 'Welcome back!';

  const isDark = resolved === 'dark';
  const barColor = isDark ? '#fafafa' : '#0a0a0a';
  const axisColor = isDark ? '#a3a3a3' : '#525252';
  const gridColor = isDark ? '#1f1f1f' : '#e5e5e5';

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 lg:mb-8"
        >
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            {greeting} 👋
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm lg:text-base">
            Here's what's happening with your SEO tools today.
          </p>
        </motion.div>

        {/* Usage Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-4 lg:p-6 border border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Usage Overview
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                API queries · last 7 days
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {usageData.reduce((sum, d) => sum + d.queries, 0)}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">total queries</p>
            </div>
          </div>

          <div className="h-48 lg:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usageData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis
                  dataKey="day"
                  stroke={axisColor}
                  tick={{ fill: axisColor, fontSize: 11 }}
                  axisLine={{ stroke: gridColor }}
                  tickLine={false}
                />
                <YAxis
                  stroke={axisColor}
                  tick={{ fill: axisColor, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: gridColor, opacity: 0.4 }}
                  contentStyle={{
                    backgroundColor: isDark ? '#0a0a0a' : '#ffffff',
                    border: `1px solid ${gridColor}`,
                    borderRadius: 2,
                    fontSize: 12,
                    color: isDark ? '#fafafa' : '#0a0a0a'
                  }}
                  labelStyle={{ color: isDark ? '#fafafa' : '#0a0a0a' }}
                />
                <Bar dataKey="queries" fill={barColor} radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <StatsCard
            title="API Queries"
            value="1,247"
            subtitle="of 2,500 used"
            icon={Search}
            color="violet"
            progress={50}
            trend={{ positive: true, value: "12%" }}
          />
          <StatsCard
            title="Reports Generated"
            value="23"
            subtitle="this month"
            icon={BarChart3}
            color="blue"
            trend={{ positive: true, value: "8%" }}
          />
          <StatsCard
            title="Tools Used"
            value="8"
            subtitle="most popular: Keyword Research"
            icon={Zap}
            color="green"
            trend={{ positive: false, value: "3%" }}
          />
          <StatsCard
            title="Current Plan"
            value="Pro"
            subtitle="Upgrade to Enterprise"
            icon={CreditCard}
            color="orange"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <QuickActions />
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <RecentActivity />
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default Home;