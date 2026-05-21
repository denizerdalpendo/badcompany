import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, Link, Zap, BarChart3, Code } from 'lucide-react';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      id: 'keyword-research',
      icon: Search,
      label: 'Keyword Research',
      color: 'violet',
      path: '/tools?category=keyword-content&tool=paa'
    },
    {
      id: 'faq-schema',
      icon: FileText,
      label: 'Generate FAQ Schema',
      color: 'blue',
      path: '/tools?category=keyword-content&tool=faq-schema'
    },
    {
      id: 'check-redirects',
      icon: Link,
      label: 'Check Redirects',
      color: 'green',
      path: '/tools?category=technical-seo&tool=redirect-checker'
    },
    {
      id: 'page-speed',
      icon: Zap,
      label: 'Page Speed Test',
      color: 'orange',
      path: '/tools?category=technical-seo&tool=speed-checker'
    },
    {
      id: 'create-report',
      icon: BarChart3,
      label: 'Create Report',
      color: 'indigo',
      path: '/reports'
    },
    {
      id: 'validate-robots',
      icon: Code,
      label: 'Validate Robots.txt',
      color: 'cyan',
      path: '/tools?category=technical-seo&tool=robots-validator'
    }
  ];

  const colorClasses = {
    violet: 'from-violet-600 to-indigo-500 hover:from-violet-700 hover:to-indigo-600',
    blue: 'from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600',
    green: 'from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600',
    orange: 'from-orange-600 to-red-500 hover:from-orange-700 hover:to-red-600',
    indigo: 'from-indigo-600 to-purple-500 hover:from-indigo-700 hover:to-purple-600',
    cyan: 'from-cyan-600 to-blue-500 hover:from-cyan-700 hover:to-blue-600'
  };

  const handleClick = (action) => {
    if (typeof pendo !== 'undefined') {
      pendo.track('quick_action_clicked', {
        actionId: action.id,
        actionLabel: action.label,
        destinationPath: action.path
      });
    }
    navigate(action.path);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 lg:p-6 border border-slate-200 dark:border-slate-700">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Quick Actions</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-3">
        {actions.map((action, index) => (
          <motion.button
            key={action.id}
            onClick={() => handleClick(action)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-3 lg:p-4 rounded-xl bg-gradient-to-br ${colorClasses[action.color]} text-white transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-400 dark:focus:ring-offset-slate-800`}
          >
            <action.icon className="w-5 h-5 lg:w-6 lg:h-6 mb-1 lg:mb-2 group-hover:scale-110 transition-transform mx-auto" />
            <p className="text-xs lg:text-sm font-medium text-center">{action.label}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
