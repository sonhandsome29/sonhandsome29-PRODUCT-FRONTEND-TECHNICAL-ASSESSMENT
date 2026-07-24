export const dynamic = "force-dynamic";

const allowedResponseHeaders = [
  "content-type",
  "x-total-count",
  "x-filtered-count",
];

async function proxyRequest(request: Request) {
  const incomingUrl = new URL(request.url);
  const mockApiUrl =
    process.env.MOCK_API_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:3001";
  const targetUrl = `${mockApiUrl}${incomingUrl.pathname}${incomingUrl.search}`;
  const headers = new Headers();

  for (const name of ["accept", "authorization", "content-type"]) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body:
        request.method === "GET" || request.method === "HEAD"
          ? undefined
          : await request.arrayBuffer(),
      redirect: "manual",
    });
    const responseHeaders = new Headers();
    for (const name of allowedResponseHeaders) {
      const value = response.headers.get(name);
      if (value) responseHeaders.set(name, value);
    }
    return new Response(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch {
    return Response.json(
      {
        message:
          "Mock API is unavailable. Start Mockoon on port 3001 or run Docker Compose.",
      },
      { status: 502 },
    );
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
