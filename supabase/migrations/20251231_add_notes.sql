create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  title text not null,
  body text not null,
  scheduled_for date,
  created_at timestamptz not null default now()
);

create index if not exists notes_user_id_idx on notes(user_id);
create index if not exists notes_scheduled_for_idx on notes(scheduled_for);