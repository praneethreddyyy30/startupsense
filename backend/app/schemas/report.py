from typing import List, Dict, Any, Optional, Literal
from pydantic import BaseModel, Field, ConfigDict, AliasChoices
from .idea import StartupIdeaInput

class BaseSchema(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

class ScorecardMetrics(BaseSchema):
    marketDemand: int = Field(..., validation_alias=AliasChoices("marketDemand", "market_demand"), ge=0, le=100)
    painSeverity: int = Field(..., validation_alias=AliasChoices("painSeverity", "pain_severity"), ge=0, le=100)
    techFeasibility: int = Field(..., validation_alias=AliasChoices("techFeasibility", "tech_feasibility"), ge=0, le=100)
    competitionGap: int = Field(..., validation_alias=AliasChoices("competitionGap", "competition_gap"), ge=0, le=100)
    monetizationPotential: int = Field(..., validation_alias=AliasChoices("monetizationPotential", "monetization_potential"), ge=0, le=100)

class IdeaUnderstanding(BaseSchema):
    industry: str
    primaryKeywords: List[str] = Field(default_factory=list, validation_alias=AliasChoices("primaryKeywords", "primary_keywords"))
    secondaryKeywords: List[str] = Field(default_factory=list, validation_alias=AliasChoices("secondaryKeywords", "secondary_keywords"))
    targetAudienceSegments: List[str] = Field(default_factory=list, validation_alias=AliasChoices("targetAudienceSegments", "target_audience_segments"))
    coreValueProp: str = Field(..., validation_alias=AliasChoices("coreValueProp", "core_value_prop"))
    domainCategory: str = Field(..., validation_alias=AliasChoices("domainCategory", "domain_category"))

class PainPoint(BaseSchema):
    painPoint: str = Field(..., validation_alias=AliasChoices("painPoint", "pain_point"))
    severity: Literal["Critical", "High", "Medium", "Low"]
    frequency: str
    sentimentScore: float = Field(..., validation_alias=AliasChoices("sentimentScore", "sentiment_score"))
    contextQuote: str = Field(..., validation_alias=AliasChoices("contextQuote", "context_quote"))
    subreddit: Optional[str] = None
    url: Optional[str] = None

class TechLibrary(BaseSchema):
    name: str
    stars: int
    url: str
    description: str

class TechnicalEcosystem(BaseSchema):
    feasibilityScore: int = Field(..., validation_alias=AliasChoices("feasibilityScore", "feasibility_score"), ge=0, le=100)
    recommendedStack: List[str] = Field(default_factory=list, validation_alias=AliasChoices("recommendedStack", "recommended_stack"))
    mvpDevWeeksEstimate: int = Field(..., validation_alias=AliasChoices("mvpDevWeeksEstimate", "mvp_dev_weeks_estimate"))
    openSourceLibraries: List[TechLibrary] = Field(default_factory=list, validation_alias=AliasChoices("openSourceLibraries", "open_source_libraries"))
    architecturePattern: str = Field(..., validation_alias=AliasChoices("architecturePattern", "architecture_pattern"))
    keyEngineeringRisks: List[str] = Field(default_factory=list, validation_alias=AliasChoices("keyEngineeringRisks", "key_engineering_risks"))

class DirectCompetitor(BaseSchema):
    name: str
    strengths: List[str] = Field(default_factory=list)
    weaknesses: List[str] = Field(default_factory=list)
    pricingModel: str = Field(..., validation_alias=AliasChoices("pricingModel", "pricing_model"))
    estimatedUsersOrRevenue: str = Field(..., validation_alias=AliasChoices("estimatedUsersOrRevenue", "estimated_users_or_revenue"))

class CompetitorDiscovery(BaseSchema):
    directCompetitors: List[DirectCompetitor] = Field(default_factory=list, validation_alias=AliasChoices("directCompetitors", "direct_competitors"))
    saturationLevel: Literal["Low", "Moderate", "High", "Extreme"] = Field(..., validation_alias=AliasChoices("saturationLevel", "saturation_level"))
    blueOceanGap: str = Field(..., validation_alias=AliasChoices("blueOceanGap", "blue_ocean_gap"))
    pricingLandscape: str = Field(..., validation_alias=AliasChoices("pricingLandscape", "pricing_landscape"))

class DomainSuggestion(BaseSchema):
    domain: str
    available: bool
    tld: str
    purchaseUrgency: str = Field(..., validation_alias=AliasChoices("purchaseUrgency", "purchase_urgency"))
    estimatedCost: str = Field(..., validation_alias=AliasChoices("estimatedCost", "estimated_cost"))

class MvpRoadmapItem(BaseSchema):
    id: str
    name: str
    priority: Literal["MUST_HAVE", "SHOULD_HAVE", "COULD_HAVE"]
    description: str
    estimatedDays: int = Field(..., validation_alias=AliasChoices("estimatedDays", "estimated_days"))
    complexity: Literal["Easy", "Medium", "Hard"]

class EvidenceItem(BaseSchema):
    id: str
    source: Literal["google_trends", "reddit", "hacker_news", "github", "competitor", "product_hunt", "indie_hackers"]
    title: str
    snippet: str
    quoteOrStat: str = Field(..., validation_alias=AliasChoices("quoteOrStat", "quote_or_stat"))
    relevanceScore: int = Field(..., validation_alias=AliasChoices("relevanceScore", "relevance_score"))
    sentiment: Literal["positive", "neutral", "negative"]
    dateCollected: str = Field(..., validation_alias=AliasChoices("dateCollected", "date_collected"))
    url: Optional[str] = None

class GoNoGoReasoning(BaseSchema):
    verdict: str
    keyFactorsForGo: List[str] = Field(default_factory=list, validation_alias=AliasChoices("keyFactorsForGo", "key_factors_for_go"))
    keyFactorsAgainst: List[str] = Field(default_factory=list, validation_alias=AliasChoices("keyFactorsAgainst", "key_factors_against"))
    recommendedPivot: Optional[str] = Field(None, validation_alias=AliasChoices("recommendedPivot", "recommended_pivot"))

class AgentAuditItem(BaseSchema):
    agentName: str = Field(..., validation_alias=AliasChoices("agentName", "agent_name"))
    role: str
    datasetProcessed: str = Field(..., validation_alias=AliasChoices("datasetProcessed", "dataset_processed"))
    status: Literal["Completed", "Processing", "Skipped"]

class CustomerInterviewScript(BaseSchema):
    introduction: str
    questions: List[str] = Field(default_factory=list)

class LandingPageCopy(BaseSchema):
    heroHeadline: str = Field(..., validation_alias=AliasChoices("heroHeadline", "hero_headline"))
    heroSubheadline: str = Field(..., validation_alias=AliasChoices("heroSubheadline", "hero_subheadline"))
    valueProp1: str = Field(..., validation_alias=AliasChoices("valueProp1", "value_prop_1"))
    valueProp2: str = Field(..., validation_alias=AliasChoices("valueProp2", "value_prop_2"))
    valueProp3: str = Field(..., validation_alias=AliasChoices("valueProp3", "value_prop_3"))
    ctaText: str = Field(..., validation_alias=AliasChoices("ctaText", "cta_text"))

class RegionalData(BaseSchema):
    region: str
    score: int

class SearchTimeData(BaseSchema):
    month: str
    interest: int

class RelatedQuery(BaseSchema):
    query: str
    growth: str

class GoogleTrendsData(BaseSchema):
    keyword: str
    overallInterestScore: int = Field(..., validation_alias=AliasChoices("overallInterestScore", "overall_interest_score"))
    velocityTrend: Literal["rising", "stable", "declining"] = Field(..., validation_alias=AliasChoices("velocityTrend", "velocity_trend"))
    growthRatePercent: int = Field(..., validation_alias=AliasChoices("growthRatePercent", "growth_rate_percent"))
    regionalBreakdown: List[RegionalData] = Field(default_factory=list, validation_alias=AliasChoices("regionalBreakdown", "regional_breakdown"))
    searchInterestOverTime: List[SearchTimeData] = Field(default_factory=list, validation_alias=AliasChoices("searchInterestOverTime", "search_interest_over_time"))
    topRelatedQueries: List[RelatedQuery] = Field(default_factory=list, validation_alias=AliasChoices("topRelatedQueries", "top_related_queries"))

class DemandAnalysis(BaseSchema):
    summary: str
    interestScore: int = Field(..., validation_alias=AliasChoices("interestScore", "interest_score"))
    growthVelocity: str = Field(..., validation_alias=AliasChoices("growthVelocity", "growth_velocity"))
    trendsData: GoogleTrendsData = Field(..., validation_alias=AliasChoices("trendsData", "trends_data"))

class ValidationReport(BaseSchema):
    id: str
    ideaInput: StartupIdeaInput = Field(..., validation_alias=AliasChoices("ideaInput", "idea_input"))
    createdAt: str = Field(..., validation_alias=AliasChoices("createdAt", "created_at"))
    quotaNotice: Optional[bool] = Field(False, validation_alias=AliasChoices("quotaNotice", "quota_notice"))
    recommendation: Literal["GO", "CONDITIONAL_GO", "PIVOT", "NO_GO"]
    validationScore: int = Field(..., validation_alias=AliasChoices("validationScore", "validation_score"), ge=0, le=100)
    confidenceScore: int = Field(..., validation_alias=AliasChoices("confidenceScore", "confidence_score"), ge=0, le=100)
    executiveSummary: str = Field(..., validation_alias=AliasChoices("executiveSummary", "executive_summary"))
    scores: ScorecardMetrics
    ideaUnderstanding: IdeaUnderstanding = Field(..., validation_alias=AliasChoices("ideaUnderstanding", "idea_understanding"))
    keyStrengths: List[str] = Field(default_factory=list, validation_alias=AliasChoices("keyStrengths", "key_strengths"))
    criticalRisksSummary: List[str] = Field(default_factory=list, validation_alias=AliasChoices("criticalRisksSummary", "critical_risks_summary"))
    demandAnalysis: DemandAnalysis = Field(..., validation_alias=AliasChoices("demandAnalysis", "demand_analysis"))
    customerPainPoints: List[PainPoint] = Field(default_factory=list, validation_alias=AliasChoices("customerPainPoints", "customer_pain_points"))
    technicalEcosystem: TechnicalEcosystem = Field(..., validation_alias=AliasChoices("technicalEcosystem", "technical_ecosystem"))
    competitorDiscovery: CompetitorDiscovery = Field(..., validation_alias=AliasChoices("competitorDiscovery", "competitor_discovery"))
    domainNameSuggestions: List[DomainSuggestion] = Field(default_factory=list, validation_alias=AliasChoices("domainNameSuggestions", "domain_name_suggestions"))
    mvpRoadmap: List[MvpRoadmapItem] = Field(default_factory=list, validation_alias=AliasChoices("mvpRoadmap", "mvp_roadmap"))
    evidenceList: List[EvidenceItem] = Field(default_factory=list, validation_alias=AliasChoices("evidenceList", "evidence_list"))
    goNoGoReasoning: GoNoGoReasoning = Field(..., validation_alias=AliasChoices("goNoGoReasoning", "go_no_go_reasoning"))
    agentAudit: List[AgentAuditItem] = Field(default_factory=list, validation_alias=AliasChoices("agentAudit", "agent_audit"))
    customerInterviewScript: CustomerInterviewScript = Field(..., validation_alias=AliasChoices("customerInterviewScript", "customer_interview_script"))
    landingPageCopy: LandingPageCopy = Field(..., validation_alias=AliasChoices("landingPageCopy", "landing_page_copy"))
