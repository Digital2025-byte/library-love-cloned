export function publicJson(body: unknown, status = 200, extraHeaders: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "authorization, content-type, apikey",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Cache-Control": "no-store",
      ...extraHeaders,
    },
  });
}

export function publicError(message: string, code: string, status: number) {
  return publicJson({ error: { message, code } }, status);
}

export function requireBearer(request: Request) {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ") || auth.length < 16) {
    return null;
  }
  return auth;
}

export function writeFailure(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : fallback;
  const notFound = /not found|is not on page/i.test(message);
  const forbidden = /row-level security|permission|policy/i.test(message);
  return publicError(
    message,
    notFound ? "not_found" : forbidden ? "forbidden" : "query_failed",
    notFound ? 404 : forbidden ? 403 : 500,
  );
}
