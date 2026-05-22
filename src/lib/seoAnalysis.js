// Real SEO/performance analysis via Google PageSpeed Insights API.
// PSI is free, CORS-enabled, and works without an API key for low volume.
// To raise the rate limit, add an API key via VITE_PSI_KEY.
// Docs: https://developers.google.com/speed/docs/insights/v5/get-started

const PSI_ENDPOINT = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
const PSI_KEY = import.meta.env.VITE_PSI_KEY;

export const normalizeUrl = (raw) => {
  const t = (raw || '').trim();
  if (!t) return '';
  if (!/^https?:\/\//i.test(t)) return `https://${t}`;
  return t;
};

export const isValidUrl = (raw) => {
  try {
    const u = new URL(normalizeUrl(raw));
    return Boolean(u.hostname && u.hostname.includes('.'));
  } catch {
    return false;
  }
};

const pct = (s) => (typeof s === 'number' ? Math.round(s * 100) : null);

const auditOk = (audit) => audit?.score === 1;
const auditSummary = (audit) => audit?.displayValue || '';
const auditTitle = (audit) => audit?.title || '';

// Convert PSI Lighthouse output into the compact shape the UI renders.
const shapeResult = (url, host, lighthouse) => {
  const cats = lighthouse?.categories || {};
  const audits = lighthouse?.audits || {};

  const seoScore = pct(cats.seo?.score);
  const perfScore = pct(cats.performance?.score);
  const a11yScore = pct(cats.accessibility?.score);
  const bestScore = pct(cats['best-practices']?.score);

  // Pull a focused set of named audits we want to surface as metrics
  const named = (key) => audits[key] || null;

  const metrics = {
    fcp: auditSummary(named('first-contentful-paint')),
    lcp: auditSummary(named('largest-contentful-paint')),
    cls: auditSummary(named('cumulative-layout-shift')),
    tbt: auditSummary(named('total-blocking-time')),
    si: auditSummary(named('speed-index')),
    title: auditOk(named('document-title')),
    metaDescription: auditOk(named('meta-description')),
    crawlable: auditOk(named('is-crawlable')),
    robots: auditOk(named('robots-txt')),
    canonical: auditOk(named('canonical')),
    hreflang: auditOk(named('hreflang')),
    https: auditOk(named('is-on-https')),
    viewport: auditOk(named('viewport')),
    imageAlt: auditOk(named('image-alt')),
    linkText: auditOk(named('link-text')),
    structuredData: auditOk(named('structured-data')),
    tapTargets: auditOk(named('tap-targets'))
  };

  // Collect failed/warning audits from SEO + best-practices categories as issues
  const collectIssues = (categoryKey, severity) => {
    const cat = cats[categoryKey];
    if (!cat?.auditRefs) return [];
    return cat.auditRefs
      .map((ref) => audits[ref.id])
      .filter((a) => a && a.score !== null && a.score < 1 && a.scoreDisplayMode !== 'manual')
      .map((a) => ({
        severity: a.score === 0 ? 'error' : severity,
        title: auditTitle(a),
        description: a.description?.replace(/\[Learn[^)]+\)/g, '').trim() || ''
      }));
  };

  const issues = [
    ...collectIssues('seo', 'warning'),
    ...collectIssues('best-practices', 'warning')
  ];

  // De-dupe by title (some audits live in multiple categories)
  const seen = new Set();
  const dedupedIssues = issues.filter((i) => {
    if (seen.has(i.title)) return false;
    seen.add(i.title);
    return true;
  });

  return {
    url,
    host,
    analyzedAt: new Date().toISOString(),
    score: seoScore ?? 0,
    scores: { seo: seoScore, performance: perfScore, accessibility: a11yScore, bestPractices: bestScore },
    metrics,
    issues: dedupedIssues
  };
};

export const analyzeDomain = async (rawUrl, { signal } = {}) => {
  const url = normalizeUrl(rawUrl);
  const host = new URL(url).hostname;

  const params = new URLSearchParams({
    url,
    strategy: 'mobile'
  });
  // Categories — repeat parameter
  ['performance', 'accessibility', 'best-practices', 'seo'].forEach((c) =>
    params.append('category', c)
  );
  if (PSI_KEY) params.set('key', PSI_KEY);

  const resp = await fetch(`${PSI_ENDPOINT}?${params}`, { signal });
  if (!resp.ok) {
    const body = await resp.json().catch(() => null);
    const msg =
      body?.error?.message ||
      `PageSpeed Insights returned ${resp.status} ${resp.statusText}`;
    throw new Error(msg);
  }
  const data = await resp.json();
  if (!data.lighthouseResult) {
    throw new Error('PageSpeed Insights returned no results for this URL');
  }
  return shapeResult(url, host, data.lighthouseResult);
};
