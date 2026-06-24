from supabase import create_client, Client
from ..config import settings

_client: Client | None = None


def get_supabase_sync() -> Client:
    global _client
    if _client is None:
        print(f"DEBUG supabase_url='{settings.supabase_url}'")
        print(f"DEBUG key_prefix='{settings.supabase_service_role_key[:20]}'")
        _client = create_client(
            settings.supabase_url,
            settings.supabase_service_role_key,
        )
    return _client
