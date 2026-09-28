-- Register Info Accordion for the page builder (seat-selection Terms card).
insert into public.component_types (id, label)
values ('info-accordion', 'Info Accordion')
on conflict (id) do update set label = excluded.label;
