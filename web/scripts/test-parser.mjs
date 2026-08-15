import { readFileSync } from "node:fs";

const url = "https://www.eredmenyek.com/csapat/siofok/YFzGWgOR/";

const response = await fetch(url, {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    Accept: "text/html,application/xhtml+xml",
    "Accept-Language": "hu-HU,hu;q=0.9,en;q=0.8",
  },
});

console.log("status", response.status, "url", response.url);
const html = await response.text();
console.log("html length", html.length);

const dataBlocks = [...html.matchAll(/data:\s*`([^`]+)`/g)];
console.log("data: blocks", dataBlocks.length);

const feedKeys = ["fixtures", "results", "summary", "squad", "transfers"];
for (const key of feedKeys) {
  const re = new RegExp(
    `initialFeeds\\["${key}"\\]\\s*=\\s*['"\`]([^'"\`]+)['"\`]`,
    "g",
  );
  const matches = [...html.matchAll(re)];
  console.log(`initialFeeds[${key}]`, matches.length, matches[0]?.[1]?.slice(0, 80));
}

// Write sample for inspection
if (dataBlocks[0]) {
  console.log("first data block sample:", dataBlocks[0][1].slice(0, 200));
}
