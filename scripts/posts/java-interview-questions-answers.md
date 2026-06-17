When I prepared for my first Java interviews, I made the same mistake most students make: I memorized definitions. I could recite "encapsulation is hiding internal state" word for word, then freeze the moment an interviewer asked me to actually use it in code. Junior Java interviews are rarely about reciting textbook lines. They test whether you understand what the language is doing underneath and whether you can reason out loud while you write.

This is the guide I wish I had had. It covers the core Java questions that come up again and again for junior roles, plus the Spring Boot questions you will get the moment Spring appears on your CV. I have grouped them so you can study in passes. For each one I give the short answer you say first, then the depth you reach for when the interviewer pushes - because they always push.

> The questions are predictable. What separates candidates is whether you can explain the *why*, write correct code under mild pressure, and admit cleanly when you do not know something.

## How to use this list

Read the question, cover the answer, and say your response out loud before reading mine. If you cannot explain it in two sentences, you do not understand it yet. Interviewers can hear the difference between "I have read this" and "I have used this," so aim for the second. The fastest way to get there is to type the code examples below into a real project and break them on purpose.

For the small things that trip people up mid-interview - formatting a JSON payload you are reasoning about, decoding a JWT from a Spring Security flow, testing a regex you half-remember - I keep a set of [developer tools](/tools) open in another tab while I prepare.

## Core Java: language fundamentals

**What is the difference between `==` and `.equals()`?**

`==` compares references for objects (do these two variables point to the same object in memory), while `.equals()` compares logical equality as defined by the class. For primitives, `==` compares values directly. The classic gotcha is `String`:

```java
String a = new String("hello");
String b = new String("hello");
System.out.println(a == b);        // false - different objects
System.out.println(a.equals(b));   // true  - same characters
```

The follow-up is guaranteed: if you override `equals()`, you must override `hashCode()`. Two objects that are equal must return the same hash code, otherwise they break in a `HashMap` or `HashSet` - you will store a key and never find it again.

**What is autoboxing, and where does it bite?**

Autoboxing is the automatic conversion between primitives (`int`) and their wrapper types (`Integer`). The trap is comparing wrappers with `==`:

```java
Integer x = 127, y = 127;
Integer p = 128, q = 128;
System.out.println(x == y); // true  - cached
System.out.println(p == q); // false - new objects
```

Java caches `Integer` values from -128 to 127, so small values share references and large ones do not. Always use `.equals()` for wrapper comparison. The other bite is a hidden `NullPointerException`: unboxing a `null Integer` into an `int` throws, and it does it on an innocent-looking line like `int total = map.get(key);`.

**Explain `String`, `StringBuilder`, and `StringBuffer`.**

`String` is immutable - every modification creates a new object. `StringBuilder` is mutable and not thread-safe, which makes it fast and the right default for building strings in a loop. `StringBuffer` is the thread-safe (synchronized) version you rarely need. If an interviewer sees you concatenating strings inside a loop with `+`, they will ask why you did not use a `StringBuilder` - because each `+` allocates a brand new `String`, turning an O(n) loop into O(n^2) work.

**What is the difference between `final`, `finally`, and `finalize`?**

They sound alike and have nothing to do with each other:

- `final` makes a variable constant, a method non-overridable, or a class non-extendable.
- `finally` is the block after `try`/`catch` that always runs, used for cleanup.
- `finalize()` was a method called before garbage collection. It is deprecated for removal - do not bring it up as good practice. If asked about cleanup, mention try-with-resources instead.

## Core Java: OOP and inheritance

**What is the difference between an abstract class and an interface?**

An abstract class can hold state (fields), constructors, and a mix of implemented and abstract methods, and a class can extend only one. An interface describes a contract; since Java 8 it can carry `default` and `static` methods, but it still cannot hold instance state, and a class can implement many.

```java
interface Drawable {            // a capability
    void draw();
    default void clear() { System.out.println("clearing"); }
}

abstract class Shape {          // shared state and partial implementation
    private final String name;
    protected Shape(String name) { this.name = name; }
    abstract double area();
    String label() { return name + ": " + area(); }
}
```

The practical rule I give: use an interface to say "this thing *can do* X" and an abstract class to share common implementation among closely related types. Multiple inheritance of behaviour comes from interfaces; multiple inheritance of state is what Java refuses, and that is why abstract classes are single.

**Explain method overloading versus overriding.**

Overloading is multiple methods with the same name but different parameter lists, resolved at compile time. Overriding is a subclass providing a new implementation of a parent method with the same signature, resolved at runtime through dynamic dispatch.

```java
class Animal { String sound() { return "..."; } }
class Dog extends Animal {
    @Override String sound() { return "woof"; } // overriding
}
```

Always use the `@Override` annotation. It makes the compiler catch a mistyped signature that would otherwise silently become a brand new method instead of an override - one of the most common bugs juniors ship without noticing.

**What does polymorphism actually give you?**

It lets you write code against a base type and let the JVM pick the right implementation at runtime. That is what makes `List<String> list = new ArrayList<>();` work, and it is the reason you program to interfaces, not concrete classes. Swap `ArrayList` for `LinkedList` and not a single line of calling code changes.

## Core Java: collections

**Compare `ArrayList` and `LinkedList`.**

`ArrayList` is backed by a resizable array - fast random access (O(1) by index), slower inserts in the middle because elements shift. `LinkedList` is a doubly linked list - cheap inserts and removals at the ends, but O(n) to reach an index. In real code, `ArrayList` wins almost every time, because cache-friendly arrays beat pointer-chasing even where Big-O says otherwise. Say that honestly; interviewers like candidates who know the textbook answer *and* the pragmatic one.

**How does a `HashMap` work internally?**

This is the single most common collections question, so know it cold. A `HashMap` stores entries in buckets indexed by the key's `hashCode()`. When two keys land in the same bucket, they form a chain - a linked list that converts to a balanced tree once the bucket grows past a threshold (eight entries) in modern Java, keeping worst-case lookup at O(log n) instead of O(n). A lookup computes the hash, finds the bucket, then walks it calling `equals()` to find the exact key. This is exactly why a broken `hashCode`/`equals` pair corrupts your map: a key whose hash code changes after insertion is lost in a bucket you can no longer compute.

**`HashMap` vs `Hashtable` vs `ConcurrentHashMap`?**

`HashMap` is not thread-safe and allows one null key. `Hashtable` is legacy and fully synchronized, so every operation grabs one lock and threads queue up. `ConcurrentHashMap` gives thread safety with far better throughput by locking only the bucket being written, leaving reads mostly lock-free. For multi-threaded code, reach for `ConcurrentHashMap` and never `Hashtable`.

## Core Java: exceptions and concurrency

**Checked versus unchecked exceptions?**

Checked exceptions (extending `Exception`) must be declared or handled - the compiler enforces it, for example `IOException`. Unchecked exceptions (extending `RuntimeException`) signal programming bugs like `NullPointerException` and do not need declaring. A strong follow-up answer: never catch an exception just to swallow it silently. Either handle it meaningfully or let it propagate, because an empty `catch` block is a bug that hides other bugs.

**What is the difference between a process and a thread, and how do you create one?**

A process has its own memory; threads share the memory of their process, which is what makes them light but also dangerous around shared state. You create one by implementing `Runnable` and passing it to a `Thread`, or better, by submitting tasks to an `ExecutorService`:

```java
ExecutorService pool = Executors.newFixedThreadPool(4);
pool.submit(() -> System.out.println("work on " + Thread.currentThread().getName()));
pool.shutdown();
```

The follow-up is the *why it is dangerous*. Two threads incrementing a shared `int` can lose updates, because `count++` is read-modify-write, not one atomic step. Be ready to name the fixes: `synchronized` to serialize access, `volatile` to guarantee visibility of writes across threads, and `AtomicInteger` for lock-free counters. You do not need deep expertise for a junior role, but knowing this vocabulary signals you have thought about correctness.

## Java 8 and modern features

Most teams now run Java 17 or 21, so expect questions on features from Java 8 onward.

**What is a lambda and a functional interface?**

A functional interface has exactly one abstract method, and a lambda is a concise way to implement it. `Runnable`, `Comparator`, and `Function` are functional interfaces. The Streams API builds on this:

```java
List<String> names = List.of("kalana", "amal", "nimal");
String result = names.stream()
    .filter(n -> n.length() > 4)
    .map(String::toUpperCase)
    .collect(Collectors.joining(", "));
```

A good thing to add unprompted: streams are about *what*, not *how*, and they do not mutate the source list. If you find yourself reaching for a side effect inside `forEach`, a plain loop is usually clearer and you should say so.

**What problem does `Optional` solve?**

`Optional` makes the possibility of "no value" explicit in the type, instead of returning `null` and hoping the caller checks. Use it as a return type; do not use it for fields or method parameters. The idiomatic pattern chains a transform and a fallback in one expression:

```java
return repository.findById(id)
    .map(User::getEmail)
    .orElse("unknown");
```

Calling `.get()` without checking `isPresent()` defeats the entire point, so avoid it in interview code - reviewers notice.

## Spring Boot fundamentals

The moment Spring Boot is on your CV, these come up.

**What is dependency injection and the IoC container?**

Inversion of Control means the framework, not your code, creates and wires objects. Dependency injection is how it hands those objects to you. Instead of `new UserRepository()` inside your service, Spring constructs the repository and injects it. This makes code testable - you pass a mock in a test - and decoupled, because your service depends on an interface, not a concrete class it built itself.

**Constructor injection or field injection?**

Prefer constructor injection. It makes dependencies explicit, allows `final` fields, and works without reflection in tests.

```java
@Service
public class UserService {
    private final UserRepository repository;

    public UserService(UserRepository repository) { // Spring injects this
        this.repository = repository;
    }
}
```

Field injection with `@Autowired` on a field hides dependencies, allows objects to exist half-constructed, and forces reflection to set them in tests. Saying this in an interview signals you have read real Spring guidance rather than the first tutorial you found.

**Explain `@Component`, `@Service`, `@Repository`, and `@Controller`.**

All four register a class as a Spring bean. They are mostly the same mechanically, but the names communicate intent and some add behaviour: `@Repository` translates vendor-specific persistence exceptions into Spring's `DataAccessException` hierarchy, and `@Controller`/`@RestController` mark web request handlers. Use the most specific one for the layer you are in.

**What does auto-configuration do, and what is a starter?**

Auto-configuration inspects your classpath and wires sensible defaults - put an H2 driver on the classpath and you get an in-memory datasource, add `spring-boot-starter-web` and you get an embedded Tomcat. A *starter* is a curated dependency bundle that pulls in everything a feature needs with versions already aligned, so you are not hand-picking compatible releases. Auto-configuration backs off the moment you define your own bean, which is the mechanism that lets you override any default. That combination is the core reason Spring Boot feels faster than classic Spring.

## Spring Boot web and data

**How do you build a REST endpoint?**

```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService service;

    public UserController(UserService service) { this.service = service; }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUser(@PathVariable Long id) {
        return service.findById(id)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
```

Know the difference between `@PathVariable` (part of the URL path), `@RequestParam` (query string), and `@RequestBody` (deserialized JSON). When you are debugging the response, [formatting the JSON body](/tools/json-formatter) or [decoding a bearer token](/tools/jwt-decoder) makes it readable in seconds.

**What is the difference between JPA, Hibernate, and Spring Data JPA?**

JPA is the specification (a set of interfaces and annotations), Hibernate is the most common implementation, and Spring Data JPA is the Spring layer that generates repository implementations for you from method names like `findByEmailAndActiveTrue`. Expect a follow-up on the N+1 query problem: it happens when you fetch a list and then lazily load a relation for each row, firing one query per item instead of one for the lot. You fix it with a `JOIN FETCH` or an entity graph.

**What does `@Transactional` actually do?**

Spring wraps the annotated method in a proxy that opens a transaction before it runs and commits when it returns, rolling back if an unchecked exception escapes. Two gotchas worth naming: by default it only rolls back on `RuntimeException`, not checked exceptions, and because it works through a proxy, one method in a class calling another `@Transactional` method on `this` bypasses the proxy entirely, so the inner annotation does nothing. Mentioning the self-invocation trap puts you ahead of most juniors.

**How do you handle exceptions globally?**

Use `@RestControllerAdvice` with `@ExceptionHandler` methods to map exceptions to clean HTTP responses in one place, instead of repeating try/catch in every controller. Return a consistent error shape so clients can parse failures the same way every time.

## How to actually pass the interview

Knowing answers is half of it. The other half is behaviour:

1. **Think out loud.** A wrong answer reasoned out loud beats a right answer pulled from nowhere. Interviewers are hiring a problem-solver, not a search engine.
2. **Admit gaps cleanly.** "I have not used that, but here is how I would find out" is a strong answer. Bluffing is the fastest way to fail, because the next question exposes it.
3. **Have one project you can defend deeply.** Companies in Sri Lanka and elsewhere - the WSO2s, IFSs, and Sysco LABS of the world - will dig into something on your CV. Pick a project, know every decision in it, including the ones you would change now.
4. **Write code, even on a whiteboard.** Practice syntax until it is automatic, so your brain is free for the actual problem rather than for remembering where the semicolons go.

The reassuring truth is that the junior Java pool is large but shallow - most candidates memorize and freeze. If you genuinely understand `equals`/`hashCode`, how a `HashMap` resolves collisions, why constructor injection wins, and what auto-configuration backs off for, you are already ahead of the median.

If this helped, the best next move is to build something real: a small Spring Boot CRUD API with a few tests teaches you more than any list of questions. Skim [my projects](/projects) for ideas on scope, keep the [developer tools](/tools) handy while you work, and if you want to talk through a specific role or a piece of feedback you got, [reach out](/contact). Good luck - you have got this.
