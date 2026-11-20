-- Barqyar Smart Price Updates: additive schema only; shop_products is not altered.
create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net;
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to service_role;

create table if not exists public.shop_price_update_runs (
 id uuid primary key default gen_random_uuid(),
 trigger_type text not null check(trigger_type in ('manual','cron')),
 status text not null default 'running' check(status in ('running','completed','failed')),
 product_count integer not null default 0 check(product_count>=0),
 candidate_count integer not null default 0 check(candidate_count>=0),
 error_message text, started_at timestamptz not null default now(),
 completed_at timestamptz, created_at timestamptz not null default now()
);
create table if not exists public.shop_price_candidates (
 id uuid primary key default gen_random_uuid(),
 run_id uuid not null references public.shop_price_update_runs(id) on delete cascade,
 product_id bigint references public.shop_products(id) on delete set null,
 product_sku text not null, product_name text not null, category text, unit text not null,
 currency text not null default 'TOMAN' check(currency='TOMAN'),
 current_price numeric(18,2) not null check(current_price>=0),
 wholesale_price numeric(18,2) check(wholesale_price is null or wholesale_price>=0),
 retail_price numeric(18,2) check(retail_price is null or retail_price>=0),
 suggested_price numeric(18,2) check(suggested_price is null or suggested_price>=0),
 match_confidence numeric(4,3) not null default 0 check(match_confidence between 0 and 1),
 unit_match boolean not null default false,
 match_status text not null default 'not_found' check(match_status in ('verified','partial','ambiguous','not_found')),
 notes text, sources jsonb not null default '[]'::jsonb check(jsonb_typeof(sources)='array'),
 status text not null default 'pending' check(status in ('pending','approved','rejected')),
 approved_price numeric(18,2) check(approved_price is null or approved_price>=0),
 reviewed_by text, reviewed_at timestamptz,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 unique(run_id,product_sku)
);
create index if not exists shop_price_runs_created_idx on public.shop_price_update_runs(created_at desc);
create index if not exists shop_price_candidates_status_idx on public.shop_price_candidates(status,created_at desc);
create index if not exists shop_price_candidates_run_idx on public.shop_price_candidates(run_id,product_sku);
alter table public.shop_price_update_runs enable row level security;
alter table public.shop_price_candidates enable row level security;
revoke all on public.shop_price_update_runs from public,anon,authenticated;
revoke all on public.shop_price_candidates from public,anon,authenticated;
grant select on public.shop_price_update_runs to authenticated;
grant select on public.shop_price_candidates to authenticated;
grant all on public.shop_price_update_runs to service_role;
grant all on public.shop_price_candidates to service_role;
drop policy if exists shop_price_runs_admin_read on public.shop_price_update_runs;
create policy shop_price_runs_admin_read on public.shop_price_update_runs for select to authenticated using((select auth.uid()) is not null and public.shop_is_admin());
drop policy if exists shop_price_candidates_admin_read on public.shop_price_candidates;
create policy shop_price_candidates_admin_read on public.shop_price_candidates for select to authenticated using((select auth.uid()) is not null and public.shop_is_admin());
drop policy if exists shop_price_candidates_admin_update on public.shop_price_candidates;
create policy shop_price_candidates_admin_update on public.shop_price_candidates for update to authenticated using((select auth.uid()) is not null and public.shop_is_admin()) with check((select auth.uid()) is not null and public.shop_is_admin());
grant update(status,approved_price,reviewed_by,reviewed_at,updated_at) on public.shop_price_candidates to authenticated;

create or replace function public.shop_admin_review_price_candidate(p_candidate_id uuid,p_action text,p_final_price numeric default null)
returns jsonb language plpgsql security invoker set search_path=''
as $$
declare v_candidate public.shop_price_candidates%rowtype; v_email text; v_updated_id bigint;
begin
 if auth.uid() is null or not public.shop_is_admin() then raise exception 'admin access required' using errcode='42501'; end if;
 if p_action not in ('approve','reject') then raise exception 'invalid review action'; end if;
 select * into v_candidate from public.shop_price_candidates where id=p_candidate_id for update;
 if not found then raise exception 'price candidate not found'; end if;
 if v_candidate.status<>'pending' then raise exception 'candidate already reviewed'; end if;
 v_email:=coalesce(auth.jwt()->>'email','admin');
 if p_action='reject' then
  update public.shop_price_candidates set status='rejected',reviewed_by=v_email,reviewed_at=now(),updated_at=now() where id=p_candidate_id;
  return jsonb_build_object('ok',true,'status','rejected');
 end if;
 if p_final_price is null or p_final_price<=0 then raise exception 'enter final price greater than zero'; end if;
 if v_candidate.match_status<>'verified' or v_candidate.match_confidence<0.700 or not v_candidate.unit_match or jsonb_array_length(v_candidate.sources)<1 then
  raise exception 'candidate is not eligible for approval; verify product, unit and source first';
 end if;
 update public.shop_products set price=p_final_price,updated_at=now()
  where id=v_candidate.product_id and sku=v_candidate.product_sku returning id into v_updated_id;
 if v_updated_id is null then raise exception 'product no longer exists or SKU mismatch'; end if;
 update public.shop_price_candidates set status='approved',approved_price=p_final_price,reviewed_by=v_email,reviewed_at=now(),updated_at=now() where id=p_candidate_id;
 return jsonb_build_object('ok',true,'status','approved','product_id',v_updated_id,'sku',v_candidate.product_sku,'approved_price',p_final_price);
end; $$;
revoke all on function public.shop_admin_review_price_candidate(uuid,text,numeric) from public,anon;
grant execute on function public.shop_admin_review_price_candidate(uuid,text,numeric) to authenticated;

create table if not exists private.shop_price_cron_auth(id integer primary key check(id=1),token_hash bytea not null);
revoke all on private.shop_price_cron_auth from public,anon,authenticated;
grant all on private.shop_price_cron_auth to service_role;
create or replace function public.shop_verify_price_cron_token(p_token text)
returns boolean language sql security definer set search_path=''
as $$ select exists(select 1 from private.shop_price_cron_auth a where a.id=1 and a.token_hash=extensions.digest(coalesce(p_token,''),'sha256')); $$;
revoke all on function public.shop_verify_price_cron_token(text) from public,anon,authenticated;
grant execute on function public.shop_verify_price_cron_token(text) to service_role;
do $$
declare v_token text;
begin
 v_token:=encode(extensions.gen_random_bytes(32),'hex');
 insert into private.shop_price_cron_auth(id,token_hash) values(1,extensions.digest(v_token,'sha256'))
 on conflict(id) do update set token_hash=excluded.token_hash;
 perform vault.create_secret(v_token,'barqyar_price_cron_token','Private token for Barqyar price cron',null);
end; $$;
-- Store the app's public publishable key in Vault before scheduling:
-- select vault.create_secret('YOUR_SUPABASE_PUBLISHABLE_KEY','barqyar_price_cron_apikey','Public key for cron requests',null);

-- Daily scheduler; the Edge Function only performs web research when 14 days have elapsed.
select cron.unschedule(jobid) from cron.job where jobname='barqyar-price-update-daily';
select cron.schedule(
 'barqyar-price-update-daily',
 '15 3 * * *',
 $job$
 select net.http_post(
  url := 'https://zgswoheckqasqoclhodg.supabase.co/functions/v1/barqyar-price-update',
  headers := jsonb_build_object('Content-Type','application/json',
   'apikey',(select decrypted_secret from vault.decrypted_secrets where name='barqyar_price_cron_apikey'),
   'x-barqyar-cron-token',(select decrypted_secret from vault.decrypted_secrets where name='barqyar_price_cron_token')),
  body := jsonb_build_object('trigger','cron'),
  timeout_milliseconds := 20000
 );
 $job$
);
