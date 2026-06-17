I have shipped a fair number of Spring Boot services, and I have also inherited a few that made me want to close the laptop and go for a walk. The difference between the two is almost never the framework. Spring Boot hands you a lot of power on day one, and it will just as happily let you build something fragile if you do not impose a bit of discipline. The endpoint that returns `200 OK` with `"success": false` buried in the body, the controller that swallows every exception into a generic 500, the entity that doubles as the response payload and leaks a `passwordHash` field - these are small decisions that compound into a service nobody wants to touch.

This post is the set of practices I keep coming back to. None of them are exotic. They are the boring, repeatable habits that make a REST API predictable for the people calling it and pleasant for the next engineer who has to extend it. The examples are concrete and idiomatic, the kind of thing you can paste into a real Spring Boot 3 project and adapt. If you want to follow along, assume a standard `spring-boot-starter-web` plus `spring-boot-starter-validation` and `spring-boot-starter-data-jpa` setup on Java 17 or later.

## 1. Separate your DTOs from your entities

The single most common mistake I see is exposing JPA entities directly from controllers. It feels efficient - one class, less typing - but it welds your database schema to your public API contract. Rename a column and you have just broken every client. Worse, a lazy-loaded relationship can trigger a surprise query during JSON serialization, blowing up with a `LazyInitializationException` outside the transaction, and you can accidentally serialize fields that were never meant to leave the server.

Use dedicated request and response DTOs. Java records make this almost free:

```java
public record CreateUserRequest(
    @NotBlank String name,
    @Email String email
) {}

public record UserResponse(
    Long id,
    String name,
    String email
) {
    public static UserResponse from(User user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail());
    }
}
```

The entity stays an internal detail. The DTO is your contract. They are allowed to drift apart, and that freedom is the whole point: you can refactor the persistence model freely as long as the mapping in `from` still produces the same JSON. When you need a typed client for that contract, generating one from a sample payload with a [JSON to TypeScript](/tools/json-to-typescript) converter is a quick way to hand the frontend an accurate model.

## 2. Design URLs around resources, not actions

REST is about resources, and HTTP verbs already carry the action. A URL like `/api/getUserById?id=5` is a remote procedure call wearing an HTTP costume. Name nouns, use plurals, and let the method do the verb's job.

- `GET /api/v1/users` - list users
- `GET /api/v1/users/{id}` - fetch one user
- `POST /api/v1/users` - create a user
- `PUT /api/v1/users/{id}` - replace a user
- `PATCH /api/v1/users/{id}` - partially update a user
- `DELETE /api/v1/users/{id}` - remove a user

Nest sub-resources where ownership is real: `GET /api/v1/users/{id}/orders`. But do not nest more than two levels deep. Past that the URLs get unwieldy, and you are usually better off with a top-level resource and a query parameter. One detail people skip: `PUT` is a full replacement and `PATCH` is a partial update, so a `PUT` with a missing field should null that field out, not leave it untouched. If clients expect "only send what changed," that is `PATCH`. Conflating the two is a quiet source of data-loss bugs.

> A good URL is one a developer can guess. If your API needs a lookup table to explain which endpoint does what, the design is doing too much explaining and not enough conveying.

## 3. Return the right status codes, all of them

HTTP status codes are a free, standardized signaling layer, and an alarming number of APIs throw it away by returning `200` for everything and stuffing a `"success": false` into the body. Clients then have to parse the body just to learn the request failed. Use the protocol.

- `200 OK` for a successful read or update that returns a body.
- `201 Created` for a successful creation, with a `Location` header pointing at the new resource.
- `204 No Content` for a successful delete or an update with nothing to return.
- `400 Bad Request` for malformed input or validation failures.
- `401 Unauthorized` when authentication is missing or invalid, `403 Forbidden` when the user is known but not allowed.
- `404 Not Found` for a resource that does not exist.
- `409 Conflict` for a duplicate email, an optimistic-locking version mismatch, or any state collision.

```java
@PostMapping("/api/v1/users")
public ResponseEntity<UserResponse> create(@Valid @RequestBody CreateUserRequest request) {
    UserResponse created = userService.create(request);
    URI location = URI.create("/api/v1/users/" + created.id());
    return ResponseEntity.created(location).body(created);
}
```

The distinction between `401` and `403`, and between `400` and `409`, is exactly the kind of detail that makes an API feel professional to integrate against. Client retry logic depends on it: a `409` might be worth retrying after a refetch, a `400` never is.

## 4. Validate at the edge with Bean Validation

Never trust input, and never scatter validation through your service layer with hand-rolled `if (name == null)` blocks. Spring's Bean Validation integration lets you declare constraints on the DTO and enforce them with a single `@Valid` annotation. Invalid requests are rejected before your business logic ever runs.

```java
public record CreateOrderRequest(
    @NotNull Long productId,
    @Min(1) @Max(100) int quantity,
    @NotBlank @Size(max = 280) String note
) {}
```

When validation fails, Spring throws `MethodArgumentNotValidException`. Catch it centrally (next section) and shape it into a clean response, so a malformed request gets a `400` with a precise, field-level explanation every time, without per-endpoint checks. For rules the built-in annotations cannot express, write a custom `ConstraintValidator` rather than dropping back into manual checks, and if a constraint leans on a regex, sanity-check the pattern with a [regex tester](/tools/regex-tester) first so it matches exactly what you think it does.

## 5. Centralize error handling with @RestControllerAdvice

Exception handling sprawled across controllers is a maintenance trap. Spring's `@RestControllerAdvice` lets you handle every exception type in one place and return a consistent error shape. I strongly recommend the RFC 7807 `ProblemDetail` format that Spring Boot 3 supports natively. It gives clients a predictable, machine-readable error body with a stable set of fields.

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ProblemDetail handleNotFound(ResourceNotFoundException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
            HttpStatus.NOT_FOUND, ex.getMessage());
        problem.setTitle("Resource Not Found");
        return problem;
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidation(MethodArgumentNotValidException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
            HttpStatus.BAD_REQUEST, "One or more fields are invalid");
        problem.setTitle("Validation Failed");
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
            .forEach(e -> errors.put(e.getField(), e.getDefaultMessage()));
        problem.setProperty("errors", errors);
        return problem;
    }
}
```

Now every error comes back in the same envelope, whether it is a missing resource, a validation failure, or an unexpected `RuntimeException`. Add one catch-all `@ExceptionHandler(Exception.class)` that returns a `500` with a generic message and logs the stack trace server-side, so an internal failure never leaks an exception class name or a SQL fragment to the caller. Clients write one error parser instead of guessing.

## 6. Version your API from day one

You will change your API. The only question is whether you have a path to do it without breaking existing clients. Decide on a versioning strategy before you ship, because retrofitting one onto a live API is genuinely painful.

URI versioning is the most common and the easiest to reason about - the version sits right there in the path:

```java
@RestController
@RequestMapping("/api/v1/users")
public class UserController { /* ... */ }
```

When a breaking change arrives, you stand up `/api/v2/users` alongside the existing controller and migrate clients on their own schedule. Be deliberate about what "breaking" means: adding an optional field or a new endpoint is backward compatible and needs no new version, but removing a field, renaming one, or tightening a validation rule does. Header-based versioning is cleaner in theory but harder to test, since you cannot just paste a URL into a browser. For most services a `/v1` in the path is the pragmatic winner. Whichever you pick, apply it consistently from the first commit.

## 7. Paginate, filter, and sort large collections

A `GET /api/v1/users` that returns every row will work fine in development and fall over in production the day the table grows. Never return an unbounded collection. Spring Data's `Pageable` handles pagination, sorting, and page metadata almost for free.

```java
@GetMapping("/api/v1/users")
public Page<UserResponse> list(
    @RequestParam(required = false) String email,
    @PageableDefault(size = 20, sort = "createdAt") Pageable pageable) {
    return userService.search(email, pageable)
        .map(UserResponse::from);
}
```

A client then calls `GET /api/v1/users?page=0&size=20&sort=name,asc`. The `Page` response carries `totalElements`, `totalPages`, and `number`, so clients can build a proper pagination control. Two guardrails matter. Cap the maximum page size with `spring.data.web.pageable.max-page-size` so nobody can request `size=1000000` and exhaust your heap. And whitelist the fields a client may sort by, because an arbitrary `sort` parameter maps straight onto entity properties and can expose ordering on columns you never meant to be sortable.

## 8. Lock the API down by default

Security is easy to defer and expensive to skip. The core principle is deny-by-default: lock down every endpoint and open up only what should be public, rather than the reverse. With Spring Security 6 the configuration is an explicit `SecurityFilterChain` bean.

```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    return http
        .csrf(csrf -> csrf.disable()) // safe for a stateless token API
        .sessionManagement(s -> s.sessionCreationPolicy(STATELESS))
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/v1/auth/**").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/v1/public/**").permitAll()
            .anyRequest().authenticated())
        .oauth2ResourceServer(oauth -> oauth.jwt(Customizer.withDefaults()))
        .build();
}
```

The `anyRequest().authenticated()` line is what makes this safe: a new endpoint is protected the moment it exists, so you can never forget to secure one. A few non-negotiables beyond the filter chain:

- Use stateless JWT or OAuth2 tokens rather than server-side sessions, validate every token's signature and expiry, and never log a credential or token. When you are debugging one by hand, decode it with a [JWT decoder](/tools/jwt-decoder) instead of pasting it into a random website.
- Enforce HTTPS in production and reject plain HTTP.
- Apply rate limiting on authentication and other sensitive endpoints.
- On a sensitive resource, return `403` or `404` without revealing whether the resource exists, so an attacker cannot probe for valid ids.

## 9. Document it honestly with OpenAPI

Documentation that lives apart from the code rots the moment a deadline hits. Add `springdoc-openapi` and you get an interactive Swagger UI plus an OpenAPI spec generated straight from your annotations. It stays in sync because it is derived from the code, which is the only kind of documentation that survives contact with a real release.

```java
@Operation(summary = "Fetch a user by id")
@ApiResponse(responseCode = "200", description = "User found")
@ApiResponse(responseCode = "404", description = "User not found")
@GetMapping("/{id}")
public UserResponse getById(@PathVariable Long id) {
    return userService.findById(id);
}
```

The generated spec is useful well beyond the browser. Hand the JSON to frontend teammates to generate a typed client, or check it into source control and diff it on every pull request to catch accidental contract changes before they ship.

## Bringing it together

None of these nine practices is hard in isolation. The value is in applying them consistently, because consistency is what turns a pile of endpoints into an API that feels designed: keep DTOs and entities apart, model resources not actions, speak HTTP status codes fluently, validate at the edge, handle errors in one place, version up front, never return unbounded lists, deny by default, and treat documentation as a feature.

If I had to pick the two that pay off fastest on a real team, it would be the global exception handler and DTO separation. They prevent the largest class of subtle, late-night bugs and cost almost nothing to add early. Start there on your next service, layer in the rest as you go, and the codebase will thank you six months from now.

If you build something with these and want to talk through a design decision, I am happy to dig in - [reach out here](/contact), or take a look at a few of the [projects](/projects) where I have put these patterns to work.
