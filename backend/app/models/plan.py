from pydantic import BaseModel, Field


class PlanItem(BaseModel):
    id: str = Field(description="Stable slug e.g. 'health-001'")
    domain: str = Field(description="One of: health, finance, legal, career, home, government, family")
    priority: str = Field(description="One of: IMMEDIATE, THIS_WEEK, THIS_MONTH")
    title: str
    description: str
    confidence: float = Field(ge=0.0, le=1.0)
    source_hint: str | None = None
    completed: bool = False


class Conflict(BaseModel):
    domains: list[str]
    description: str
    resolution: str


class ActionPlan(BaseModel):
    session_id: str
    conversation_id: str
    headline: str
    items: list[PlanItem]
    conflicts_resolved: list[Conflict] = Field(default_factory=list)
    escalations: list[str] = Field(default_factory=list)
    missing_info_reminder: list[str] = Field(default_factory=list)
