insert into public.component_types (id, label)
values ('gateway-cards', 'Gateway Cards')
on conflict (id) do update set label = excluded.label;
