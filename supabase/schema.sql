-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Members table
create table public.members (
  id              uuid primary key default uuid_generate_v4(),
  nama_lengkap    text not null,
  alamat          text not null,
  nomor_telepon   text not null,
  email           text unique not null,
  wilayah         text not null,
  tanggal_lahir   date not null,
  unique_number   text unique not null,
  created_at      timestamptz default now()
);

-- Enable Row Level Security
alter table public.members enable row level security;

-- Allow insert for everyone (registration happens before auth session exists)
create policy "Allow insert on registration"
  on public.members for select
  using (true);

create policy "Allow public insert"
  on public.members for insert
  with check (true);

-- Authenticated users can read their own row (matched by email from JWT)
create policy "Users can read own data"
  on public.members for select
  using (auth.jwt() ->> 'email' = email);
