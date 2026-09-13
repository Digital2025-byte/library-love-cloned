import { createFileRoute } from "@tanstack/react-router";
import { createCmsClient } from "./get-pages";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "authorization, content-type, apikey",
      "Cache-Control": "no-store",
    },
  });
}

type ComponentRow = {
  id: string;
  type: string;
  style: unknown;
  content: unknown;
};

type PageComponentRow = {
  position: number;
  components: ComponentRow | null;
};

export const Route = createFileRoute("/api/public/get-page")({
  server: {
    handlers: {
      OPTIONS: () => json({}),
      GET: async ({ request }) => {
        const slug = new URL(request.url).searchParams.get("slug");
        if (!slug) return json({ error: "Missing required query param: slug" }, 400);

        const supabase = createCmsClient(request);
        const { data, error } = await supabase
          .from("pages")
          .select(
            "slug, label, description, status, page_components(position, components(id, type, style, content))"
          )
          .eq("slug", slug)
          .maybeSingle();

        if (error) return json({ error: error.message }, 500);
        if (!data) return json({ error: "Page not found" }, 404);

        const links = ((data.page_components ?? []) as PageComponentRow[])
          .slice()
          .sort((a, b) => a.position - b.position);

        return json({
          slug: data.slug,
          label: data.label,
          description: data.description,
          status: data.status,
          blocks: links.flatMap((link) =>
            link.components
              ? [
                  {
                    uid: link.components.id,
                    sectionId: link.components.type,
                    position: link.position,
                    style: link.components.style,
                    content: link.components.content,
                  },
                ]
              : []
          ),
        });
      },
    },
  },
});

    },
  },
});
