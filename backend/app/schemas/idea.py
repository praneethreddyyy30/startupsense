from typing import List, Optional
from pydantic import BaseModel, Field, AliasChoices

class StartupIdeaInput(BaseModel):
    title: str = Field(..., description="Startup idea name or core concept")
    description: str = Field(..., description="Detailed description of problem, solution, and value prop")
    industry: Optional[str] = Field("Tech / B2B SaaS", description="Target industry vertical")
    targetAudience: Optional[str] = Field(
        default="General",
        validation_alias=AliasChoices("targetAudience", "target_audience"),
        description="Target customer segment"
    )
    problemStatement: Optional[str] = Field(
        default="",
        validation_alias=AliasChoices("problemStatement", "problem_statement"),
        description="Specific customer pain point"
    )
    monetizationModel: Optional[str] = Field(
        default="Subscription / B2B SaaS",
        validation_alias=AliasChoices("monetizationModel", "monetization_model"),
        description="Monetization model"
    )
    keywords: Optional[List[str]] = Field(default_factory=list, description="Extracted or user-specified search keywords")

    class Config:
        populate_by_name = True
