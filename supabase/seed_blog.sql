-- ============================================================================
--  SEO blog posts — run AFTER 0002/0003 and the main seed.sql.
--  10 internally-linked, keyword-targeted articles. Idempotent (on conflict).
--  Edit or delete any of them from /admin/blog afterwards.
-- ============================================================================

-- Keep the homepage Blog row showing the 3 real featured posts below,
-- not the placeholder welcome post.
update public.posts set featured = false where slug = 'hello-world';

insert into public.posts
  (slug, title, excerpt, content, cover_url, tags, featured, published, published_at, sort_order)
values
( '5-free-browser-tools-every-developer-needs',
  '5 Free Browser Tools Every Developer Needs in 2026',
  'Five fast, free, privacy-first browser tools every developer should bookmark — JSON formatter, regex tester, JWT decoder, and more.',
  $md$Every developer keeps a handful of small utilities within reach — for formatting, decoding, and debugging the little things that come up a dozen times a day. The trouble with most online tools is that they are ad-heavy, ask you to sign up, or quietly upload your data to a server.

Here are five free tools that run **entirely in your browser** — nothing is uploaded, there is no sign-up, and they are genuinely fast.

## 1. JSON Formatter & Validator
Pasting an unreadable wall of JSON into a [JSON formatter](/tools/json-formatter) is the quickest way to make sense of an API response. Beautify it with proper indentation, catch a missing comma, or minify it for production — all locally.

## 2. Regex Tester
Regular expressions are powerful and easy to get wrong. A [regex tester](/tools/regex-tester) with live match highlighting lets you see exactly what your pattern captures before you ship it.

## 3. JWT Decoder
Debugging an auth flow? Drop your token into a [JWT decoder](/tools/jwt-decoder) to read the header and payload and check the expiry — without pasting a production token into a random website.

## 4. Base64 Encoder / Decoder
From data URIs to encoded config values, Base64 is everywhere. A [Base64 tool](/tools/base64) that is UTF-8 safe handles emoji and accents correctly in both directions.

## 5. Hash Generator
Need a checksum or to verify data integrity? A [hash generator](/tools/hash-generator) computes SHA-256 and friends with the browser's Web Crypto API — your input never leaves the page.

## Why "in your browser" matters
Client-side tools are faster (no network round-trip), private (no uploads), and free to run at any scale. That is the whole idea behind my [free tools collection](/tools): over 30 utilities, no accounts, and no tracking.

Bookmark the ones you reach for most — your future self will thank you.$md$,
  'https://picsum.photos/seed/blog-devtools/1200/630',
  array['Tools','Productivity','Web Development'], true, true, '2026-06-05'::timestamptz, 2 ),

( 'what-is-agentic-ai',
  'What Is Agentic AI? A Developer''s Guide to AI Agents',
  'What agentic AI really means, how AI agents differ from chatbots, and the building blocks you need to start building them.',
  $md$"Agentic AI" is the phrase on every engineering roadmap in 2026 — but what does it actually mean, and how is it different from the chatbots we already use? This is a practical guide for developers.

## From chatbots to agents
A traditional LLM call is one-shot: you send a prompt, you get a response. An **AI agent** wraps that model in a loop so it can plan, take actions, observe the results, and decide what to do next — all toward a goal you set. The difference is autonomy: a chatbot answers a question; an agent gets a job done.

## The building blocks of an agent
Most agentic systems share four ingredients:

- **A model** that can reason and decide.
- **Tools** — functions the agent can call (search, run code, query a database, hit an API).
- **Memory** — short-term context plus longer-term storage so it can recall earlier steps.
- **A control loop** that runs "think → act → observe" until the task is finished.

## Single agent vs. multi-agent
Simple tasks need one agent with a few tools. Bigger problems are often split across **multiple agents** — a planner that breaks down the work, workers that execute, and a critic that checks the result before it ships.

## Where it shines
Agentic patterns fit research, data extraction, code migration, support triage, and any workflow with many steps and clear success criteria.

## Getting started
You do not need a framework to begin. Define a goal, give the model two or three tools, and write the loop yourself — you will understand the trade-offs far better than starting with a heavyweight library. Add structure (planning, verification, guardrails) only where the task needs it.

Curious what I build with these ideas? Take a look at my [projects](/projects), or [get in touch](/contact) if you want to talk shop.$md$,
  'https://picsum.photos/seed/blog-agentic/1200/630',
  array['AI','Agentic AI','Machine Learning'], true, true, '2026-06-03'::timestamptz, 3 ),

( 'java-spring-boot-developer-sri-lanka',
  'How to Become a Java & Spring Boot Developer in Sri Lanka',
  'A practical roadmap to becoming a Java and Spring Boot developer in Sri Lanka — skills, projects, and how to stand out.',
  $md$Java and Spring Boot remain the backbone of enterprise software in Sri Lanka — from fintech to telco to global product companies. If you want to build a career as a **Java / Spring Boot developer in Sri Lanka**, here is a grounded roadmap.

## Why Java is still a smart bet here
The biggest tech employers in Sri Lanka — IFS, WSO2, Sysco LABS, 99x, and many banks — run large Java and Spring ecosystems. That means steady demand, strong mentorship, and clear progression for engineers who know the stack well.

## The core skills to build
- **Core Java**: OOP, collections, generics, streams, and concurrency basics.
- **Spring Boot**: REST controllers, dependency injection, Spring Data JPA, validation, and configuration.
- **Databases**: SQL, schema design, and an ORM (Hibernate).
- **Testing**: JUnit and Mockito — companies care a lot about this.
- **Fundamentals**: data structures, algorithms, and a little system design.

## Build real projects
Tutorials get you started; projects get you hired. Build something end-to-end — an API with authentication, a database, and a front end — and put it online. (Mine live on my [projects page](/projects).) A working full-stack app says more than a stack of certificates.

## Stand out as a junior
- Write clean, tested code and explain your decisions.
- Contribute to open source, even small fixes.
- Keep a portfolio and a GitHub that is easy to read.
- Practice talking through your code — interviews are conversations.

## The local advantage
Studying at a university like the [University of Moratuwa](/blog/university-of-moratuwa-it-guide) plugs you into internships and alumni networks at exactly these companies. Use them — and prepare properly for the [IFS, WSO2 and Sysco LABS interviews](/blog/java-interviews-ifs-wso2-sysco-labs).

Want to compare notes or collaborate? [Reach out](/contact) — I am always happy to talk Java.$md$,
  'https://picsum.photos/seed/blog-javasl/1200/630',
  array['Java','Spring Boot','Career','Sri Lanka'], true, true, '2026-06-01'::timestamptz, 4 ),

( 'java-interviews-ifs-wso2-sysco-labs',
  'How to Crack Java Interviews at IFS, WSO2 & Sysco LABS',
  'How interviews at IFS, WSO2, and Sysco LABS actually run, what Java topics they test, and how to prepare with confidence.',
  $md$Landing a Java role at IFS, WSO2, or Sysco LABS is a realistic goal — if you prepare for what they actually test. Here is how their interviews tend to run and how to get ready.

## The typical process
Most follow a similar shape:

1. **Online assessment** — coding and aptitude, often timed.
2. **Technical interview(s)** — core Java, OOP, and problem solving, sometimes with live coding.
3. **Project / design discussion** — they dig into something you have built.
4. **HR / culture fit** — communication, attitude, and goals.

## What they ask (Java)
- **Core Java**: OOP principles, `equals`/`hashCode`, the collections framework, exceptions, generics, and Java 8 streams.
- **Concurrency**: threads, `synchronized`, and common pitfalls.
- **Spring**: dependency injection, bean scopes, REST, and Spring Data basics.
- **DSA**: arrays, strings, hash maps, recursion, and a few sorting/searching problems.
- **System design (lite)**: how would you design a small API or service.

## How to prepare
- Revise core Java until you can explain, not just recite — start with this [Java interview Q&A list](/blog/java-interview-questions-answers).
- Do timed coding practice so the online round does not surprise you.
- Be ready to walk through one project in depth — architecture, trade-offs, and what you would change. See how I document mine on my [projects page](/projects).
- Keep your dev tools handy while practising — a quick [JSON formatter](/tools/json-formatter) or [regex tester](/tools/regex-tester) saves time.

## On the day
Think out loud, clarify the question before coding, and test your own solution. These companies hire for *how you think* as much as what you know.

You have got this — and if you want the roadmap for the role itself, read [how to become a Java / Spring Boot developer in Sri Lanka](/blog/java-spring-boot-developer-sri-lanka).$md$,
  'https://picsum.photos/seed/blog-interviews/1200/630',
  array['Interviews','Java','Career','Sri Lanka'], false, true, '2026-05-28'::timestamptz, 5 ),

( 'full-stack-java-project-spring-boot-react',
  'Building a Full-Stack Java Project with Spring Boot & React',
  'A practical walkthrough of building a full-stack Java app with Spring Boot, React, JWT auth, and PostgreSQL.',
  $md$One complete, well-built project teaches you more than a dozen tutorials. Here is how I approach a **full-stack Java application** with Spring Boot on the back end and React on the front.

## The architecture
A clean separation pays off:

- **Front end**: React (or Next.js) for the UI, talking to the API over HTTP.
- **Back end**: Spring Boot exposing a REST API.
- **Database**: PostgreSQL, accessed through Spring Data JPA / Hibernate.
- **Auth**: JWT-based authentication, with Spring Security guarding the endpoints.

## Designing the API
Start from the data and the use cases. Model your entities, define DTOs so you never leak your database shape to clients, and keep controllers thin — business logic belongs in services. Follow solid [REST API best practices](/blog/spring-boot-rest-api-best-practices) for status codes, validation, and error handling.

## Authentication done right
Issue a JWT on login, validate it in a filter, and keep tokens short-lived. While debugging, a [JWT decoder](/tools/jwt-decoder) is invaluable for inspecting what is actually in your token.

## Connecting the front end
The React app stores the token, attaches it to requests, and handles loading and error states gracefully. Type your API responses — paste a sample into a [JSON-to-TypeScript tool](/tools/json-to-typescript) to generate interfaces in seconds.

## Ship it
Containerize with Docker, deploy the API and database, and host the front end on a platform like Vercel. A live URL turns a project into a portfolio piece.

See full builds like this on my [projects page](/projects) — and if you are interviewing soon, this is exactly the kind of project they love to discuss.$md$,
  'https://picsum.photos/seed/blog-fullstack/1200/630',
  array['Java','Spring Boot','React','Full-Stack'], false, true, '2026-05-24'::timestamptz, 6 ),

( 'university-of-moratuwa-it-guide',
  'Studying IT at the University of Moratuwa: An Honest Guide',
  'An honest guide to studying IT and software engineering at the University of Moratuwa — curriculum, culture, and internships.',
  $md$The University of Moratuwa is Sri Lanka's most competitive destination for engineering and IT — and for good reason. Here is an honest look at studying IT / software engineering there.

## What makes UoM different
Moratuwa pairs a rigorous curriculum with a genuine industry pipeline. Employers like IFS, WSO2, and Sysco LABS recruit heavily from here, and the alumni network opens doors long after you graduate.

## The curriculum
Expect strong fundamentals: programming, data structures and algorithms, databases, operating systems, networks, and software engineering — plus math you will actually use. The workload is real, and so is the payoff.

## The culture
It is intense but collaborative. Group projects, coding competitions, and clubs teach you to work in teams and ship under deadlines — skills that matter as much as any single subject.

## Internships
The mandatory six-month internship is a highlight. It turns theory into practice and frequently leads to a full-time offer.

## How to make the most of it
- Build projects beyond coursework and put them online — start a [portfolio](/projects) early.
- Learn one stack deeply — for many here, that is [Java and Spring Boot](/blog/java-spring-boot-developer-sri-lanka).
- Use the network: seniors, alumni, and lecturers are generous with help.

I am a third-year IT undergraduate at UoM, and the biggest lesson so far is simple: consistency beats cramming. Want to know more about my journey? Read my [story](/about).$md$,
  'https://picsum.photos/seed/blog-uom/1200/630',
  array['University of Moratuwa','Student Life','Career'], false, true, '2026-05-20'::timestamptz, 7 ),

( 'spring-boot-rest-api-best-practices',
  'Spring Boot REST API Best Practices',
  'Eight practical Spring Boot REST API best practices for clean, secure, and maintainable back-end services.',
  $md$A REST API is the contract between your back end and everyone who uses it. These **Spring Boot REST API best practices** keep that contract clean, predictable, and easy to evolve.

## 1. Use the right methods and status codes
GET reads, POST creates, PUT/PATCH update, DELETE removes. Return `201 Created` for new resources, `204 No Content` for deletes, `400` for bad input, and `404` when something is missing. Do not return `200` for everything.

## 2. Never expose your entities
Map between database entities and **DTOs**. It protects your internal model, prevents over-posting, and lets the API and schema evolve independently.

## 3. Validate input
Use Bean Validation (`@Valid`, `@NotNull`, `@Size`) and fail fast with clear messages.

## 4. Handle errors consistently
Use `@ControllerAdvice` to turn exceptions into one structured error response shape. Clients should never see a raw stack trace.

## 5. Version your API
Prefix routes with `/api/v1`. When breaking changes arrive, `/v2` lets existing clients keep working.

## 6. Paginate and filter
Never return an unbounded list. Use `Pageable` and accept query parameters for filtering and sorting.

## 7. Secure it
Authenticate with JWTs, authorize per endpoint with Spring Security, and validate everything. Debug tokens quickly with a [JWT decoder](/tools/jwt-decoder).

## 8. Document it
An OpenAPI / Swagger spec makes your API discoverable and testable.

Master these and your APIs will be a pleasure to consume. For a full walkthrough, see [building a full-stack Java project](/blog/full-stack-java-project-spring-boot-react).$md$,
  'https://picsum.photos/seed/blog-rest/1200/630',
  array['Java','Spring Boot','REST API','Backend'], false, true, '2026-05-16'::timestamptz, 8 ),

( 'java-interview-questions-answers',
  'Java Interview Questions & Answers (Core Java + Spring Boot)',
  'Common Java interview questions and clear answers — core Java, collections, streams, and Spring — for junior developer roles.',
  $md$Here is a focused set of **Java interview questions and answers** that come up again and again — especially for junior roles at Sri Lankan tech companies.

## Core Java
**Q: What is the difference between `==` and `.equals()`?**
`==` compares references (the same object); `.equals()` compares value/equality as defined by the class. Always override `equals` and `hashCode` together.

**Q: Explain the four OOP principles.**
Encapsulation (hide state), Inheritance (reuse via "is-a"), Polymorphism (one interface, many implementations), and Abstraction (expose what, hide how).

**Q: `ArrayList` vs `LinkedList`?**
`ArrayList` gives fast random access (`O(1)`) but slow inserts in the middle; `LinkedList` is fast for inserts/removals but slow to index.

**Q: `String`, `StringBuilder`, and `StringBuffer`?**
`String` is immutable; `StringBuilder` is mutable and fast (not thread-safe); `StringBuffer` is mutable and synchronized.

## Collections & streams
**Q: How does a `HashMap` work?**
It stores key-value pairs in buckets by hash code; good `hashCode`/`equals` keep lookups near `O(1)`.

**Q: What are Java 8 streams good for?**
Declarative data processing — `filter`, `map`, `collect` — that reads clearly and composes well.

## Spring
**Q: What is dependency injection?**
The framework supplies a class's dependencies instead of the class creating them, improving testability and decoupling.

**Q: `@Component` vs `@Service` vs `@Repository`?**
All are beans; the names express intent (`@Service` for business logic, `@Repository` for data access with exception translation).

## How to use this list
Do not memorize — understand, and have an example ready for each. Pair this with the [interview guide for IFS, WSO2 & Sysco LABS](/blog/java-interviews-ifs-wso2-sysco-labs) and you will walk in prepared.$md$,
  'https://picsum.photos/seed/blog-javaqa/1200/630',
  array['Interviews','Java','Spring Boot'], false, true, '2026-05-12'::timestamptz, 9 ),

( 'free-online-tools-for-developers',
  '10 Free Online Tools That Make Developers More Productive',
  'Ten free online tools that make developers and students more productive — all running privately in your browser.',
  $md$The right utility saves minutes every day — and minutes add up. Here are **10 free online tools** that make developers (and students) more productive. Every one runs in your browser, with no sign-up and nothing uploaded.

1. **[JSON Formatter](/tools/json-formatter)** — beautify, validate, and minify JSON.
2. **[Regex Tester](/tools/regex-tester)** — test patterns with live match highlighting.
3. **[Unix Timestamp Converter](/tools/unix-timestamp)** — epoch to date and back.
4. **[Diff Checker](/tools/diff-checker)** — compare two blocks of text instantly.
5. **[Base64 Encoder/Decoder](/tools/base64)** — UTF-8 safe, both directions.
6. **[Hash Generator](/tools/hash-generator)** — SHA-256 and friends via Web Crypto.
7. **[Password Generator](/tools/password-generator)** — strong, random, private passwords.
8. **[QR Code Generator](/tools/qr-code-generator)** — custom QR codes as PNG or SVG.
9. **[Image Compressor](/tools/image-compressor)** — shrink images without uploading them.
10. **[Background Remover](/tools/background-remover)** — get a transparent PNG in seconds.

## Why client-side tools win
Because everything runs locally, these tools are fast, private, and free at any scale — no waiting on a server, and no data leaving your device.

This is just a slice — browse the full [free tools collection](/tools), now over 30 strong, and bookmark the ones you use most.$md$,
  'https://picsum.photos/seed/blog-tools10/1200/630',
  array['Tools','Productivity'], false, true, '2026-05-08'::timestamptz, 10 ),

( 'how-i-built-free-browser-tools-nextjs',
  'How I Built 30+ Free Browser Tools with Next.js & Supabase',
  'How I built 30+ free, client-side browser tools with Next.js and Supabase — architecture, performance, and privacy.',
  $md$I recently added **30+ free, in-browser tools** to this site — from a background remover to a regex tester. Here is how, and why it was a fun engineering problem.

## The goal
Build a growing library of genuinely useful tools that are fast, free, and private — no sign-ups, no uploads, no server bills that scale with traffic. The trick: run everything **client-side**.

## The stack
- **Next.js (App Router)** for routing and server-rendered, SEO-friendly pages.
- **Supabase** for the admin CMS — each tool is a row I can publish, feature, or hide.
- **A code registry** that maps each tool to a lazily-loaded React component, so heavy libraries only download when you open that tool.

## Keeping it fast
Tools like the [background remover](/tools/background-remover) (an on-device AI model) and the [image-to-text OCR](/tools/ocr) tool are large. By importing them only on demand, the rest of the site stays light.

## Privacy by default
Because the work happens in your browser, your files never touch a server. That is not just a nice feature — it is the whole architecture.

## SEO as a side effect
Every tool gets its own page, structured data, and helpful content, which turns the toolbox into an engine for discovery. You can read more about my approach on the [about page](/about).

Explore the result on the [tools page](/tools) — and if there is a tool you wish existed, [tell me](/contact).$md$,
  'https://picsum.photos/seed/blog-build/1200/630',
  array['Next.js','Supabase','Web Development'], false, true, '2026-05-04'::timestamptz, 11 )
on conflict (slug) do nothing;
