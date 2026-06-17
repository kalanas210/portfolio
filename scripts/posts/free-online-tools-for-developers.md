I keep a folder of browser bookmarks that I open more often than my IDE. Not frameworks, not courses - small single-purpose tools that take a five-minute annoyance and turn it into a five-second one. Format this JSON. Decode this token. Explain this cron string. Generate a UUID. None of them are exciting on their own, but the time they save compounds, and over a week of real work it adds up to real hours.

The best of these tools share three traits: they are free, they need no sign-up, and they run entirely in your browser so nothing you paste ever leaves your machine. That last point matters more than people think. When you drop a production JWT or a chunk of customer data into a random "online formatter," you have no idea whether it is being logged on someone's server. Client-side tools sidestep that question completely - the work happens in JavaScript on your device, and the network tab stays empty.

This is my actual shortlist: ten tools I reach for as a full-stack and Spring Boot developer, why each one earns its bookmark, and the small workflow around it. If you are a student or early in your career, learning to lean on tools like these is one of the cheapest productivity upgrades you can make.

## 1. JSON formatter - the one you will use every day

JSON is the connective tissue of modern apps, and most of the time you meet it as a single unreadable line dumped by a log or a `curl` call. A [JSON formatter](/tools/json-formatter) does three jobs: it pretty-prints with proper indentation, it validates and tells you exactly where the syntax breaks, and it minifies when you need to paste a payload back into a request.

The validation is the underrated part. When an API returns a 400 and you cannot see why, paste the request body in and a good formatter points straight at the trailing comma or the missing quote. I lean on this while debugging Spring Boot controllers, where a malformed request body and a Jackson deserialization failure produce nearly identical stack traces until you actually inspect the JSON that came in.

> A formatter that highlights *where* JSON is invalid saves more time than one that only makes valid JSON pretty. The error you cannot see is the one that costs you twenty minutes.

## 2. Regex tester - stop guessing, start seeing

Regular expressions are write-once, read-never. The only sane way to build one is iteratively, with live feedback, against real sample text. A [regex tester](/tools/regex-tester) gives you a pattern box, a flags toggle, and a text area that highlights every match as you type.

Build the pattern in small steps. Match the easy part first, confirm it highlights, then add the next group. When you are happy, most testers also explain the capture groups so you can name them properly in code:

```java
Pattern p = Pattern.compile("(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})");
Matcher m = p.matcher("2026-06-17");
if (m.matches()) {
    String year = m.group("year"); // "2026"
}
```

Test the pattern in the browser, paste the verified version into your code, and you avoid the classic trap of a regex that works in Java but not JavaScript because of a subtle flag difference.

## 3. JWT decoder - read the token before you trust it

If you build authenticated APIs, you stare at JSON Web Tokens all day. A [JWT decoder](/tools/jwt-decoder) splits the token into its three parts and shows you the decoded header and payload so you can read the claims directly.

This is the fastest way to answer "why is this request 401-ing." Decode the token, check the `exp` claim against the current time, confirm the `iss` and `aud` match what your server expects, and check the roles or scopes are actually present. A good client-side decoder never sends the token anywhere, which is exactly what you want when the token is real.

One honest caveat worth internalising: decoding is not verifying. The decoder shows you the payload, but it does not prove the signature is valid. Use it to inspect and debug, never as a substitute for real signature verification on the server.

## 4. Base64 encoder and decoder - the glue everywhere

Base64 turns up in more places than you would expect: data URIs, basic-auth headers, the segments of a JWT, embedded images, and encoded config values. A [Base64 tool](/tools/base64) that handles UTF-8 correctly in both directions saves you from writing a throwaway script every time.

The UTF-8 part matters more than it looks. The classic browser pair `btoa` and `atob` only handle Latin-1, so the moment your data includes names in Sinhala, Tamil, an emoji, or any non-Latin script, `btoa` throws an `InvalidCharacterError`. The correct round trip routes the bytes through `TextEncoder` and `TextDecoder` first:

```ts
const encode = (text: string): string =>
  btoa(String.fromCharCode(...new TextEncoder().encode(text)));

const decode = (b64: string): string =>
  new TextDecoder().decode(
    Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)),
  );

encode("ආයුබෝවන්"); // valid Base64, no exception
```

A good browser tool does exactly this for you, which is why pasting a token or a UTF-8 config value in and getting it back unchanged is something you can rely on rather than hope for.

## 5. Hash generator - checksums and quick comparisons

A [hash generator](/tools/hash-generator) computes SHA-256 and similar digests right in the browser using the Web Crypto API. I use it to verify a downloaded file matches its published checksum, to compare two large strings without eyeballing them, and to sanity-check that a hashing implementation in my code produces the expected output.

```ts
// The same SHA-256 your browser tool runs, in code
async function sha256(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(buf)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
```

A reminder that bears repeating: hashing is not encryption and never use plain SHA-256 to store passwords. For passwords you want a slow, salted algorithm like bcrypt or Argon2. The hash generator is for integrity checks, not secrets at rest.

## 6. UUID generator - identifiers on demand

You need a unique identifier far more often than you would guess: seeding test data, naming a temporary resource, generating a correlation ID for a log trace, or filling a primary key while sketching a schema. A [UUID generator](/tools/uuid-generator) hands you valid v4 UUIDs instantly, usually in bulk.

Having a few real UUIDs on hand keeps your test fixtures realistic. Hard-coding `"123"` as an ID hides bugs that only show up with actual UUID-shaped strings, like a column that is too narrow or a serializer that chokes on hyphens. If you control the schema, it is worth knowing that random v4 UUIDs scatter across a B-tree index and hurt insert performance at scale, whereas the newer time-ordered v7 keeps inserts mostly sequential. Generate whichever your code actually uses so the test data matches production:

```java
UUID id = UUID.randomUUID(); // v4, fully random
```

The generator is for the throwaway cases - a quick correlation ID, a fixture, a placeholder primary key - not for the IDs your service mints at runtime.

## 7. Cron expression explainer - decode the five fields

Cron syntax is dense and easy to get wrong, and a wrong cron expression fails silently - the job just never runs at the time you intended. A [cron explainer](/tools/cron-explainer) translates `0 2 * * 1-5` into plain English ("at 02:00 on every day-of-week from Monday through Friday") so you can confirm your schedule before it ships.

I check every cron string this way before committing it, whether it is a Spring `@Scheduled` annotation, a Kubernetes CronJob, or a CI trigger. Thirty seconds of confirmation beats discovering at month-end that your report job fired at the wrong hour the whole time.

## 8. Diff checker - compare two blobs of text

A [diff checker](/tools/diff-checker) highlights exactly what changed between two blocks of text, line by line. Living outside version control is the whole point: comparing two API responses, two config files from different environments, or the before and after of something a teammate pasted into chat.

The classic save is the "works on my machine" config bug. Paste your local `.env` shape next to the staging one, and the missing or differently-named variable jumps out in seconds instead of after an afternoon of guessing.

## 9. SQL formatter - make the query readable

Generated SQL, or SQL written under deadline pressure, tends to arrive as one long unbroken line. A [SQL formatter](/tools/sql-formatter) reflows it into properly indented clauses so you can actually reason about the joins and the where conditions.

This is genuinely useful when you are reading the SQL that an ORM like Hibernate logs. Those queries are correct but formatted for the machine, and a quick pass through a formatter turns a wall of text into something you can review for a missing index or an accidental cartesian join.

```sql
SELECT u.id, u.name, COUNT(o.id) AS order_count
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE u.created_at >= '2026-01-01'
GROUP BY u.id, u.name
HAVING COUNT(o.id) > 5
ORDER BY order_count DESC;
```

## 10. Password generator - strong, random, and never sent anywhere

A [password generator](/tools/password-generator) produces long, high-entropy strings from the browser's cryptographic randomness (`crypto.getRandomValues`, not `Math.random`, which is not safe for secrets). The privacy story is the entire point: a client-side generator never transmits the password it just created, so no server can log it.

Use it for database credentials in a local project, for a service account, or anywhere you would otherwise reach for a weak, memorable string. Generate something long, drop it straight into a real password manager, and move on.

## Why client-side tools win

Notice the thread running through all ten: every one of these does its work in your browser, with nothing uploaded. That is not a marketing line, it is an architectural choice with three concrete payoffs.

- **Privacy.** Your tokens, queries, and config never touch a third-party server, so there is no log to leak.
- **Speed.** There is no network round trip. The result appears as fast as your laptop can compute it.
- **It works offline and at any scale.** Once the page is loaded you can format a hundred files in a row without rate limits or a sign-up wall.

The honest caveat: "free online" and "runs in your browser" are not the same promise. Before pasting anything sensitive into an unfamiliar tool, open the network tab and confirm nothing leaves the page. The tools I have built and linked here are deliberately client-side for exactly this reason.

This list is a slice of what I reach for most, but it is not the whole shelf. Browse the full [developer tools collection](/tools), bookmark the three or four that fit your daily work, and let the saved minutes compound. If you build something interesting with them, or you wish a tool existed that does not yet, [tell me](/contact) - half the tools on this site started as my own five-minute annoyance.
