import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { BarChart3, Download, Calendar, Filter, Loader2 } from 'lucide-react';
import Layout from '../components/Layout';

const STORAGE_KEY = 'demo-reports';

const seedReports = [
  { id: 1, title: 'Monthly SEO Audit Report', type: 'Comprehensive', date: 'Dec 15, 2024', status: 'completed', size: '2.4 MB' },
  { id: 2, title: 'Keyword Performance Analysis', type: 'Keyword', date: 'Dec 10, 2024', status: 'completed', size: '1.1 MB' },
  { id: 3, title: 'Technical SEO Health Check', type: 'Technical', date: 'Dec 5, 2024', status: 'completed', size: '3.2 MB' },
  { id: 4, title: 'Backlink Profile Analysis', type: 'Links', date: 'Dec 1, 2024', status: 'completed', size: '4.7 MB' }
];

const TYPE_TITLES = {
  Comprehensive: 'Monthly SEO Audit Report',
  Keyword: 'Keyword Performance Analysis',
  Technical: 'Technical SEO Health Check',
  Links: 'Backlink Profile Analysis'
};

const REPORT_TYPES = Object.keys(TYPE_TITLES);

const readReports = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedReports;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : seedReports;
  } catch {
    return seedReports;
  }
};

const writeReports = (reports) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
};

const formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return iso;
  }
};

const randomSize = () => {
  const mb = (0.7 + Math.random() * 4.3).toFixed(1);
  return `${mb} MB`;
};

const buildReportContent = (report) => {
  const today = new Date().toLocaleString();
  return [
    '═══════════════════════════════════════════════════════════════',
    `  ${report.title.toUpperCase()}`,
    '═══════════════════════════════════════════════════════════════',
    '',
    `Type:          ${report.type}`,
    `Generated:     ${report.date}`,
    `Downloaded:    ${today}`,
    `Status:        ${report.status}`,
    `Size:          ${report.size}`,
    '',
    '───────────────────────────────────────────────────────────────',
    '  EXECUTIVE SUMMARY',
    '───────────────────────────────────────────────────────────────',
    '',
    'Overall SEO health is trending positive month over month with',
    'improvements in organic visibility, page speed, and crawlability.',
    'Three high-impact issues have been identified and prioritized for',
    'the next sprint.',
    '',
    '───────────────────────────────────────────────────────────────',
    '  KEY METRICS',
    '───────────────────────────────────────────────────────────────',
    '',
    '  Organic Traffic           24,318 sessions   ↑ 12.4%',
    '  Keywords Ranking          1,872             ↑ 3.1%',
    '  Average Position          14.3              ↓ 2.0',
    '  Indexed Pages             4,217             ↑ 0.8%',
    '  Backlinks (Total)         18,402            ↑ 2.2%',
    '  Referring Domains         1,103             ↑ 1.4%',
    '  Core Web Vitals Pass      83%               ↑ 6.0%',
    '',
    '───────────────────────────────────────────────────────────────',
    '  TOP ISSUES',
    '───────────────────────────────────────────────────────────────',
    '',
    '  1. 28 pages missing meta descriptions',
    '  2. 14 broken internal links detected',
    '  3. Slow LCP on /products/* templates (avg 3.4s)',
    '  4. 7 duplicate <title> tags across category pages',
    '  5. robots.txt blocks /resources/* unintentionally',
    '',
    '───────────────────────────────────────────────────────────────',
    '  RECOMMENDATIONS',
    '───────────────────────────────────────────────────────────────',
    '',
    '  • Auto-generate meta descriptions from the first 155 chars of',
    '    body content where missing.',
    '  • Fix the broken links in the resource center sidebar.',
    '  • Defer non-critical JS on product templates and serve hero',
    '    imagery via responsive <picture> with WebP.',
    '  • Consolidate duplicate titles using canonical URLs.',
    '  • Update robots.txt to allow /resources/.',
    '',
    '═══════════════════════════════════════════════════════════════',
    `  END OF REPORT · Bad Company · ${today}`,
    '═══════════════════════════════════════════════════════════════',
    ''
  ].join('\n');
};

const downloadReport = (report) => {
  const text = buildReportContent(report);
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safe = report.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
  a.href = url;
  a.download = `${safe}-${report.id}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const Reports = () => {
  const [reports, setReports] = useState(() => readReports());
  const [generating, setGenerating] = useState(false);
  const [dateFilter, setDateFilter] = useState('Last 30 days');
  const [typeFilter, setTypeFilter] = useState('All Types');

  useEffect(() => {
    writeReports(reports);
  }, [reports]);

  const filteredReports = useMemo(() => {
    if (typeFilter === 'All Types') return reports;
    return reports.filter((r) => r.type === typeFilter);
  }, [reports, typeFilter]);

  const handleGenerate = () => {
    if (generating) return;
    setGenerating(true);
    const startedAt = Date.now();

    setTimeout(() => {
      const type = REPORT_TYPES[Math.floor(Math.random() * REPORT_TYPES.length)];
      const now = new Date();
      const newReport = {
        id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        title: TYPE_TITLES[type],
        type,
        date: formatDate(now.toISOString()),
        status: 'completed',
        size: randomSize(),
        createdAt: now.toISOString()
      };
      setReports((prev) => [newReport, ...prev]);
      setGenerating(false);
      toast.success(`${newReport.title} is ready`);

      if (typeof pendo !== 'undefined') {
        pendo.track('report_generated', {
          reportId: String(newReport.id),
          reportType: newReport.type,
          reportTitle: newReport.title,
          executionDurationMs: Date.now() - startedAt
        });
      }
    }, 1500);
  };

  const handleDownload = (report) => {
    downloadReport(report);
    toast.success(`Downloaded ${report.title}`);

    if (typeof pendo !== 'undefined') {
      pendo.track('report_downloaded', {
        reportId: String(report.id),
        reportTitle: report.title,
        reportType: report.type,
        reportDate: report.date,
        reportSize: report.size,
        reportStatus: report.status
      });
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Reports</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Access and manage your SEO analysis reports
            </p>
          </div>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center space-x-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-6 py-3 rounded-[6px] text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating…</span>
              </>
            ) : (
              <span>Generate New Report</span>
            )}
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4 bg-white dark:bg-slate-800 p-4 rounded-[6px] border border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-slate-500" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-[6px] px-3 py-2 text-sm"
            >
              <option>Last 30 days</option>
              <option>Last 7 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-[6px] px-3 py-2 text-sm"
            >
              <option>All Types</option>
              {REPORT_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Reports Grid */}
        {filteredReports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="bg-white dark:bg-slate-800 rounded-[6px] p-6 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-[6px]">
                    <BarChart3 className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                  </div>
                  <span className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full">
                    {report.status}
                  </span>
                </div>

                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">{report.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{report.type} Report</p>

                <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-500">
                  <span>{report.date}</span>
                  <span>{report.size}</span>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => handleDownload(report)}
                    className="w-full flex items-center justify-center space-x-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 py-2 rounded-[6px] hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Report</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">No reports yet</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Generate your first SEO report to get started
            </p>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="inline-flex items-center space-x-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-6 py-2 rounded-[6px] text-sm font-medium hover:opacity-90 disabled:opacity-50"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating…</span>
                </>
              ) : (
                <span>Create Report</span>
              )}
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Reports;
