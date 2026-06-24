from pydantic import BaseModel, Field


class ActionItem(BaseModel):
    title: str = Field(description="Short imperative action (max 12 words)")
    description: str = Field(description="1-2 sentence explanation with specifics")
    confidence: float = Field(ge=0.0, le=1.0)
    source_hint: str | None = None


class DomainOutput(BaseModel):
    domain: str = Field(description="One of: health, finance, legal, career, home, government, family")
    headline: str
    items: list[ActionItem] = Field(min_length=1, max_length=6)
    escalate: bool
    escalation_reason: str | None = None
    conflicts_with: list[str] = Field(default_factory=list)


class AgentEvent(BaseModel):
    event: str
    domain: str | None = None
    data: dict = Field(default_factory=dict)
