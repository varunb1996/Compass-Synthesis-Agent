const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export async function* streamCompass(
  message: string,
  sessionId: string
): AsyncGenerator<Record<string, unknown>> {
  const res = await fetch(`${API_URL}/api/compass`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, session_id: sessionId }),
  });

  if (!res.ok || !res.body) {
    throw new Error(`API error ${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        try {
          yield JSON.parse(line.slice(6));
        } catch {
          // skip malformed lines
        }
      }
    }
  }
}

export async function toggleActionItem(
  itemId: string,
  completed: boolean
): Promise<void> {
  await fetch(`${API_URL}/api/plans/items/${itemId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed }),
  });
}
