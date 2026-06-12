-- Verse: Google Photos Picker integration
-- Run via: supabase db push

-- OAuth tokens per user (server-side only, never exposed to client)
create table public.google_photos_tokens (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid not null references public.profiles(id) on delete cascade unique,
  access_token   text not null,
  refresh_token  text,
  expires_at     timestamptz not null,
  scope          text not null,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

alter table public.google_photos_tokens enable row level security;

-- Users may only read/write their own token row
create policy "Users manage own google tokens"
  on public.google_photos_tokens for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Automatically update updated_at on changes
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger google_photos_tokens_updated_at
  before update on public.google_photos_tokens
  for each row execute procedure public.set_updated_at();

-- ────────────────────────────────────────────────────────────────────
-- Duplicate prevention: one fingerprint row per (world, media item)
-- ────────────────────────────────────────────────────────────────────
create table public.media_fingerprints (
  id                    uuid primary key default uuid_generate_v4(),
  world_id              uuid not null references public.worlds(id) on delete cascade,
  user_id               uuid not null references public.profiles(id) on delete cascade,
  -- Google Photos stable media item ID (present for Picker imports)
  google_media_item_id  text,
  -- SHA-256 content hash (used for direct file uploads, future-proof)
  sha256                text,
  -- Back-link to the created memory (nullable in case memory was deleted)
  memory_id             uuid references public.memories(id) on delete set null,
  imported_at           timestamptz not null default now(),
  -- Enforce uniqueness per world
  unique (world_id, google_media_item_id),
  unique (world_id, sha256)
);

create index media_fingerprints_world_idx on public.media_fingerprints(world_id);
create index media_fingerprints_google_id_idx on public.media_fingerprints(google_media_item_id);

alter table public.media_fingerprints enable row level security;

-- World members (owner/member roles) can manage fingerprints in their world
create policy "World members manage fingerprints"
  on public.media_fingerprints for all
  using (
    exists (
      select 1 from public.world_members wm
      where wm.world_id = media_fingerprints.world_id
        and wm.user_id = auth.uid()
        and wm.role in ('owner', 'member')
    )
  )
  with check (
    exists (
      select 1 from public.world_members wm
      where wm.world_id = media_fingerprints.world_id
        and wm.user_id = auth.uid()
        and wm.role in ('owner', 'member')
    )
  );
