-- Verse: emotional memory platform schema
-- Run via Supabase CLI: supabase db push

-- Extensions
create extension if not exists "uuid-ossp";

-- Profiles (extends auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  stripe_customer_id text unique,
  plan text not null default 'free' check (plan in ('free', 'keeper', 'legacy')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Memory worlds (private cinematic spaces)
create table public.worlds (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  name text not null,
  tagline text,
  cover_image_url text,
  type text not null default 'couple' check (type in ('couple', 'family', 'individual')),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.world_members (
  id uuid primary key default uuid_generate_v4(),
  world_id uuid not null references public.worlds(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'member', 'viewer')),
  created_at timestamptz not null default now(),
  unique (world_id, user_id)
);

-- Individual memories
create table public.memories (
  id uuid primary key default uuid_generate_v4(),
  world_id uuid not null references public.worlds(id) on delete cascade,
  title text not null,
  occurred_at timestamptz not null,
  location text,
  mood text not null default 'tender',
  caption text,
  media jsonb not null default '[]'::jsonb,
  story jsonb,
  voice_note_url text,
  music_track text,
  is_highlight boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index memories_world_id_idx on public.memories(world_id);
create index memories_occurred_at_idx on public.memories(occurred_at desc);

-- Timeline chapters (editorial narrative structure)
create table public.timeline_chapters (
  id uuid primary key default uuid_generate_v4(),
  world_id uuid not null references public.worlds(id) on delete cascade,
  title text not null,
  subtitle text,
  start_date date not null,
  end_date date,
  memory_ids uuid[] not null default '{}',
  cover_memory_id uuid references public.memories(id) on delete set null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Anniversary films (Remotion renders)
create table public.anniversary_films (
  id uuid primary key default uuid_generate_v4(),
  world_id uuid not null references public.worlds(id) on delete cascade,
  title text not null,
  status text not null default 'draft' check (status in ('draft', 'rendering', 'ready', 'failed')),
  preview_url text,
  remotion_render_id text,
  duration_seconds int,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Memory recaps (AI-generated period summaries)
create table public.memory_recaps (
  id uuid primary key default uuid_generate_v4(),
  world_id uuid not null references public.worlds(id) on delete cascade,
  period text not null check (period in ('week', 'month', 'year', 'season')),
  title text not null,
  story text not null,
  memory_ids uuid[] not null default '{}',
  generated_at timestamptz not null default now()
);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.worlds enable row level security;
alter table public.world_members enable row level security;
alter table public.memories enable row level security;
alter table public.timeline_chapters enable row level security;
alter table public.anniversary_films enable row level security;
alter table public.memory_recaps enable row level security;

-- Profiles: users read/update own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Worlds: members can view; owners can manage
create policy "World members can view worlds"
  on public.worlds for select
  using (
    exists (
      select 1 from public.world_members wm
      where wm.world_id = worlds.id and wm.user_id = auth.uid()
    )
  );

create policy "Owners can insert worlds"
  on public.worlds for insert
  with check (auth.uid() = owner_id);

create policy "Owners can update worlds"
  on public.worlds for update
  using (auth.uid() = owner_id);

-- Memories: world members only
create policy "World members can view memories"
  on public.memories for select
  using (
    exists (
      select 1 from public.world_members wm
      where wm.world_id = memories.world_id and wm.user_id = auth.uid()
    )
  );

create policy "World members can manage memories"
  on public.memories for all
  using (
    exists (
      select 1 from public.world_members wm
      where wm.world_id = memories.world_id
        and wm.user_id = auth.uid()
        and wm.role in ('owner', 'member')
    )
  );

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
