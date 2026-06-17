If you are a Sri Lankan student staring at your A/L results and weighing the **Faculty of Information Technology at the University of Moratuwa**, this is the guide I wish someone had handed me before I picked it. I am writing from the inside - as someone who chose IT at Moratuwa, survived the lab nights, and walked out with a stack of shipped projects and a much clearer head about what this place actually does for you, and what it quietly leaves up to you.

Moratuwa carries a reputation. People hear "UoM" and picture engineering, robotics, and the EngEx exhibition. The IT faculty lives a little in the shadow of the engineering faculty, and that shadow breeds myths - some flattering, some discouraging, most of them wrong. The flattering myth says the name alone gets you hired. The discouraging one says IT is "engineering for people who could not do engineering." Both are lazy, and both will lead you to the wrong decision.

So here is the honest version, the one I give the juniors who message me asking "should I come here, and what do I do once I'm in?" No brochure language, no false modesty. Just what the degree is, what it demands, where it genuinely shines, and where you will have to fill the gaps yourself.

## What the IT degree actually is

The Faculty of Information Technology runs a four-year **BSc (Hons) in Information Technology**, with specialization streams that have grown over the years - core IT, Information Technology & Management (ITM), and Interactive Media. It is a separate faculty from the better-known Department of Computer Science & Engineering (CSE), and that distinction matters far more than incoming students realize.

Here is the honest framing:

- **CSE** is the theory-heavy, algorithms-and-systems program that pulls most of the brand-name hype.
- **IT** is more applied and industry-facing - software engineering, databases, web and mobile, networking, and the management of technology.

Neither is "better," and choosing IT does not put you in some lower tier. IT trades a little depth in low-level theory for more breadth in building shippable software and working with real stakeholders. If your dream is competitive programming and a PhD in distributed systems, CSE leans your way. If you want to build products, lead teams, and own full-stack systems end to end, IT is a genuinely strong fit - and in my experience the perceived gap closes almost entirely within your first year of working.

> The degree gives you a strong floor and a dense network. The ceiling is set entirely by what you build outside the syllabus.

## The curriculum, honestly

The first year is foundations, and it is broader than you expect: programming fundamentals (you will meet C first, then move toward Java), mathematics, a hardware and electronics module that ambushes pure-software people, and communication skills. Plenty of students arrive expecting to jump straight into building apps and instead spend semester one on pointers, recursion, and discrete math. That is by design. It filters for people who can reason about a problem, not just paste a tutorial.

That C-first start is not busywork. The first time you have to track memory yourself, the abstractions you later rely on in Java or JavaScript stop being magic:

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n = 5;
    int *arr = malloc(n * sizeof(int));   // ask the OS for memory
    if (arr == NULL) return 1;            // always check - it can fail

    for (int i = 0; i < n; i++) {
        arr[i] = i * i;                   // 0, 1, 4, 9, 16
    }
    free(arr);                            // give it back, or it leaks
    return 0;
}
```

Forget that `free`, or write past index 4, and you learn what a memory leak and a segfault feel like. Every garbage-collected language you touch afterward makes more sense because of it.

From second year on, the program turns noticeably more practical:

- **Software engineering and OOP** - design, UML, version control, and working in a team that has to integrate each other's code.
- **Data structures and algorithms** - the part that shows up in every single interview, so do not coast through it.
- **Databases** - relational modelling, SQL, normalization, then NoSQL. When you are exporting and debugging messy queries, a [SQL formatter](/tools/sql-formatter) makes a wall of single-line SQL readable in seconds.
- **Web and mobile development** - where most people first feel like real engineers.
- **Networking and operating systems** - drier, but the subnet math genuinely matters; a [subnet calculator](/tools/subnet-calculator) saved me more than once in those tutorials.
- **Management modules** (heavier in the ITM stream) - project management, IT strategy, and entrepreneurship.

The single most valuable academic component is the **final-year project (FYP)**. It is a full year building something substantial, ideally with a real client or a research angle. Treat it as a throwaway and it stays a throwaway. Treat it seriously and it becomes the centerpiece of your CV and the thing every interviewer wants to dig into.

## The culture and student life

Moratuwa culture is intense and proud. The campus runs on group work, late labs, and a fierce batch identity. A few things that defined my experience:

- **Batch and society life is real.** The IEEE student branch, the Rotaract club, MoraSpirit, and faculty-level societies run hackathons, workshops, and outreach all year. Joining one is the fastest way to find your people and pick up skills the syllabus skips entirely.
- **Competitions are everywhere.** Hackathons, ideathons, and inter-university coding contests run constantly. You do not need to win - you need to enter, because that is where you meet seniors, recruiters, and the collaborators for your next project.
- **The workload is heavy and bursty.** Deadlines cluster. You will hit weeks where three deliverables and a viva land on the same two days. Calendar discipline is not optional here.
- **It is collaborative, not cutthroat.** The seniors-helping-juniors culture is genuinely strong. Ask for help early and often. The students who struggle most are almost always the ones who go quiet and try to tough it out alone.

If you are coming from outside Colombo, the adjustment to commuting or hostel life is its own learning curve. Budget for it mentally, not just financially.

## The internship year is the real prize

This is the part I tell every prospective student about, because it is where Moratuwa's value compounds. The program includes a **structured industrial training period**, typically around six months in third year, coordinated through the faculty's industrial training unit. It plugs you directly into the companies that hire the most graduates.

That means realistic shots at internships and graduate roles at places like **WSO2** (open-source middleware, integration and identity), **IFS** (enterprise ERP), **Sysco LABS** (engineering for the US food-distribution giant Sysco), **99x**, Virtusa, and a long tail of startups and product teams. The alumni network inside these companies is dense, and a Moratuwa internship is a signal recruiters recognize on sight.

A few hard truths about the internship hunt:

1. **Your GPA opens the first door; your projects open the rest.** A clean GitHub and one solid full-stack app beat a folder of completion certificates every time.
2. **Interview prep is on you.** The faculty does not spoon-feed it. Drill data structures, core Java, and basic system design. I wrote up [how the IFS, WSO2 and Sysco LABS interviews actually run](/blog/java-interviews-ifs-wso2-sysco-labs) and a set of [Java interview questions and answers](/blog/java-interview-questions-answers) precisely because this gap caught me off guard.
3. **Convert the internship.** Treat the six months as one long interview. A large share of graduate offers come from intern performance, not a fresh application cycle the following year.

## What the degree will not do for you

Let me be blunt, because this is the part that earns the word "honest" in the title. A degree from Moratuwa is a strong starting signal, not a finished product. The things that actually got me hired, and that kept me growing afterward, all happened on my own time:

- **Learn one real stack deeply.** The syllabus exposes you to many technologies shallowly. Pick a lane and go deep. For me that was [Java and Spring Boot, which is a smart bet in the Sri Lankan market](/blog/java-spring-boot-developer-sri-lanka). Knowing a framework well means understanding what it does *for* you, like collapsing a class of boilerplate into a few annotations:

```java
@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentRepository repo;

    public StudentController(StudentRepository repo) {
        this.repo = repo;   // constructor injection - Spring wires this in
    }

    @GetMapping("/{id}")
    public Student getById(@PathVariable Long id) {
        return repo.findById(id)
                   .orElseThrow(() -> new StudentNotFoundException(id));
    }
}
```

No module hands you that depth. You build it by writing real endpoints, breaking them, and reading the stack traces.

- **Build and ship in public.** A deployed app with a database, authentication, and a front end teaches you more than any single course. Put the good ones on a [projects page](/projects) and keep your GitHub readable - a clear README beats a clever commit history.
- **Master the boring tools early.** Git, the command line, the debugger, and the habit of actually reading documentation. The small everyday utilities - a [JSON formatter](/tools/json-formatter), a [regex tester](/tools/regex-tester), a [JWT decoder](/tools/jwt-decoder) for poking at an auth token - become muscle memory and save you real hours every week.
- **Write.** Explaining what you built, in a blog post or a thorough README, is a competitive edge almost no junior bothers to develop. It forces you to actually understand your own code.

The students who thrive treat the degree as scaffolding and do the construction themselves.

## Is it worth it? My honest take

Yes, with one condition attached. If you come to Moratuwa expecting the institution to hand you a career, you will be disappointed, and you will likely be outpaced by a self-taught developer with a sharper portfolio and more shipped work. If instead you come treating it as a four-year head start - a strong foundation, a dense alumni network, a near-guaranteed shot at the best internships in the country, and a batch of smart, motivated peers who push you - then it is one of the best decisions you can make as a Sri Lankan tech student.

The degree gave me the floor and the connections. Everything that made me employable, I built on top of that floor, deliberately, one project at a time. That is the deal, and it is a good one if you take your half of it seriously.

If you are about to start, or you are deep in the lab nights right now and want to compare notes, [reach out](/contact). I am always happy to talk with students figuring out the same path I did - and you can see where that path led on my [projects page](/projects).
