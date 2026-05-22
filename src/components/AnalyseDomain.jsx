import React, { useState } from 'react';
import {
  Globe,
  Loader2,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Shield,
  Smartphone,
  FileText,
  Code,
  Image as ImageIcon,
  Zap
} from 'lucide-react';
import { analyzeDomain, isValidUrl, normalizeUrl } from '../lib/seoAnalysis.js';

const RECENT_KEY = 'demo-seo-recent';

const readRecent = () => {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
  } catch {
    return [];
  }
};

const writeRecent = (entries) => {
  localStorage.setItem(RECENT_KEY, JSON.stringify(entries.slice(0, 5)));
};

const scoreColor = (score) => {
  if (score >= 80) return '#16a34a'; // green
  if (score >= 60) return '#ca8a04'; // amber
  return '#dc2626'; // red
};

const SeverityIcon = ({ severity }) => {
  if (severity === 'error') return <AlertCircle className="w-3.5 h-3.5 text-[#dc2626] shrink-0 mt-0.5" />;
  return <AlertTriangle className="w-3.5 h-3.5 text-[#ca8a04] shrink-0 mt-0.5" />;
};

const Metric = ({ icon: Icon, label, value, ok }) => (
  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-[6px]">
    <div className="flex items-center space-x-2 min-w-0">
      <Icon className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
      <span className="text-xs text-slate-600 dark:text-slate-400 truncate">{label}</span>
    </div>
    <span
      className={`text-xs font-semibold ml-2 shrink-0 ${
        ok === true ? 'text-[#16a34a]' : ok === false ? 'text-[#dc2626]' : 'text-slate-900 dark:text-slate-100'
      }`}
    >
      {value}
    </span>
  </div>
);

const AnalyseDomain = () => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [recent, setRecent] = useState(() => readRecent());

  const runAnalysis = (rawUrl) => {
    if (!isValidUrl(rawUrl)) {
      setError('Enter a valid URL (e.g. example.com)');
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);

    const startedAt = Date.now();

    // Simulate latency so the loading state is visible
    setTimeout(() => {
      const r = analyzeDomain(rawUrl);
      setResult(r);
      setLoading(false);

      const nextRecent = [
        { url: r.url, host: r.host, score: r.score, analyzedAt: r.analyzedAt },
        ...recent.filter((x) => x.url !== r.url)
      ].slice(0, 5);
      setRecent(nextRecent);
      writeRecent(nextRecent);

      if (typeof pendo !== 'undefined') {
        pendo.track('domain_analyzed', {
          host: r.host,
          score: r.score,
          issueCount: r.issues.length,
          executionDurationMs: Date.now() - startedAt
        });
      }
    }, 1200);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    runAnalysis(url);
  };

  const m = result?.metrics;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-[6px] p-4 lg:p-6 border border-slate-200 dark:border-slate-700">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Analyse Domain
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enter a URL to get a quick SEO health check
          </p>
        </div>
        <Globe className="w-5 h-5 text-slate-400" />
      </div>

      <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <input
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error) setError('');
            }}
            placeholder="https://example.com"
            disabled={loading}
            className={`w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border rounded-[6px] focus:outline-none focus:ring-2 focus:ring-slate-500 disabled:opacity-60 ${
              error
                ? 'border-[#dc2626] focus:ring-[#dc2626]'
                : 'border-slate-200 dark:border-slate-700'
            }`}
          />
          {error && <p className="mt-1 text-xs text-[#dc2626]">{error}</p>}
        </div>
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm font-medium rounded-[6px] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
          <span>{loading ? 'Analysing…' : 'Analyse'}</span>
        </button>
      </form>

      {/* Recent analyses */}
      {recent.length > 0 && !result && !loading && (
        <div className="mt-4">
          <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 mb-2">
            Recent
          </p>
          <div className="flex flex-wrap gap-2">
            {recent.map((r) => (
              <button
                key={r.url}
                onClick={() => {
                  setUrl(r.url);
                  runAnalysis(r.url);
                }}
                className="flex items-center space-x-2 px-2 py-1 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-[6px] hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <span className="text-slate-700 dark:text-slate-200 truncate max-w-[160px]">{r.host}</span>
                <span
                  className="font-semibold"
                  style={{ color: scoreColor(r.score) }}
                >
                  {r.score}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="mt-5 space-y-4">
          {/* Score header */}
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-[6px]">
            <div className="min-w-0">
              <p className="text-xs text-slate-500 dark:text-slate-400">SEO score for</p>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                {result.host}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                {new Date(result.analyzedAt).toLocaleString()}
              </p>
            </div>
            <div className="flex items-baseline space-x-1 shrink-0">
              <span
                className="text-4xl font-bold"
                style={{ color: scoreColor(result.score) }}
              >
                {result.score}
              </span>
              <span className="text-sm text-slate-400 dark:text-slate-500">/100</span>
            </div>
          </div>

          {/* Metrics grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Metric
              icon={FileText}
              label="Title length"
              value={`${m.titleLength} chars`}
              ok={m.titleLength >= 30 && m.titleLength <= 65}
            />
            <Metric
              icon={FileText}
              label="Meta description"
              value={`${m.metaLength} chars`}
              ok={m.metaLength >= 120 && m.metaLength <= 160}
            />
            <Metric icon={Code} label="H1 tags" value={m.h1Count} ok={m.h1Count === 1} />
            <Metric
              icon={FileText}
              label="Word count"
              value={m.wordCount}
              ok={m.wordCount >= 300}
            />
            <Metric
              icon={ImageIcon}
              label="Images missing alt"
              value={`${m.imagesMissingAlt} of ${m.imagesTotal}`}
              ok={m.imagesMissingAlt === 0}
            />
            <Metric
              icon={Zap}
              label="Page speed"
              value={`${m.speedScore}/100`}
              ok={m.speedScore >= 75}
            />
            <Metric icon={Shield} label="HTTPS" value={m.https ? 'Yes' : 'No'} ok={m.https} />
            <Metric
              icon={Smartphone}
              label="Mobile friendly"
              value={m.mobileFriendly ? 'Yes' : 'No'}
              ok={m.mobileFriendly}
            />
            <Metric
              icon={Code}
              label="sitemap.xml"
              value={m.hasSitemap ? 'Found' : 'Missing'}
              ok={m.hasSitemap}
            />
            <Metric
              icon={Code}
              label="robots.txt"
              value={m.hasRobots ? 'Found' : 'Missing'}
              ok={m.hasRobots}
            />
          </div>

          {/* Issues */}
          <div>
            <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 mb-2">
              {result.issues.length === 0
                ? 'No issues found'
                : `${result.issues.length} issue${result.issues.length > 1 ? 's' : ''} found`}
            </p>
            {result.issues.length === 0 ? (
              <div className="flex items-center space-x-2 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-[6px]">
                <CheckCircle2 className="w-4 h-4 text-[#16a34a]" />
                <span className="text-sm text-slate-700 dark:text-slate-200">
                  Looks great — no issues detected.
                </span>
              </div>
            ) : (
              <ul className="space-y-1">
                {result.issues.map((issue, i) => (
                  <li
                    key={i}
                    className="flex items-start space-x-2 p-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-[6px]"
                  >
                    <SeverityIcon severity={issue.severity} />
                    <span className="text-slate-700 dark:text-slate-200">{issue.text}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyseDomain;
