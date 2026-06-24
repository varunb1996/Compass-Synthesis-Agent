import logging
from typing import TypeVar

from pydantic import BaseModel

from ..services.groq_client import chat_completion_json

logger = logging.getLogger(__name__)

T = TypeVar("T", bound=BaseModel)


class BaseAgent:
    system_prompt: str = "You are a helpful expert."

    async def _call(
        self,
        user_message: str,
        response_model: type[T],
        extra_context: str = "",
        temperature: float = 0.3,
        max_tokens: int = 2048,
    ) -> T:
        messages = [{"role": "system", "content": self.system_prompt}]
        if extra_context:
            messages.append({"role": "user", "content": extra_context})
        messages.append({"role": "user", "content": user_message})

        logger.debug("[%s] calling Groq", self.__class__.__name__)
        result = await chat_completion_json(
            messages=messages,
            response_model=response_model,
            temperature=temperature,
            max_tokens=max_tokens,
        )
        logger.debug("[%s] done", self.__class__.__name__)
        return result
