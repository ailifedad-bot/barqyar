-- برق‌یار: customer receipt confirmation and manager final delivery.
-- Additive workflow repair. Existing orders, products, and customer records are preserved.

create or replace function public.shop_track_order_progress(p_code text)
returns table(
  status text,
  created_at timestamptz,
  total numeric,
  tracking_code text,
  customer_confirmed_at timestamptz,
  delivered_at timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    o.status,
    o.created_at,
    o.total,
    o.tracking_code,
    o.customer_confirmed_at,
    o.delivered_at
  from public.shop_orders as o
  where o.tracking_code = upper(btrim(coalesce(p_code, '')))
  limit 1;
$$;

revoke all on function public.shop_track_order_progress(text) from public;
grant execute on function public.shop_track_order_progress(text) to anon, authenticated;


create or replace function public.shop_customer_confirm_delivery(
  p_code text,
  p_phone_last4 text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order public.shop_orders%rowtype;
  v_last4 text;
  v_saved_at timestamptz;
begin
  v_last4 := regexp_replace(
    translate(
      coalesce(p_phone_last4, ''),
      '۰۱۲۳۴۵۶۷۸۹٠١٢٣٤٥٦٧٨٩',
      '01234567890123456789'
    ),
    '[^0-9]', '', 'g'
  );

  if v_last4 !~ '^[0-9]{4}$' then
    raise exception 'چهار رقم آخر شماره موبایل معتبر نیست';
  end if;

  if length(btrim(coalesce(p_code, ''))) > 40 then
    raise exception 'کد سفارش معتبر نیست';
  end if;

  select *
    into v_order
    from public.shop_orders
   where tracking_code = upper(btrim(coalesce(p_code, '')))
   for update;

  if not found then
    raise exception 'سفارش با این کد پیدا نشد';
  end if;

  if right(
    regexp_replace(
      translate(
        coalesce(v_order.phone, ''),
        '۰۱۲۳۴۵۶۷۸۹٠١٢٣٤٥٦٧٨٩',
        '01234567890123456789'
      ),
      '[^0-9]', '', 'g'
    ),
    4
  ) is distinct from v_last4 then
    raise exception 'چهار رقم آخر شماره موبایل با سفارش مطابقت ندارد';
  end if;

  if v_order.status = 'done' then
    if v_order.customer_confirmed_at is not null then
      return jsonb_build_object(
        'ok', true,
        'already_confirmed', true,
        'customer_confirmed_at', v_order.customer_confirmed_at
      );
    end if;
    raise exception 'تحویل نهایی این سفارش قبلاً ثبت شده است';
  end if;

  if v_order.status = 'cancelled' then
    raise exception 'این سفارش لغو شده است';
  end if;

  if v_order.status <> 'approved' then
    raise exception 'ابتدا باید سفارش توسط مدیر تأیید شود';
  end if;

  if v_order.customer_confirmed_at is not null then
    return jsonb_build_object(
      'ok', true,
      'already_confirmed', true,
      'customer_confirmed_at', v_order.customer_confirmed_at
    );
  end if;

  update public.shop_orders
     set customer_confirmed_at = now()
   where id = v_order.id
   returning customer_confirmed_at into v_saved_at;

  return jsonb_build_object(
    'ok', true,
    'already_confirmed', false,
    'customer_confirmed_at', v_saved_at
  );
end;
$$;

revoke all on function public.shop_customer_confirm_delivery(text, text) from public;
grant execute on function public.shop_customer_confirm_delivery(text, text) to anon, authenticated;


-- Final delivery is only allowed after both the manager's initial approval
-- and the customer's receipt confirmation.
create or replace function public.shop_admin_deliver(p_order_id uuid, p_code text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order public.shop_orders%rowtype;
begin
  if not public.shop_is_admin() then
    raise exception 'دسترسی مدیر لازم است';
  end if;

  select *
    into v_order
    from public.shop_orders
   where id = p_order_id
   for update;

  if not found then
    raise exception 'سفارش پیدا نشد';
  end if;

  if v_order.tracking_code is null
     or v_order.tracking_code <> upper(btrim(coalesce(p_code, ''))) then
    raise exception 'کد یکتای سفارش درست نیست';
  end if;

  if v_order.status = 'done' then
    raise exception 'تحویل نهایی این سفارش قبلاً ثبت شده است';
  end if;

  if v_order.status <> 'approved' then
    raise exception 'ابتدا باید سفارش توسط مدیر تأیید اولیه شود';
  end if;

  if v_order.customer_confirmed_at is null then
    raise exception 'هنوز مشتری دریافت واقعی کالا را تأیید نکرده است';
  end if;

  if not v_order.inventory_deducted then
    raise exception 'وضعیت کسر موجودی سفارش معتبر نیست';
  end if;

  update public.shop_orders
     set status = 'done',
         delivered_at = now(),
         delivery_verified = true
   where id = p_order_id;
end;
$$;

revoke all on function public.shop_admin_deliver(uuid, text) from public, anon;
grant execute on function public.shop_admin_deliver(uuid, text) to authenticated;
