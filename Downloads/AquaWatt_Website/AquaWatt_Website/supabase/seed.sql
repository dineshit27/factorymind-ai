-- AquaWatt Seed Data Script (Idempotent-ish)
-- Run this AFTER the minimal schema has been created.
-- Safe to re-run: it checks for existing rows before inserting to avoid duplication.
-- NOTE: This uses random() so numerical readings will differ each run.

DO $$
DECLARE
  u RECORD;                -- Each auth user
  r_kitchen UUID;
  r_bedroom UUID;
  r_hall UUID;
  r_bathroom UUID;
  r_outdoor UUID;
  d_water_faucet UUID;
  d_power_meter UUID;
  d_combo_main UUID;
  day_offset INT;
  months_back INT;
  start_month DATE;
  end_month DATE;
  water_total NUMERIC(12,2);
  elec_total NUMERIC(12,2);
BEGIN
  -- Loop through every existing authenticated user
  FOR u IN SELECT id, email FROM auth.users LOOP

    -- 1. Ensure profile row exists (trigger normally handles new users)
    INSERT INTO public.profiles (id, email, display_name, full_name)
    VALUES (u.id, u.email, split_part(u.email,'@',1), split_part(u.email,'@',1))
    ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;

    -- 2. Ensure user_settings row
    INSERT INTO public.user_settings (user_id)
    VALUES (u.id)
    ON CONFLICT (user_id) DO NOTHING;

    -- 3. Base Rooms (skip if already present)
    IF NOT EXISTS (SELECT 1 FROM public.rooms WHERE user_id = u.id) THEN
      INSERT INTO public.rooms (user_id, name, room_type) VALUES
        (u.id,'Kitchen','kitchen'),
        (u.id,'Bedroom','bedroom'),
        (u.id,'Hall','hall'),
        (u.id,'Bathroom','bathroom'),
        (u.id,'Garden','outdoor');
    END IF;

    SELECT id INTO r_kitchen  FROM public.rooms WHERE user_id = u.id AND name='Kitchen'  LIMIT 1;
    SELECT id INTO r_bedroom  FROM public.rooms WHERE user_id = u.id AND name='Bedroom'  LIMIT 1;
    SELECT id INTO r_hall     FROM public.rooms WHERE user_id = u.id AND name='Hall'     LIMIT 1;
    SELECT id INTO r_bathroom FROM public.rooms WHERE user_id = u.id AND name='Bathroom' LIMIT 1;
    SELECT id INTO r_outdoor  FROM public.rooms WHERE user_id = u.id AND name='Garden'   LIMIT 1;

    -- 4. Devices
    IF NOT EXISTS (SELECT 1 FROM public.connected_devices WHERE user_id = u.id) THEN
      INSERT INTO public.connected_devices (user_id, room_id, device_name, device_type, is_active) VALUES
        (u.id, r_kitchen,  'Kitchen Faucet Sensor','water', TRUE),
        (u.id, r_kitchen,  'Kitchen Power Meter','electricity', TRUE),
        (u.id, r_bathroom, 'Shower Flow Sensor','water', TRUE),
        (u.id, r_bedroom,  'Bedroom Power Plug','electricity', TRUE),
        (u.id, r_hall,     'Main Combo Meter','combo', TRUE);
    END IF;

    SELECT id INTO d_water_faucet FROM public.connected_devices WHERE user_id=u.id AND device_name='Kitchen Faucet Sensor' LIMIT 1;
    SELECT id INTO d_power_meter  FROM public.connected_devices WHERE user_id=u.id AND device_name='Kitchen Power Meter' LIMIT 1;
    SELECT id INTO d_combo_main   FROM public.connected_devices WHERE user_id=u.id AND device_name='Main Combo Meter' LIMIT 1;

    -- 5. Usage Readings (last 60 days) - skip if already seeded
    IF NOT EXISTS (SELECT 1 FROM public.usage_readings WHERE user_id = u.id) THEN
      FOR day_offset IN 0..59 LOOP
        -- Simulate a pattern: weekends (day_offset % 7 in (0,6)) slightly higher usage
        INSERT INTO public.usage_readings (user_id, room_id, device_id, reading_type, amount, cost, recorded_at)
        VALUES (
          u.id,
          r_kitchen,
          d_water_faucet,
          'water',
          (15 + (CASE WHEN (EXTRACT(DOW FROM NOW() - (day_offset||' days')::INTERVAL) IN (0,6)) THEN 10 ELSE 0 END) + random()*25)::NUMERIC(12,2),
          (2 + random()*4)::NUMERIC(12,2),
          date_trunc('day', NOW() - (day_offset||' days')::INTERVAL) + ((random()*12)::INT ||' hours')::INTERVAL
        );
        INSERT INTO public.usage_readings (user_id, room_id, device_id, reading_type, amount, cost, recorded_at)
        VALUES (
          u.id,
          r_kitchen,
          d_power_meter,
          'electricity',
          (8 + (CASE WHEN (EXTRACT(DOW FROM NOW() - (day_offset||' days')::INTERVAL) IN (0,6)) THEN 5 ELSE 0 END) + random()*15)::NUMERIC(12,2),
          (3 + random()*5)::NUMERIC(12,2),
          date_trunc('day', NOW() - (day_offset||' days')::INTERVAL) + ((12 + random()*10)::INT ||' hours')::INTERVAL
        );
        -- Occasional bathroom water reading
        IF random() < 0.35 THEN
          INSERT INTO public.usage_readings (user_id, room_id, device_id, reading_type, amount, cost, recorded_at)
          VALUES (
            u.id,
            r_bathroom,
            d_combo_main,
            'water',
            (10 + random()*20)::NUMERIC(12,2),
            (1 + random()*3)::NUMERIC(12,2),
            date_trunc('day', NOW() - (day_offset||' days')::INTERVAL) + ((6 + random()*3)::INT ||' hours')::INTERVAL
          );
        END IF;
        -- Occasional extra electricity reading (evening)
        IF random() < 0.45 THEN
          INSERT INTO public.usage_readings (user_id, room_id, device_id, reading_type, amount, cost, recorded_at)
          VALUES (
            u.id,
            r_bedroom,
            d_power_meter,
            'electricity',
            (5 + random()*10)::NUMERIC(12,2),
            (2 + random()*4)::NUMERIC(12,2),
            date_trunc('day', NOW() - (day_offset||' days')::INTERVAL) + ((18 + random()*5)::INT ||' hours')::INTERVAL
          );
        END IF;
      END LOOP;
    END IF;

    -- 6. Billing Records (current + previous 5 months) - create if missing this month's bill
    IF NOT EXISTS (SELECT 1 FROM public.billing_records WHERE user_id=u.id AND date_trunc('month', period_start) = date_trunc('month', NOW())) THEN
      FOR months_back IN 0..5 LOOP
        start_month := (date_trunc('month', NOW()) - (months_back||' months')::INTERVAL)::DATE;
        end_month := (start_month + INTERVAL '1 month - 1 day')::DATE;
        -- Aggregate approximate usage for the month from existing readings (if any)
        SELECT COALESCE(SUM(amount),0) INTO water_total FROM public.usage_readings
          WHERE user_id=u.id AND reading_type='water' AND recorded_at::DATE BETWEEN start_month AND end_month;
        SELECT COALESCE(SUM(amount),0) INTO elec_total FROM public.usage_readings
          WHERE user_id=u.id AND reading_type='electricity' AND recorded_at::DATE BETWEEN start_month AND end_month;
        IF water_total = 0 THEN water_total := (400 + random()*250)::NUMERIC(12,2); END IF;
        IF elec_total = 0 THEN elec_total := (120 + random()*90)::NUMERIC(12,2); END IF;

        INSERT INTO public.billing_records (
          user_id, period_start, period_end, water_usage, electricity_usage,
          water_cost, electricity_cost, total_amount, status, due_date, paid_at
        ) VALUES (
          u.id,
          start_month,
          end_month,
          water_total,
          elec_total,
          (water_total * (0.02 + random()*0.01))::NUMERIC(12,2),
          (elec_total * (0.15 + random()*0.05))::NUMERIC(12,2),
          0, -- placeholder, updated below
          CASE WHEN months_back = 0 THEN 'pending' ELSE 'paid' END,
          (start_month + INTERVAL '1 month + 15 days')::DATE,
          CASE WHEN months_back = 0 THEN NULL ELSE (end_month + INTERVAL '10 days') END
        ) ON CONFLICT DO NOTHING;

        -- Recompute total_amount for the just inserted row
        UPDATE public.billing_records br
          SET total_amount = (water_cost + electricity_cost)
        WHERE br.user_id = u.id AND br.period_start = start_month;
      END LOOP;
    END IF;

    -- 7. Family Members (mock) - only add if none exist
    IF NOT EXISTS (SELECT 1 FROM public.family_members WHERE owner_user_id = u.id) THEN
      INSERT INTO public.family_members (owner_user_id, member_email, access_level, status, joined_at)
      VALUES
        (u.id, 'partner+'||substr(u.id::text,1,8)||'@example.com','edit','active', NOW()),
        (u.id, 'child+'||substr(u.id::text,1,8)||'@example.com','view','active', NOW());
    END IF;

    -- 8. Community Posts & Replies
    IF NOT EXISTS (SELECT 1 FROM public.community_posts WHERE user_id = u.id) THEN
      INSERT INTO public.community_posts (user_id, title, content) VALUES
        (u.id,'Welcome to the Community','Introduce yourself and share your sustainability goals.'),
  (u.id,'Water Saving Challenge','Let''s reduce our water usage by 10% this month.'),
        (u.id,'Smart Device Optimization','Tips for balancing electricity and water efficiency.');

      -- Simple replies to first post
      INSERT INTO public.community_replies (post_id, user_id, content)
      SELECT p.id, u.id, 'Excited to join and learn together!' FROM public.community_posts p
        WHERE p.user_id=u.id ORDER BY p.created_at ASC LIMIT 1;
    END IF;

  END LOOP; -- end users
END $$;

-- Post-processing: ensure all billing records have total_amount filled (in case of existing rows)
UPDATE public.billing_records SET total_amount = water_cost + electricity_cost WHERE total_amount = 0;

-- Quick verification queries (optional to run manually):
-- SELECT COUNT(*) rooms_count FROM rooms;
-- SELECT COUNT(*) devices_count FROM connected_devices;
-- SELECT COUNT(*) usage_count FROM usage_readings;
-- SELECT COUNT(*) bills_count FROM billing_records;
-- SELECT COUNT(*) posts_count FROM community_posts;
-- SELECT COUNT(*) replies_count FROM community_replies;
-- SELECT COUNT(*) family_count FROM family_members;
