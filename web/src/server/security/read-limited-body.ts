/** Read at most maxBytes from a request, including requests without Content-Length. */
export async function readLimitedBody(request: Request, maxBytes: number): Promise<string | null> {
  const declared = request.headers.get("content-length");
  if (declared && Number(declared) > maxBytes) return null;
  if (!request.body) return "";

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let total = 0;
  let body = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) return body + decoder.decode();
      total += value.byteLength;
      if (total > maxBytes) {
        void reader.cancel().catch(() => {});
        return null;
      }
      body += decoder.decode(value, { stream: true });
    }
  } finally {
    reader.releaseLock();
  }
}
