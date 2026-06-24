import json
import logging
from typing import Any, TypeVar

from groq import AsyncGroq, RateLimitError, APIStatusError
from pydantic import BaseModel
from tenacity import (
    retry,
    stop_after_attempt,
    wait_exponential,
    retry_if_exception_type,
)

from ..config import settings

logger = logging.getLogger(__name__)

T = TypeVar("T", bound=BaseModel)

_client: AsyncGroq | None = None


def get_groq_client() -> AsyncGroq:
    global _client
    if _client is None:
        _client = AsyncGroq(api_key=settings.groq_api_key)
    return _client


@retry(
    retry=retry_if_exception_type(RateLimitError),
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10),
)
async def chat_completion_json(
    messages: list[dict[str, str]],
    response_model: type[T],
    temperature: float = 0.3,
    max_tokens: int = 2048,
) -> T:
    """
    Call Groq with JSON mode and parse the response into a Pydantic model.
    Retries on rate limits with exponential backoff.
    """
    client = get_groq_client()

    schema_hint = json.dumps(response_model.model_json_schema(), indent=2)
    system_injection = (
        f"\nRespond ONLY with valid JSON matching this schema:\n{schema_hint}"
    )

    augmented = list(messages)
    if augmented and augmented[0]["role"] == "system":
        augmented[0] = {
            "role": "system",
            "content": augmented[0]["content"] + system_injection,
        }
    else:
        augmented.insert(0, {"role": "system", "content": system_injection.strip()})

    response = await client.chat.completions.create(
        model=settings.groq_model,
        messages=augmented,  # type: ignore[arg-type]
        temperature=temperature,
        max_tokens=max_tokens,
        response_format={"type": "json_object"},
    )

    raw = response.choices[0].message.content or "{}"
    try:
        data: Any = json.loads(raw)
        return response_model.model_validate(data)
    except Exception as exc:
        logger.error("Failed to parse Groq response: %s\nRaw: %s", exc, raw[:500])
        raise
