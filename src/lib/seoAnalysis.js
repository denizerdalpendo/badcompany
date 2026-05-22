// Fake SEO analyzer — produces deterministic dummy data per URL so the
// same input yields the same result, and the numbers feel believable.

const hashString = (str) => {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
};

const pick = (seed, offset, min, max) => {
  const x = Math.sin(seed + offset) * 10000;
  const r = x - Math.floor(x);
  return Math.floor(min + r * (max - min + 1));
};

export const normalizeUrl = (raw) => {
  const t = (raw || '').trim();
  if (!t) return '';
  // Add https:// if no protocol
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

export const analyzeDomain = (rawUrl) => {
  const url = normalizeUrl(rawUrl);
  const host = new URL(url).hostname;
  const seed = hashString(host);

  const titleLength = pick(seed, 1, 18, 72);
  const metaLength = pick(seed, 2, 80, 180);
  const wordCount = pick(seed, 3, 180, 1800);
  const h1Count = pick(seed, 4, 0, 3);
  const imagesTotal = pick(seed, 5, 4, 40);
  const imagesMissingAlt = pick(seed, 6, 0, Math.min(8, imagesTotal));
  const speedScore = pick(seed, 7, 38, 99);
  const hasSitemap = pick(seed, 8, 0, 10) > 2;
  const hasRobots = pick(seed, 9, 0, 10) > 1;
  const https = url.startsWith('https://');
  const mobileFriendly = pick(seed, 10, 0, 10) > 2;

  // Score is a weighted average of the individual signals
  let score = 0;
  if (titleLength >= 30 && titleLength <= 65) score += 10;
  else if (titleLength > 0) score += 5;
  if (metaLength >= 120 && metaLength <= 160) score += 10;
  else if (metaLength > 0) score += 5;
  if (h1Count === 1) score += 10;
  else if (h1Count > 0) score += 4;
  if (wordCount >= 300) score += 10;
  else if (wordCount >= 100) score += 5;
  if (imagesMissingAlt === 0) score += 10;
  else score += Math.max(0, 10 - imagesMissingAlt * 2);
  if (https) score += 10;
  if (mobileFriendly) score += 10;
  if (hasSitemap) score += 10;
  if (hasRobots) score += 5;
  score += Math.round(speedScore / 10); // up to 10 from speed
  score = Math.min(100, score);

  const issues = [];
  if (titleLength < 30) issues.push({ severity: 'warning', text: `Page title is short (${titleLength} chars; aim for 30–65)` });
  if (titleLength > 65) issues.push({ severity: 'warning', text: `Page title is long (${titleLength} chars; may be truncated in SERPs)` });
  if (metaLength < 120) issues.push({ severity: 'warning', text: `Meta description is short (${metaLength} chars)` });
  if (metaLength > 160) issues.push({ severity: 'warning', text: `Meta description is long (${metaLength} chars; may be truncated)` });
  if (h1Count === 0) issues.push({ severity: 'error', text: 'No <h1> tag found on the page' });
  if (h1Count > 1) issues.push({ severity: 'warning', text: `Multiple <h1> tags found (${h1Count}); recommended is one` });
  if (wordCount < 300) issues.push({ severity: 'warning', text: `Thin content (${wordCount} words); aim for 300+` });
  if (imagesMissingAlt > 0) issues.push({ severity: 'error', text: `${imagesMissingAlt} image${imagesMissingAlt > 1 ? 's' : ''} missing alt attributes` });
  if (!https) issues.push({ severity: 'error', text: 'Site is not served over HTTPS' });
  if (!mobileFriendly) issues.push({ severity: 'error', text: 'Mobile-friendly check failed' });
  if (!hasSitemap) issues.push({ severity: 'warning', text: 'sitemap.xml not detected' });
  if (!hasRobots) issues.push({ severity: 'warning', text: 'robots.txt not detected' });
  if (speedScore < 50) issues.push({ severity: 'error', text: `Poor page speed score (${speedScore}/100)` });
  else if (speedScore < 75) issues.push({ severity: 'warning', text: `Page speed could be improved (${speedScore}/100)` });

  return {
    url,
    host,
    analyzedAt: new Date().toISOString(),
    score,
    metrics: {
      titleLength,
      metaLength,
      h1Count,
      wordCount,
      imagesTotal,
      imagesMissingAlt,
      speedScore,
      hasSitemap,
      hasRobots,
      https,
      mobileFriendly
    },
    issues
  };
};
