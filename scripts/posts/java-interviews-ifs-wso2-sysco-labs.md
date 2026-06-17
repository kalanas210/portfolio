For a Java developer in Sri Lanka, three names sit at the top of almost everyone's wishlist: IFS, WSO2, and Sysco LABS. The pay is good, the engineering is real, and the people you work with will make you sharper. They are also the loops people lose the most sleep over, partly because the process runs longer than a typical local company and partly because nobody tells you what actually happens once the screen-share starts.

I have prepared for these interviews, mentored juniors through them, and sat on the other side of the table for junior screens. Here is the reassuring part: none of these companies are trying to trick you. They are answering one question - can this person reason about code, write it cleanly, and explain why they made each choice. Once that clicks, preparation stops feeling mysterious and starts feeling like a checklist.

This post walks through how the loops are structured, the Java and Spring topics that come up again and again, and a four-week plan to walk in ready. I keep the company-specific parts general and honest. These are preparation patterns, not leaked question banks.

## What these three companies actually build

Knowing the product changes how you prepare, because each company's stack leans on different fundamentals.

- **IFS** builds enterprise resource planning (ERP) software - big, long-lived business systems for manufacturing, asset management, and field service. Data modelling, transactions, and correctness under load matter a lot here. Expect strong emphasis on OOP design, SQL, and how you reason about large, slow-to-change systems.
- **WSO2** builds open-source middleware: API management, integration, and identity and access management. The work sits close to the protocol and platform level, so concurrency, HTTP, OAuth and JWT, and clean abstractions show up more often.
- **Sysco LABS** is the technology arm for Sysco, a large US food-distribution company. This is product engineering at scale - microservices, cloud infrastructure, and a lot of Spring Boot backends serving real business workflows.

> Read the company's engineering blog and skim a couple of their open-source repos before you interview. You do not need to become an expert. Mentioning that you understand what their product solves signals genuine interest far better than a memorised line about admiring the culture.

## How the interview process usually runs

The exact stages shift by role and year, but the shape is consistent across all three.

1. **Online assessment or screening.** Often a timed coding test on a HackerRank-style platform, or a take-home. Two or three problems on data structures, strings, and basic algorithms. The clock is the real enemy, so practise solving under time pressure, not just solving.
2. **Technical interviews.** One or two rounds of live coding plus Java and CS fundamentals. This is where most of your preparation pays off, and where this post spends most of its time.
3. **System or design discussion.** For many roles, a lightweight design conversation: how would you structure this feature, model this data, expose this API. Juniors get a gentler version focused on reasoning, not buzzwords.
4. **Behavioural and cultural fit.** The projects you have built, how you work in a team, how you handle disagreement and failure. Do not treat this as a formality. Strong candidates get filtered here for sounding rehearsed or vague.

Treat every stage as a conversation. Interviewers consistently rank "explained their thinking clearly" above "got the optimal answer instantly."

## The Java topics that come up over and over

You can predict roughly 80% of the technical questions. Build genuine depth in these and surprises become rare.

### Core language and OOP

Be ready to explain `==` versus `.equals()`, why you override `equals` and `hashCode` together, immutability, and the difference between checked and unchecked exceptions. A classic warm-up is implementing `equals` and `hashCode` correctly:

```java
public final class Money {
    private final long cents;
    private final String currency;

    public Money(long cents, String currency) {
        this.cents = cents;
        this.currency = Objects.requireNonNull(currency);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Money other)) return false;
        return cents == other.cents && currency.equals(other.currency);
    }

    @Override
    public int hashCode() {
        return Objects.hash(cents, currency);
    }
}
```

The follow-up that separates juniors: why must a field used in `hashCode` be immutable? A `HashSet` files an object into a bucket based on its hash at insertion time. Mutate that field afterwards and the object hashes to a different bucket, so `contains` looks in the wrong place and reports `false` for an element that is genuinely in the set. Explain that and you have shown you understand the mechanism, not just the rule.

### Collections

Know `ArrayList` versus `LinkedList` trade-offs, how `HashMap` resolves collisions and resizes, and when to reach for a `TreeMap` or `LinkedHashMap`. Expect "what happens if your key's `hashCode` is bad?" The honest answer: buckets degrade toward a list, lookups drift from O(1) toward O(n), and in modern JDKs a bucket converts to a balanced tree once it passes a threshold, which softens the worst case to O(log n). That level of detail tells the interviewer you have read past the surface.

### Concurrency

This is where WSO2 and Sysco LABS backend roles pull candidates apart. You do not need to be a wizard, but you should explain what `volatile` guarantees (visibility, not atomicity), why `synchronized` exists, how a `ReentrantLock` differs from `synchronized` (try-locks, timeouts, fairness), and why a plain `int++` is not thread-safe. A common practical task is making a counter safe:

```java
// Not safe: read-modify-write is three operations,
// and another thread can interleave between them.
private int count = 0;

// Safe and lock-free: a single atomic compare-and-set under the hood.
private final AtomicInteger count = new AtomicInteger();

public void increment() {
    count.incrementAndGet();
}
```

Mention that you reach for an `ExecutorService` instead of `new Thread()` so the pool is managed and bounded, and you signal real-world experience rather than textbook recall.

### Streams and modern Java

Be fluent with `filter`, `map`, `collect`, and `groupingBy`. A frequent live task is grouping or aggregating a list, and knowing the declarative form cold saves you from fumbling syntax under pressure:

```java
Map<String, List<Employee>> byDept = employees.stream()
    .filter(e -> e.salary() > 50_000)
    .collect(Collectors.groupingBy(Employee::department));
```

If the interviewer pushes, be ready to say when a plain loop is clearer than a stream. Knowing the limits of a tool reads as maturity.

## Spring Boot questions you should expect

For IFS and Sysco LABS especially, Spring fluency is assumed rather than tested from scratch. The recurring themes:

- **Dependency injection** - what it is, and why constructor injection beats field injection (immutable dependencies, easy testing, no hidden nulls, no reflection magic to set up a test).
- **Bean stereotypes** - `@Component`, `@Service`, `@Repository`, and `@Controller` are all beans; the names express intent, and `@Repository` adds persistence exception translation.
- **Spring Data JPA** - how a repository interface becomes a working query, the N+1 problem, and where `@Transactional` boundaries belong.
- **REST design** - status codes, request validation, and consistent error responses.

A question I have both asked and been asked: "show me a clean controller." The answer is small, validated, and delegates to a service.

```java
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orders;

    public OrderController(OrderService orders) {
        this.orders = orders;
    }

    @PostMapping
    public ResponseEntity<OrderResponse> create(@Valid @RequestBody CreateOrderRequest req) {
        var created = orders.create(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
```

The N+1 problem deserves its own moment, because it is the most common real performance bug juniors meet and one interviewers love. Loop over 100 orders and touch `order.getCustomer()` on a lazy association, and JPA quietly fires one query for the orders plus 100 more for the customers. The fix is to ask for everything in one query:

```java
@Query("SELECT o FROM Order o JOIN FETCH o.customer WHERE o.status = :status")
List<Order> findByStatusWithCustomer(@Param("status") OrderStatus status);
```

If you want the full checklist behind that controller, I wrote up [Spring Boot REST API best practices](/blog/spring-boot-rest-api-best-practices) separately - validation, error handling, and the small decisions interviewers actually notice.

## Testing, the topic juniors forget

Every one of these companies cares about tests, and most candidates under-prepare. Know JUnit 5 basics and how to mock a dependency with Mockito so you can test a service in isolation:

```java
@Test
void rejectsDuplicateEmail() {
    when(repo.existsByEmail("a@b.com")).thenReturn(true);

    assertThrows(DuplicateEmailException.class,
        () -> service.register("a@b.com"));

    verify(repo, never()).save(any());
}
```

Being able to say "I write tests for my projects, and here is how I would test this method" is a genuine differentiator. It tells the interviewer you have shipped something real, not just followed a tutorial to the end and closed the tab.

## Data structures, algorithms, and a little design

The coding rounds lean on the staples: arrays and strings, hash maps for counting and lookups, two pointers, recursion, and basic tree or graph traversal. You will rarely need an exotic algorithm. You will often need to spot that a `HashMap` turns an O(n^2) brute force into a single O(n) pass.

Practise talking out loud. State your approach, name the time and space complexity, then write the code. If you get stuck, narrate exactly where. Interviewers can nudge you back on track, but only if they can hear your reasoning. Silence while you panic-type reads far worse than "the brute force is O(n^2), let me see if a frequency map gets me to O(n)."

For the lightweight design conversation, practise sketching small systems: a URL shortener, an order service, a notification feature. Cover the data model, the API surface, and one or two trade-offs you would weigh. Walking through a full-stack feature end to end is excellent preparation, and I broke down exactly that in [building a full-stack Java project with Spring Boot and React](/blog/full-stack-java-project-spring-boot-react).

## A four-week preparation plan

Here is a plan that fits around a job or a heavy course load.

1. **Week 1 - core Java.** Revise OOP, collections, exceptions, and generics. Solve two easy array or string problems a day. Re-read your own old code and find one thing you would now do better.
2. **Week 2 - concurrency and streams.** Get comfortable with threads, `volatile`, `synchronized`, atomics, and the stream API. Convert a few loops to streams and back so both forms feel natural under pressure.
3. **Week 3 - Spring and testing.** Build or polish one small Spring Boot API with validation, a database, and a real test suite. Be able to justify every annotation you used.
4. **Week 4 - mock interviews.** Do timed coding, practise explaining out loud, and prepare three project stories you can each tell in two minutes.

Keep a few developer tools open while you grind. A [JSON formatter](/tools/json-formatter) helps you read API payloads at a glance, a [JWT decoder](/tools/jwt-decoder) is handy when you study auth for the WSO2-style identity questions, and a [regex tester](/tools/regex-tester) speeds up the string problems that hide a pattern. They are all free and run in your browser. If you want a head start on the question side, my list of [common Java interview questions and answers](/blog/java-interview-questions-answers) covers the fundamentals you will be drilled on.

## The part most people get wrong

Technical depth gets you through the door, but candidates with similar skills are separated by communication and honesty. When you do not know something, say so and reason toward an answer instead of bluffing. Experienced interviewers spot a bluff instantly, and it costs you more than the missing fact would have. When you do know something, explain it like you are teaching a teammate, because that is precisely the signal these companies are listening for.

Prepare your project stories with the same care as your algorithms. "I built an API" is forgettable. "I built an order API, hit the N+1 problem under load, and fixed it with a fetch join, and here is what I learned about lazy loading" is the kind of answer that earns a yes. If you have not built something end to end yet, that is the single highest-leverage move before you apply. My [roadmap for becoming a Java and Spring Boot developer in Sri Lanka](/blog/java-spring-boot-developer-sri-lanka) lays out how to get there.

Do the reps, build something real, and practise saying your thinking out loud. When you are ready to compare notes or want a second pair of eyes on a project before you apply, [reach out](/contact). I am always happy to talk Java with someone preparing for these interviews.
