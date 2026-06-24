from enum import StrEnum
from pydantic import BaseModel, Field


class Domain(StrEnum):
    HEALTH = "health"
    FINANCE = "finance"
    LEGAL = "legal"
    CAREER = "career"
    HOME = "home"
    GOVERNMENT = "government"
    FAMILY = "family"


class Urgency(StrEnum):
    CRITICAL = "critical"    # needs action today
    HIGH = "high"            # needs action this week
    MEDIUM = "medium"        # this month
    LOW = "low"              # whenever


class SubProblem(BaseModel):
    domain: Domain
    summary: str = Field(description="One-sentence summary of the domain-specific issue")
    key_questions: list[str] = Field(
        description="Specific questions this domain agent should answer",
        max_length=4,
    )


class Problem(BaseModel):
    raw_input: str
    title: str = Field(description="Short title for this situation (max 10 words)")
    summary: str = Field(description="Neutral 2-sentence summary of the situation")
    domains: list[Domain] = Field(description="Domains involved, ordered by relevance")
    subproblems: list[SubProblem]
    urgency: Urgency
    missing_info: list[str] = Field(
        description="Key facts not provided that would change the advice",
        default_factory=list,
    )
    life_context_used: dict[str, str] = Field(
        description="Facts from past sessions that were injected into this analysis",
        default_factory=dict,
    )
