import React, { useEffect, useRef, useState } from 'react';
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
  Zap,
  Eye,
  Link as LinkIcon
} from 'lucide-react';
import { analyzeDomain, isValidUrl } from '../lib/seoAnalysis.js';

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
  if (score == null) return '#737373';
  if (score >= 90) return '#16a34a';
  if (score >= 50) return '#ca8a04';
  return '#dc2626';
};

const ScoreRing = ({ label, score }) => (
  <div className="flex flex-col items-center justify-center p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-[6px]">
    <span className="text-3xl font-bold" style={{ color: scoreColor(score) }}>
      {score ?? '—'}
    </span>
    <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">
      {label}
    </span>
  </div>
);

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

const SeverityIcon = ({ severity }) => {
  if (severity === 'error') return <AlertCircle className="w-3.5 h-3.5 text-[#dc2626] shrink-0 mt-0.5" />;
  return <AlertTriangle className="w-3.5 h-3.5 text-[#ca8a04] shrink-0 mt-0.5" />;
};

const AnalyseDomain = () => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [recent, setRecent] = useState(() => readRecent());
  const abortRef = useRef(null);

  // Abort any in-flight request when unmounting
  useEffect(() => () => abortRef.current?.abort(), []);

  const runAnalysis = async (rawUrl) => {
    if (!isValidUrl(rawUrl)) {
      setError('Enter a valid URL (e.g. example.com)');
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const startedAt = Date.now();
    try {
      const r = await analyzeDomain(rawUrl, { signal: controller.signal });
      setResult(r);
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
          performanceScore: r.scores.performance,
          accessibilityScore: r.scores.accessibility,
          bestPracticesScore: r.scores.bestPractices,
          issueCount: r.issues.length,
          executionDurationMs: Date.now() - startedAt
        });
      }
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError(err?.message || 'Failed to analyse this URL');
      if (typeof pendo !== 'undefined') {
        pendo.track('domain_analysis_failed', {
          url: rawUrl.substring(0, 200),
          error: err?.message?.substring(0, 200) || 'unknown'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    runAnalysis(url);
  };

  const m = result?.metrics;
  const s = result?.scores;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-[6px] p-4 lg:p-6 border border-slate-200 dark:border-slate-700">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Analyse Domain
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Live SEO + Performance audit via Google PageSpeed Insights
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

      {loading && (
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          Running a real Lighthouse audit — this typically takes 10–30 seconds.
        </p>
      )}

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
                <span className="font-semibold" style={{ color: scoreColor(r.score) }}>
                  {r.score}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {result && (
        <div className="mt-5 space-y-4">
          {/* Header with host + 4 score rings */}
          <div className="space-y-3">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                {result.host}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 shrink-0">
                {new Date(result.analyzedAt).toLocaleString()}
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <ScoreRing label="SEO" score={s.seo} />
              <ScoreRing label="Performance" score={s.performance} />
              <ScoreRing label="Accessibility" score={s.accessibility} />
              <ScoreRing label="Best Practices" score={s.bestPractices} />
            </div>
          </div>

          {/* Core Web Vitals + individual checks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {m.fcp && <Metric icon={Zap} label="First Contentful Paint" value={m.fcp} />}
            {m.lcp && <Metric icon={Zap} label="Largest Contentful Paint" value={m.lcp} />}
            {m.cls && <Metric icon={Zap} label="Cumulative Layout Shift" value={m.cls} />}
            {m.tbt && <Metric icon={Zap} label="Total Blocking Time" value={m.tbt} />}
            <Metric icon={FileText} label="Document title" value={m.title ? 'Pass' : 'Fail'} ok={m.title} />
            <Metric icon={FileText} label="Meta description" value={m.metaDescription ? 'Pass' : 'Fail'} ok={m.metaDescription} />
            <Metric icon={Shield} label="HTTPS" value={m.https ? 'Pass' : 'Fail'} ok={m.https} />
            <Metric icon={Smartphone} label="Viewport" value={m.viewport ? 'Pass' : 'Fail'} ok={m.viewport} />
            <Metric icon={Code} label="robots.txt" value={m.robots ? 'Pass' : 'Fail'} ok={m.robots} />
            <Metric icon={LinkIcon} label="Canonical" value={m.canonical ? 'Pass' : 'Fail'} ok={m.canonical} />
            <Metric icon={Eye} label="Image alt text" value={m.imageAlt ? 'Pass' : 'Fail'} ok={m.imageAlt} />
            <Metric icon={LinkIcon} label="Link text" value={m.linkText ? 'Pass' : 'Fail'} ok={m.linkText} />
            <Metric icon={Code} label="Structured data" value={m.structuredData ? 'Pass' : m.structuredData === false ? 'Fail' : 'Manual'} ok={m.structuredData} />
            <Metric icon={Smartphone} label="Tap targets" value={m.tapTargets ? 'Pass' : 'Fail'} ok={m.tapTargets} />
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
                    <div className="min-w-0">
                      <p className="font-medium text-slate-800 dark:text-slate-200">{issue.title}</p>
                      {issue.description && (
                        <p className="text-slate-500 dark:text-slate-400 mt-0.5">{issue.description}</p>
                      )}
                    </div>
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
