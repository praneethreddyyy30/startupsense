import { StartupIdeaInput } from '../types';

export interface SampleIdeaPreset extends StartupIdeaInput {
  id: string;
  badge: string;
  tagline: string;
}

export const SAMPLE_IDEAS: SampleIdeaPreset[] = [
  {
    id: 'legal-ai-smb',
    badge: 'AI & LegalTech',
    tagline: 'Instant risk extraction and contract plain-English translation for non-lawyers',
    title: 'LexiGuard AI: Contract Risk Auditor for SMBs',
    description: 'An AI-powered web app that scans commercial vendor contracts, lease agreements, and NDAs, highlighting high-risk clauses (unlimited liability, hidden auto-renewals, non-competes) and explaining them in plain English with actionable counter-proposal wording.',
    targetAudience: 'Small business owners, freelance agency directors, non-tech founders, and solo contractors without in-house legal counsel.',
    industry: 'LegalTech & AI Software',
    problemStatement: 'Small business owners sign vendor and client contracts without understanding legal jargon because real lawyers charge $400+/hour, leaving businesses vulnerable to predatory terms and hidden liabilities.',
    monetizationModel: '$49/month subscription for up to 15 contract scans/month or $19 pay-per-contract scan.',
    keywords: ['contract analysis AI', 'legal risk scanner', 'small business legal software', 'NDA analyzer']
  },
  {
    id: 'code-audit-saas',
    badge: 'Developer Tools & Security',
    tagline: 'Continuous dependency & license compliance auditor for GitHub/GitLab',
    title: 'AuditFlow: Automated Micro-SaaS License & CVE Auditor',
    description: 'A GitHub App that runs on every pull request to identify copyleft license conflicts (AGPL/GPL), outdated open-source dependencies, supply-chain vulnerabilities, and hardcoded API secrets before code reaches production.',
    targetAudience: 'Software engineering leads, indie hackers, CTOs of seed-stage startups, and open-source project maintainers.',
    industry: 'Developer Tools & Cybersecurity',
    problemStatement: 'Startups inadvertently import viral AGPL dependencies or vulnerable NPM packages that trigger legal liability or security breaches right before acquisition due diligence.',
    monetizationModel: 'Freemium for public repos; $29/developer/month for private repos.',
    keywords: ['github license scanner', 'dependency security audit', 'SaaS compliance tool', 'AGPL checker']
  },
  {
    id: 'food-waste-b2b',
    badge: 'CleanTech & Supply Chain',
    tagline: 'Predictive B2B surplus produce marketplace connecting farms with local kitchens',
    title: 'HarvestPulse: B2B Surplus Food Marketplace & Demand Predictor',
    description: 'A mobile & web platform matching regional farms with surplus, ugly, or short-dated produce directly to commercial kitchens, caterers, and food processors at a 40% discount, using predictive weather/demand algorithms.',
    targetAudience: 'Local organic farmers, head chefs at restaurants, catering companies, and food bank logistics directors.',
    industry: 'AgriTech & Food Logistics',
    problemStatement: 'Up to 30% of harvested produce is discarded at the farm gate due to cosmetic flaws or oversupply, while local restaurants suffer from rising wholesale food prices.',
    monetizationModel: '12% marketplace commission per transaction + monthly tier for farm inventory software.',
    keywords: ['surplus food marketplace', 'B2B food waste', 'farm to kitchen supply chain', 'restaurant wholesale']
  },
  {
    id: 'burnout-analytics',
    badge: 'HRTech & Enterprise AI',
    tagline: 'Privacy-first Slack/Teams burnout risk sensor for remote software teams',
    title: 'PulseMind: Privacy-First Remote Team Burnout Sensor',
    description: 'An organizational health tool that analyzes aggregated, anonymized Slack/Teams activity metrics (after-hours messaging patterns, meeting density, PR review turnaround delays) to alert managers of team burnout risks without reading message content.',
    targetAudience: 'Engineering managers, VP of People, remote team leads at medium-sized tech companies.',
    industry: 'HR Tech & Workplace Analytics',
    problemStatement: 'Remote tech workers experience silent burnout, leading to unexpected resignations and multi-month hiring delays. Current pulse surveys have low response rates and delayed feedback loops.',
    monetizationModel: '$6 per active user seat per month.',
    keywords: ['remote team burnout', 'slack sentiment analytics', 'engineering manager tools', 'employee retention AI']
  },
  {
    id: 'solar-drone-ai',
    badge: 'Robotics & Computer Vision',
    tagline: 'Autonomous drone thermal scan analyzer for commercial solar farm maintenance',
    title: 'HelioScan AI: Automated Solar Farm Defect Detection',
    description: 'A cloud software pipeline where drone pilots upload thermal drone imagery of solar arrays. AI automatically detects cracked panels, inverter hotspots, and debris degradation, outputting geopointed repair work orders.',
    targetAudience: 'Solar O&M (Operations & Maintenance) field companies, commercial solar farm operators, and drone service providers.',
    industry: 'Renewable Energy & Drone Inspection',
    problemStatement: 'Manual thermal inspections of 50MW+ solar farms require inspecting thousands of panels manually, taking weeks and leaving sub-optimal energy output undetected.',
    monetizationModel: '$1.50 per megawatt scanned or $499 per solar farm audit report.',
    keywords: ['solar farm inspection drone', 'thermal image AI defect detection', 'solar array maintenance', 'drone aerial analytics']
  }
];
