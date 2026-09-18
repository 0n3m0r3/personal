import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
const base = process.argv[2] || "http://127.0.0.1:3003";
const get = (path) => fetch(base + path, { signal: AbortSignal.timeout(15000) });
assert.equal((await get("/api/health")).status, 200);
for (const locale of ["fr", "en", "de"]) {
  for (const suffix of ["", "/services"]) {
    const response = await get("/" + locale + suffix);
    assert.equal(response.status, 200, locale + suffix);
    const html = await response.text();
    assert.match(html, new RegExp('lang="' + locale + '"'));
    assert.doesNotMatch(html, /<button[^>]+class="chat-launcher"/);
  }
}
const image = await get("/_next/image?url=%2Fportrait-linkedin.jpg&w=640&q=75");
assert.equal(image.status, 200);
assert.match(image.headers.get("content-type"), /^image\//);
const digest = (data) => createHash("sha256").update(data).digest("hex");
const pdf = await get("/CV_Louka_Altdorf-Reynes.pdf");
assert.equal(pdf.status, 200);
assert.equal(digest(Buffer.from(await pdf.arrayBuffer())),
  digest(await readFile(new URL("../public/CV_Louka_Altdorf-Reynes.pdf", import.meta.url))));
const chat = await fetch(base + "/api/chat", {
  method: "POST",
  headers: { Origin: base, "Content-Type": "application/json" },
  body: JSON.stringify({ locale: "fr", question: "Bonjour" }),
});
assert.equal(chat.status, 503);
assert.deepEqual(await chat.json(), { error: "unavailable" });
console.log("PASS: health, six localized routes, image optimizer, source PDF, public chat disabled");
