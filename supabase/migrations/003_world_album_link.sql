-- Album linking: store which Google Photos album is linked to a world
-- This uses the Google Photos Library API (photoslibrary.readonly scope)

alter table public.worlds
  add column if not exists linked_album_id   text,       -- Google Photos album ID
  add column if not exists linked_album_name text,       -- Display name (cached)
  add column if not exists album_last_synced timestamptz; -- Last time we pulled fresh photos

-- Index for quick album lookups
create index if not exists worlds_linked_album_idx on public.worlds(linked_album_id)
  where linked_album_id is not null;
