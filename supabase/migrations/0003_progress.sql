create table if not exists flip_me.progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  world text not null check (world in ('tron', 'honey')),
  level int not null check (level between 1 and 20),
  taps_used int not null,
  best_taps_used int not null,
  first_completed_at timestamptz not null default now(),
  last_completed_at timestamptz not null default now(),
  primary key (user_id, world, level)
);

alter table flip_me.progress enable row level security;

drop policy if exists "users read own progress" on flip_me.progress;
create policy "users read own progress" on flip_me.progress
  for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "users insert own progress" on flip_me.progress;
create policy "users insert own progress" on flip_me.progress
  for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "users update own progress" on flip_me.progress;
create policy "users update own progress" on flip_me.progress
  for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select, insert, update on flip_me.progress to authenticated;
