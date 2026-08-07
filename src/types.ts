export type RecommendationStatus = 'GO' | 'CONDITIONAL_GO' | 'PIVOT' | 'NO_GO';

export type EvidenceSource = 'google_trends' | 'reddit' | 'github' | 'competitor' | 'web_search';

export interface StartupIdeaInput {
  title: string;
  description: string;
  targetAudience: string;
  industry: string;
  problemStatement?: string;
  monetizationModel?: string;
  keywords?: string[];
}

export interface IdeaUnderstanding {
  industry: string;
  primaryKeywords: string[];
  secondaryKeywords: string[];
  targetAudienceSegments: string[];
  coreValueProp: string;
  domainCategory: string;
}

export interface GoogleTrendsData {
  keyword: string;
  overallInterestScore: number; // 0-100
  velocityTrend: 'rising' | 'stable' | 'declining';
  growthRatePercent: number;
  regionalBreakdown: Array<{ region: string; score: number }>;
  searchInterestOverTime: Array<{ month: string; interest: number }>;
  topRelatedQueries: Array<{ query: string; growth: string }>;
}

export interface PainPointItem {
  id: string;
  title: string;
  subredditOrForum: string;
  severity: 'CRITICAL' | 'MODERATE' | 'MILD';
  userQuote: string;
  frequencyScore: number; // 0-100
  sentiment: 'Frustrated' | 'Seeking Solution' | 'Dissatisfied with Alternatives';
}

export interface RedditInsightData {
  targetSubreddits: string[];
  overallSentimentScore: number; // -1.0 to 1.0
  painPoints: PainPointItem[];
  userDesires: string[];
  communityVolume: string;
}

export interface GitHubRepoItem {
  name: string;
  stars: number;
  forks: number;
  description: string;
  language: string;
  lastUpdated: string;
  url: string;
}

export interface GitHubEcosystemData {
  relevantRepositories: GitHubRepoItem[];
  libraryMaturity: 'High' | 'Moderate' | 'Emerging' | 'Low';
  ecosystemVelocity: 'Rapid Growth' | 'Stable' | 'Nascent';
  technicalFeasibilityScore: number; // 0-100
  estimatedDevTimeWeeks: number;
  recommendedTechStack: string[];
}

export interface CompetitorItem {
  name: string;
  url?: string;
  pricingModel: string;
  keyFeatures: string[];
  strengths: string[];
  weaknesses: string[];
  marketShareEstimate: string;
}

export interface CompetitorData {
  directCompetitors: CompetitorItem[];
  indirectCompetitors: Array<{ name: string; description: string }>;
  marketSaturation: 'High' | 'Moderate' | 'Low';
  gapOpportunity: string;
}

export interface EvidenceItem {
  id: string;
  source: EvidenceSource;
  title: string;
  snippet: string;
  quoteOrStat: string;
  urlOrRef?: string;
  relevanceScore: number; // 1-100
  sentiment: 'positive' | 'negative' | 'neutral';
  dateCollected: string;
}

export interface RiskItem {
  id: string;
  category: 'Market' | 'Technical' | 'Financial' | 'Regulatory' | 'Execution';
  riskTitle: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  impactDescription: string;
  mitigationStrategy: string;
}

export interface MVPFeature {
  id: string;
  name: string;
  priority: 'MUST_HAVE' | 'SHOULD_HAVE' | 'COULD_HAVE';
  description: string;
  estimatedDays: number;
  complexity: 'Easy' | 'Medium' | 'Hard';
}

export interface ValidationReport {
  id: string;
  ideaInput: StartupIdeaInput;
  createdAt: string;
  ideaUnderstanding: IdeaUnderstanding;
  
  // Executive Decision
  recommendation: RecommendationStatus;
  validationScore: number; // 0-100
  confidenceScore: number; // 0-100
  executiveSummary: string;
  
  // Dimension Scores
  scores: {
    marketDemand: number;
    painSeverity: number;
    techFeasibility: number;
    competitionGap: number;
    monetizationPotential: number;
  };

  keyStrengths: string[];
  criticalRisksSummary: string[];
  
  // Detailed Sections
  demandAnalysis: {
    summary: string;
    interestScore: number;
    growthVelocity: string;
    trendsData: GoogleTrendsData;
  };

  customerPainPoints: {
    summary: string;
    severityScore: number;
    insights: RedditInsightData;
  };

  technicalEcosystem: {
    summary: string;
    feasibilityScore: number;
    insights: GitHubEcosystemData;
  };

  competitorLandscape: {
    summary: string;
    saturationLevel: string;
    competitors: CompetitorData;
  };

  marketOpportunity: {
    tamEstimate: string;
    samEstimate: string;
    somEstimate: string;
    targetPersona: string;
    marketDrivers: string[];
  };

  riskAssessment: RiskItem[];
  mvpFeatures: MVPFeature[];
  evidenceList: EvidenceItem[];
  quotaNotice?: boolean;
  
  goNoGoReasoning: {
    verdict: string;
    keyFactorsForGo: string[];
    keyFactorsAgainst: string[];
    recommendedPivot?: string;
  };
  
  hackerNewsAnalysis?: {
    summary: string;
    posts: Array<{
      title: string;
      points: number;
      commentsCount: number;
      url: string;
    }>;
  };
  domainAvailability?: Array<{
    domain: string;
    available: boolean;
  }>;
  agentAudit?: Array<{
    agentName: string;
    role: string;
    datasetProcessed: string;
    status: string;
  }>;
  googleAutocompleteSuggestions?: string[];
}

export interface SavedReportSummary {
  id: string;
  title: string;
  industry: string;
  recommendation: RecommendationStatus;
  validationScore: number;
  createdAt: string;
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
