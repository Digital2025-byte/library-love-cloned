-- Airport Service Cards were folded into Seat Plan (content/style remapped by
-- cms/scripts/migrate-airport-service-cards-to-seat-plan.mjs). Drop the type
-- only when no components still reference it.
DELETE FROM public.component_types ct
WHERE ct.id = 'airport-service-cards'
  AND NOT EXISTS (
    SELECT 1 FROM public.components c WHERE c.type = 'airport-service-cards'
  );
