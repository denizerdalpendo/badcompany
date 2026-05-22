import {
  Home,
  Wrench,
  BarChart3,
  CreditCard,
  Settings,
  UserCog,
  LifeBuoy,
  StickyNote,
  Globe,
  Search,
  FileText,
  Code,
  Link as LinkIcon,
  Zap,
  Bell,
  Shield,
  Lock,
  Trash2
} from 'lucide-react';

export const searchIndex = [
  // Top-level pages
  {
    id: 'page-home',
    title: 'Home',
    description: 'Dashboard overview, stats, recent activity',
    path: '/',
    group: 'Pages',
    icon: Home,
    keywords: ['dashboard', 'overview', 'stats', 'recent activity']
  },
  {
    id: 'page-tools',
    title: 'SEO Tools',
    description: 'All SEO analysis and optimization tools',
    path: '/tools',
    group: 'Pages',
    icon: Wrench,
    keywords: ['seo', 'tools', 'analysis']
  },
  {
    id: 'page-reports',
    title: 'Reports',
    description: 'Generated reports and exports',
    path: '/reports',
    group: 'Pages',
    icon: BarChart3,
    keywords: ['reports', 'analytics', 'export', 'data']
  },
  {
    id: 'page-billing',
    title: 'Billing',
    description: 'Plan, invoices, and payment methods',
    path: '/billing',
    group: 'Pages',
    icon: CreditCard,
    keywords: ['billing', 'invoice', 'subscription', 'plan', 'payment']
  },
  {
    id: 'page-settings',
    title: 'Settings',
    description: 'App settings: profile, notifications, security, preferences',
    path: '/settings',
    group: 'Pages',
    icon: Settings,
    keywords: ['settings', 'preferences']
  },
  {
    id: 'page-account-settings',
    title: 'Account Settings',
    description: 'Profile, password, plan, connected accounts',
    path: '/account-settings',
    group: 'Pages',
    icon: UserCog,
    keywords: ['account', 'profile', 'password', 'avatar']
  },
  {
    id: 'page-support',
    title: 'Support',
    description: 'Help center, contact, and docs',
    path: '/support',
    group: 'Pages',
    icon: LifeBuoy,
    keywords: ['support', 'help', 'contact', 'docs']
  },
  {
    id: 'page-notes',
    title: 'Notes',
    description: 'Personal scratchpad — save and search your notes',
    path: '/notes',
    group: 'Pages',
    icon: StickyNote,
    keywords: ['notes', 'scratchpad', 'notebook', 'memo']
  },
  {
    id: 'feature-analyse-domain',
    title: 'Analyse Domain',
    description: 'Run a quick SEO health check on any URL from the dashboard',
    path: '/',
    group: 'Pages',
    icon: Globe,
    keywords: ['analyse', 'analyze', 'domain', 'url', 'audit', 'seo check', 'health']
  },

  // SEO Tools — Keyword & Content
  {
    id: 'tool-paa',
    title: 'People Also Ask Extractor',
    description: 'Extract PAA questions for any keyword',
    path: '/tools?category=keyword-content&tool=paa',
    group: 'SEO Tools',
    icon: Search,
    keywords: ['paa', 'people also ask', 'questions', 'keyword']
  },
  {
    id: 'tool-meta-preview',
    title: 'Meta Title & Description Preview',
    description: 'Preview how your meta tags appear in search',
    path: '/tools?category=keyword-content&tool=meta-preview',
    group: 'SEO Tools',
    icon: FileText,
    keywords: ['meta', 'title', 'description', 'serp preview']
  },
  {
    id: 'tool-faq-schema',
    title: 'FAQ Schema Generator',
    description: 'Generate structured data for FAQ sections',
    path: '/tools?category=keyword-content&tool=faq-schema',
    group: 'SEO Tools',
    icon: Code,
    keywords: ['faq', 'schema', 'structured data', 'jsonld']
  },
  {
    id: 'tool-blog-ideas',
    title: 'Blog Idea Generator',
    description: 'Get content ideas based on keywords',
    path: '/tools?category=keyword-content&tool=blog-ideas',
    group: 'SEO Tools',
    icon: FileText,
    keywords: ['blog', 'ideas', 'content', 'topics']
  },

  // SEO Tools — Technical
  {
    id: 'tool-robots-validator',
    title: 'Robots.txt & Sitemap Validator',
    description: 'Validate your robots.txt and sitemap files',
    path: '/tools?category=technical-seo&tool=robots-validator',
    group: 'SEO Tools',
    icon: Code,
    keywords: ['robots', 'sitemap', 'validator', 'crawl']
  },
  {
    id: 'tool-redirect-checker',
    title: 'Redirect Checker',
    description: 'Check redirect chains and status codes',
    path: '/tools?category=technical-seo&tool=redirect-checker',
    group: 'SEO Tools',
    icon: LinkIcon,
    keywords: ['redirect', '301', '302', 'chain', 'status code']
  },
  {
    id: 'tool-alt-checker',
    title: 'Image Alt Checker',
    description: 'Audit images for missing alt attributes',
    path: '/tools?category=technical-seo&tool=alt-checker',
    group: 'SEO Tools',
    icon: FileText,
    keywords: ['image', 'alt', 'accessibility', 'a11y']
  },
  {
    id: 'tool-speed-checker',
    title: 'Page Speed Quick Checker',
    description: 'Quick page speed analysis',
    path: '/tools?category=technical-seo&tool=speed-checker',
    group: 'SEO Tools',
    icon: Zap,
    keywords: ['speed', 'performance', 'pagespeed', 'lighthouse']
  },

  // SEO Tools — Links
  {
    id: 'tool-broken-links',
    title: 'Broken Link Finder',
    description: 'Find and fix broken links on your site',
    path: '/tools?category=links-authority&tool=broken-links',
    group: 'SEO Tools',
    icon: LinkIcon,
    keywords: ['broken', 'links', '404', 'audit']
  },
  {
    id: 'tool-anchor-text',
    title: 'Backlink Anchor Text Extractor',
    description: 'Analyze anchor text distribution',
    path: '/tools?category=links-authority&tool=anchor-text',
    group: 'SEO Tools',
    icon: BarChart3,
    keywords: ['anchor', 'backlinks', 'link text']
  },

  // Settings subsections
  {
    id: 'settings-profile',
    title: 'Profile Settings',
    description: 'Update your name, email, company, and position',
    path: '/settings',
    group: 'Settings',
    icon: UserCog,
    keywords: ['profile', 'name', 'email', 'company']
  },
  {
    id: 'settings-notifications',
    title: 'Notification Preferences',
    description: 'Email alerts, report ready notifications, API warnings',
    path: '/settings',
    group: 'Settings',
    icon: Bell,
    keywords: ['notifications', 'email', 'alerts']
  },
  {
    id: 'settings-security',
    title: 'Security',
    description: 'Change password, enable two-factor authentication',
    path: '/settings',
    group: 'Settings',
    icon: Shield,
    keywords: ['security', 'password', '2fa', 'two-factor']
  },
  {
    id: 'settings-preferences',
    title: 'Preferences',
    description: 'Dark mode, data export, delete account',
    path: '/settings',
    group: 'Settings',
    icon: Globe,
    keywords: ['preferences', 'dark mode', 'export', 'theme']
  },
  {
    id: 'account-password',
    title: 'Change Password',
    description: 'Update your account password',
    path: '/account-settings',
    group: 'Settings',
    icon: Lock,
    keywords: ['password', 'change password']
  },
  {
    id: 'account-danger',
    title: 'Delete Account',
    description: 'Permanently delete your account and all data',
    path: '/account-settings',
    group: 'Settings',
    icon: Trash2,
    keywords: ['delete', 'remove account', 'danger zone']
  }
];

const norm = (s) => (s || '').toLowerCase();

export function searchItems(query, limit = 8) {
  const q = norm(query).trim();
  if (!q) return [];

  const terms = q.split(/\s+/).filter(Boolean);

  const scored = searchIndex
    .map((item) => {
      const haystack = [
        norm(item.title),
        norm(item.description),
        ...(item.keywords || []).map(norm),
        norm(item.group)
      ];

      let score = 0;
      for (const term of terms) {
        let termHit = 0;
        if (haystack[0].startsWith(term)) termHit += 5;
        if (haystack[0].includes(term)) termHit += 3;
        if (haystack[1].includes(term)) termHit += 1;
        for (let i = 2; i < haystack.length; i++) {
          if (haystack[i].includes(term)) termHit += 2;
        }
        if (termHit === 0) return null;
        score += termHit;
      }
      return { item, score };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.item);

  return scored;
}
