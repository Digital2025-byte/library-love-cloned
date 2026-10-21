-- Excess Baggage Calculator: From / To / Excess weight form that prices extra
-- kilos from baggage_segment_prices (USD per kg). Replaces "baggage-calculator"
-- on the baggage-calculator page; the old type stays in the library.
INSERT INTO public.component_types (id, label)
VALUES ('excess-baggage-calculator', 'Excess Baggage Calculator')
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label;
