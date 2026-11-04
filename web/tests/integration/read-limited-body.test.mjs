import test from "node:test";
import assert from "node:assert/strict";
import { readLimitedBody } from "../../src/server/security/read-limited-body.ts";

function streamedRequest(chunks, headers = {}) {
  let next = 0;
  let cancelled = false;
  const body = new ReadableStream({
    pull(controller) {
      if (next === chunks.length) controller.close();
      else controller.enqueue(chunks[next++]);
    },
    cancel() { cancelled = true; },
  });
  return { request: new Request("http://localhost/", { method: "POST", body, headers, duplex: "half" }), wasCancelled: () => cancelled };
}

test("reads UTF-8 correctly across chunks and permits the exact byte limit", async () => {
  const bytes = new TextEncoder().encode('The ₱ sign');
  const { request } = streamedRequest([bytes.slice(0, 5), bytes.slice(5, 6), bytes.slice(6)]);
  assert.equal(await readLimitedBody(request, bytes.length), 'The ₱ sign');
});

test("rejects a streamed body over the limit even with a missing or misleading content length", async () => {
  for (const headers of [{}, { "content-length": "1" }]) {
    const stream = streamedRequest([new Uint8Array(7), new Uint8Array(7), new Uint8Array(7)], headers);
    assert.equal(await readLimitedBody(stream.request, 10), null);
    assert.equal(stream.wasCancelled(), true);
  }
});

test("rejects an oversized declared body without reading it", async () => {
  const stream = streamedRequest([new Uint8Array(1)], { "content-length": "11" });
  assert.equal(await readLimitedBody(stream.request, 10), null);
});
