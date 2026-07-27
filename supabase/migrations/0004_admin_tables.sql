-- Admin/workflow tables (TRD section 4.3).

create table discipline_requests (
  id uuid primary key default gen_random_uuid(),
  requested_name text not null,
  requested_by uuid not null references auth.users(id),
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  notes text,
  created_at timestamptz not null default now()
);

create index idx_discipline_requests_requested_by
  on discipline_requests(requested_by);
