create schema if not exists flip_me;

grant usage on schema flip_me to anon, authenticated;

create table if not exists flip_me.puzzles (
  id bigserial primary key,
  world text not null check (world in ('tron', 'honey')),
  level int not null check (level between 1 and 20),
  active_mask boolean[] not null,
  start_state text[] not null,
  taps_target int not null,
  created_at timestamptz not null default now(),
  unique (world, level)
);

alter table flip_me.puzzles enable row level security;

drop policy if exists "read puzzles" on flip_me.puzzles;
create policy "read puzzles" on flip_me.puzzles
  for select
  to authenticated
  using (true);

grant select on flip_me.puzzles to authenticated;
grant usage, select on sequence flip_me.puzzles_id_seq to authenticated;
