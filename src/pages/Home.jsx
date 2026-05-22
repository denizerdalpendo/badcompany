import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
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
import AnalyseDomain from '../components/AnalyseDomain';
import { Search, BarChart3, Zap, CreditCard } from 'lucide-react';
import { useAuth } from '../auth/AuthContext.jsx';
import { useTheme } from '../theme/ThemeContext.jsx';

// Deterministic pseudo-random so dummy data doesn't jitter across renders.
const seededRand = (seed) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

const buildDailyData = (days) => {
  const out = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const base = 140 + Math.sin(i / 9) * 60;
    const noise = seededRand(i) * 80;
    out.push({
      key: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      queries: Math.max(20, Math.round(base + noise))
    });
  }
  return out;
};

const buildHourlyData = () => {
  const out = [];
  const now = new Date();
  for (let h = 0; h <= now.getHours(); h++) {
    const base = 8 + Math.sin(h / 3) * 6;
    const noise = seededRand(h + 1000) * 12;
    out.push({
      key: String(h).padStart(2, '0'),
      label: `${String(h).padStart(2, '0')}:00`,
      queries: Math.max(0, Math.round(base + noise))
    });
  }
  return out;
};

const RANGES = [
  { id: 'today', label: 'Today' },
  { id: '7d', label: '7d' },
  { id: '14d', label: '2 weeks' },
  { id: '30d', label: '30d' },
  { id: '60d', label: '60d' },
  { id: '180d', label: '180d' }
];

const DAYS_BY_RANGE = { '7d': 7, '14d': 14, '30d': 30, '60d': 60, '180d': 180 };

const Home = () => {
  const { user } = useAuth();
  const { resolved } = useTheme();
  const firstName =
    user?.user_metadata?.full_name?.trim().split(/\s+/)[0] ||
    (user?.email ? user.email.split('@')[0] : '');
  const greeting = firstName ? `Welcome back, ${firstName}!` : 'Welcome back!';

  const isDark = resolved === 'dark';
  const lineColor = isDark ? '#fafafa' : '#0a0a0a';
  const axisColor = isDark ? '#a3a3a3' : '#525252';
  const gridColor = isDark ? '#1f1f1f' : '#e5e5e5';

  const [range, setRange] = useState('180d');

  // Build all 180 days once; slice to the active range. Today gets its own
  // hourly series since it's a different unit.
  const fullDaily = useMemo(() => buildDailyData(180), []);
  const todayHourly = useMemo(() => buildHourlyData(), []);

  const chartData = useMemo(() => {
    if (range === 'today') return todayHourly;
    const days = DAYS_BY_RANGE[range] ?? 180;
    return fullDaily.slice(-days);
  }, [range, fullDaily, todayHourly]);

  const totalQueries = chartData.reduce((sum, d) => sum + d.queries, 0);
  const unit = range === 'today' ? 'hour' : 'day';

  const handleRangeChange = (id) => {
    setRange(id);
    if (typeof pendo !== 'undefined') {
      pendo.track('usage_range_changed', { range: id });
    }
  };

  // Recharts can't fit 180 labels on the x-axis; thin them out so the
  // ticks stay readable but the line itself stays detailed.
  const xTickInterval = chartData.length > 30 ? Math.floor(chartData.length / 8) : 0;

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

        {/* Analyse Domain */}
        <AnalyseDomain />

        {/* Usage Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-4 lg:p-6 border border-slate-200 dark:border-slate-700"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Usage Overview
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                API queries · per {unit}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {totalQueries.toLocaleString()}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">total queries</p>
              </div>

              <div
                role="tablist"
                aria-label="Usage range"
                className="flex flex-wrap gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-md"
              >
                {RANGES.map((r) => {
                  const active = r.id === range;
                  return (
                    <button
                      key={r.id}
                      role="tab"
                      aria-selected={active}
                      onClick={() => handleRangeChange(r.id)}
                      className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
                        active
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                      }`}
                    >
                      {r.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="h-40 lg:h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis
                  dataKey="label"
                  stroke={axisColor}
                  tick={{ fill: axisColor, fontSize: 10 }}
                  axisLine={{ stroke: gridColor }}
                  tickLine={false}
                  interval={xTickInterval}
                  minTickGap={8}
                />
                <YAxis
                  stroke={axisColor}
                  tick={{ fill: axisColor, fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={36}
                />
                <Tooltip
                  cursor={{ stroke: gridColor }}
                  contentStyle={{
                    backgroundColor: isDark ? '#0a0a0a' : '#ffffff',
                    border: `1px solid ${gridColor}`,
                    borderRadius: 2,
                    fontSize: 11,
                    padding: '6px 10px',
                    color: isDark ? '#fafafa' : '#0a0a0a'
                  }}
                  labelStyle={{ color: isDark ? '#fafafa' : '#0a0a0a' }}
                />
                <Line
                  type="monotone"
                  dataKey="queries"
                  stroke={lineColor}
                  strokeWidth={1.2}
                  dot={false}
                  activeDot={{ r: 3, fill: lineColor }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Stats Cards — joined with 1px dividers, no gaps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-[6px] overflow-hidden">
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