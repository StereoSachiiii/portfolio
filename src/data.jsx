import React from 'react';
import { Github, Linkedin, Twitter, Activity, Gauge, Binary, Terminal, Code2 } from 'lucide-react';
import { TechIcon } from './components/TechIcon';

export const data = {
  identity: {
    name: "Sachin",
    oneLine: "Systems engineer building things close to the metal.",
    philosophy: "I build high-performance infrastructure and trading systems. Focused on memory safety, nanosecond latency, and making software that respects the hardware.",
    photo: "https://api.dicebear.com/7.x/initials/svg?seed=SL&backgroundColor=000000&fontFamily=Inter",
    stack: [
      { label: "C++", icon: <TechIcon name="cplusplus" /> },
      { label: "Go", icon: <TechIcon name="go" /> },
      { label: "Python", icon: <TechIcon name="python" /> }
    ],
    links: [
      { id: "github", icon: <Github size={18} />, url: "https://github.com/StereoSachiiii" },
      { id: "linkedin", icon: <Linkedin size={18} />, url: "https://linkedin.com/in/sachin" },
      { id: "twitter", icon: <Twitter size={18} />, url: "https://twitter.com/stereosachin" }
    ]
  },
  projects: [
    {
      id: "backtesting",
      category: "SYSTEMS",
      title: "Backtesting Engine",
      highlight: "processes 48M market events/sec",
      tags: "A trading system that simulates how hedge funds read and react to market data — built from scratch in C++.",
      description: "Built a trading system that reads live market data from NASDAQ and reconstructs a full order book in real time — tracking every buy and sell order, detecting trading signals, and simulating a market-making strategy. Written in C++ with a focus on speed; every design decision was made to minimize latency at the nanosecond level.",
      stack: [
        { name: "C++", icon: <TechIcon name="cplusplus" /> },
        { name: "CMake", icon: <TechIcon name="cmake" /> },
        { name: "Linux", icon: <TechIcon name="linux" /> }
      ],
      metrics: [
        { label: "Parser Throughput (L1)", value: "48.29M msg/s", sub: "Processes 48 million market events per second" },
        { label: "OrderBook Latency (L3)", value: "69.9ns avg", sub: "Reacts to market events in ~70 billionths of a second" },
        { label: "Realized PnL", value: "$14,398", sub: "Simulated profit on full-day NASDAQ data; all positions closed" }
      ],
      pipeline: [
        { name: "ITCH File", group: "Data", desc: "Raw binary NASDAQ broadcast" },
        { name: "File Reader", group: "Data", desc: "Buffered I/O for multi-GB files" },
        { name: "Parser", group: "Data", desc: "Zero-copy message decoding" },
        { name: "OB Manager", group: "Core", desc: "Multi-symbol book coordinator" },
        { name: "OrderBook", group: "Core", desc: "Bitset-accelerated LOB (O1)" },
        { name: "Signal", group: "Core", desc: "Multi-level OFI & Z-Score" },
        { name: "Strategy", group: "Execution", desc: "Market-making logic" },
        { name: "Matcher", group: "Execution", desc: "Virtual fill simulation" },
        { name: "PnL", group: "Execution", desc: "Real-time risk tracking" }
      ],
      timeline: [
        { date: "Feb 11", event: "Initial foundation: SPSC lock-free ring buffer" },
        { date: "Feb 24", event: "NASDAQ ITCH 5.0 parser: Zero-copy decoder" },
        { date: "Mar 15", event: "L3 Orderbook: Bitset-accelerated traversals" },
        { date: "Apr 02", event: "OFI Signal: Multi-level imbalance pipeline" },
        { date: "May 06", event: "Virtual Matcher: Queue depth & fill logic" }
      ],
      whyParagraph: "NASDAQ broadcasts 10,000+ messages per second per symbol. std::map is O(log n) with pointer chasing through heap-allocated red-black tree nodes. std::unordered_map has unpredictable rehash latency spikes. Neither is acceptable when your entire strategy depends on reacting before the next message arrives. Every standard library assumption — general purpose allocation, virtual dispatch, exception safety overhead — becomes a liability at this timescale.",
      buildStory: "Started as a binary parser in March. 10 weeks later it was processing 9.03 GB of real NASDAQ data from October 30, 2019 — a high-volatility day chosen specifically to stress the system.",
      learnings: [
        {
          title: "The compiler deleted my code",
          desc: "It proved the result was never observed under the standard's memory model, so it optimized it out of existence. No warning."
        },
        {
          title: "Store buffers vs Cache Coherence",
          desc: "A store instruction doesn't mean other cores can see the write. Store buffers sit between your core and the cache. MESI coherence doesn't save you."
        },
        {
          title: "The fiction of Move Semantics",
          desc: "Move semantics aren't about moving memory. They're about value categories and overload resolution. The 'move' is a fiction the type system agrees to."
        },
        {
          title: "Borrow Checking as an Alias Problem",
          desc: "Rust's borrow checker is the same problem I was solving manually — aliased mutable access causing the exact data races I was debugging with ASAN."
        }
      ],
      limitations: [
        "Single-threaded ingestion",
        "PnL ignores slippage and market impact",
        "OFI signal not validated against live fills"
      ],
      nextSteps: [
        "Multi-threaded parser with SPSC actually doing cross-thread work",
        "Walk-forward OFI signal validation",
        "MCPWatch-style observability layer"
      ],
      benchmarks: [
        { scenario: "Synthetic (L1)", throughput: "48.29M msg/s", latency: "20.7ns" },
        { scenario: "Realistic (L3)", throughput: "14.30M msg/s", latency: "69.9ns" },
        { scenario: "Full Simulation", throughput: "10.11M msg/s", latency: "98.8ns" }
      ],
      technicalSections: [
        {
          title: "OrderBook Internals",
          label: "Hot Path Optimization",
          desc: "To achieve O(1) access, the book uses a flat price-level array indexed by offset from a base price. Unlike std::map (O(log n)), this layout is sequential and cache-friendly, avoiding the pointer-chasing and instruction cache pollution inherent in red-black trees. BBO detection is handled by a 4-layer hierarchical bitset: a single 64-bit word covers 64 price levels, with higher layers providing an accelerated index. This ensures best bid/offer discovery in at most 4 TZCNT instructions regardless of book depth.",
          code: "// O(1) BBO — single TZCNT instruction\nint idx = memory_->bits[0].find_last();"
        },
        {
          title: "Memory Model & Cache Strategy",
          label: "System Architecture",
          desc: "The engine uses OS-backed page allocation with explicit cache-line alignment (alignas(64)) to prevent false sharing between hot threads. Every object pool uses tagged pointers to prevent the ABA problem during concurrent state updates. By bypassing the general-purpose heap, we eliminate the non-deterministic latency of malloc/free and ensure that all market data structures remain hot in L1/L2 cache during high-volatility bursts.",
          code: "struct alignas(64) PriceLevel {\n  std::atomic<uint64_t> volume;\n  Order* head;\n};"
        },
        {
          title: "Static Dispatch & Zero-Overhead",
          desc: "Dynamic polymorphism is strictly avoided on the hot path. The engine uses template-based static dispatch (HFTEngine<Strategy>) instead of virtual base classes. This eliminates vtable lookups and indirect calls, allowing the compiler to fully inline strategy logic into the message processing loop. This design respects the hardware by keeping the instruction pipeline deep and minimizing branch mispredictions during peak message rates.",
          code: "template <typename Strategy>\nvoid on_message(const Message& msg) {\n  Strategy::on_update(msg);\n}"
        }
      ],
      tools: [
        {
          name: "C++",
          icon: <TechIcon name="cplusplus" />,
          desc: "Modern C++ (C++20) / Low-level systems language",
          proof: "Leveraged C++20 concepts to constrain strategy templates, ensuring zero-overhead abstractions and static polymorphism across the engine's core pipeline."
        },
        {
          name: "MSVC",
          icon: <TechIcon name="visualstudio" />,
          desc: "Microsoft Visual C++ Compiler",
          proof: "Optimized the Windows build using MSVC-specific intrinsics like __lzcnt64 and __popcnt64. Managed cache-aligned memory using _aligned_malloc for deterministic heap behavior."
        },
        {
          name: "GCC",
          icon: <TechIcon name="gcc" />,
          desc: "GNU Compiler Collection",
          proof: "Used __builtin_expect (likely/unlikely) to hint the branch predictor on hot message paths. Verified assembly output with -march=native to ensure AVX2 vectorization was applied."
        },
        {
          name: "GDB",
          icon: <TechIcon name="gdb" />,
          desc: "Low-level debugger for C/C++",
          proof: "Caught a segfault in the object pool's placement new path — stack trace showed the destructor being called on uninitialized memory because the pool was returning a slot before construction completed."
        },
        {
          name: "ASAN",
          icon: <TechIcon name="llvm" />,
          desc: "Runtime memory error detector",
          proof: "Flagged a junk pointer in the hash index after an erase operation — the Robin Hood rehash was moving an entry but leaving the old slot's pointer live long enough to be dereferenced once."
        },
        {
          name: "Perf",
          icon: <Gauge size={20} />,
          desc: "Linux performance counter tool",
          proof: "Used perf to confirm L3 cache miss rate was the actual bottleneck on realistic benchmarks — not the algorithm, the memory access pattern."
        },
        {
          name: "Godbolt",
          icon: <TechIcon name="compilerexplorer" />,
          desc: "Compiler Explorer / Assembly verification",
          proof: "Verified best_bid() compiles down to a single TZCNT instruction. Confirmed FORCE_INLINE was actually being respected on the hot path."
        }
      ]
    },
    {
      id: "luckyos",
      category: "OS",
      highlight: "built from the first instruction the CPU executes",
      title: "LuckyOS",
      tags: "x86 Assembly · BIOS · Kernel basics",
      description: "A minimal operating system kernel written from scratch. Implements a basic bootloader and VGA text mode drivers.",
      stack: [
        { label: "x86", icon: <Terminal size={14} /> },
        { label: "Assembly", icon: <Code2 size={14} /> }
      ],
      tools: [
        {
          name: "x86 Assembly",
          icon: <Binary size={20} />,
          desc: "Low-level machine code",
          proof: "Wrote a custom bootloader that fits in 512 bytes, handling the transition from real mode to protected mode manually."
        },
        {
          name: "QEMU",
          icon: <Terminal size={20} />,
          desc: "System emulator",
          proof: "Used QEMU for rapid iteration of kernel code, debugging interrupt service routines without hardware-level risk."
        }
      ]
    },
    {
      id: "royal-liquor",
      category: "WEB",
      highlight: "built the framework, then the app",
      title: "Royal Liquor Store",
      tags: "PHP 8.2 · Vanilla JS · PostgreSQL · Custom MVC",
      description: "A high-performance e-commerce engine built from scratch without frameworks. Features a custom Reflection-based DI container, a regex router, and a multi-warehouse stock system with row-level locking.",
      stack: [
        { name: "PHP", icon: <TechIcon name="php" /> },
        { name: "JavaScript", icon: <TechIcon name="javascript" /> },
        { name: "HTML5", icon: <TechIcon name="html5" /> },
        { name: "CSS3", icon: <TechIcon name="css3" /> },
        { name: "TailwindCSS", icon: <TechIcon name="tailwindcss" /> },
        { name: "PostgreSQL", icon: <TechIcon name="postgresql" /> },
        { name: "Docker", icon: <TechIcon name="docker" /> }
      ],
      metrics: [
        { label: "Architecture", value: "Hand-rolled MVC", sub: "Built from scratch without Laravel/React" },
        { label: "Complexity", value: "22 Controllers", sub: "Supports full storefront + Admin SPA" },
        { label: "Database", value: "36 PG Views", sub: "Optimized for high-performance retrieval" }
      ],
      pipeline: [
        { name: "Request", group: "Entry", desc: "Apache .htaccess rewrite" },
        { name: "Router", group: "Core", desc: "Regex-based URI matching" },
        { name: "DI Container", group: "Core", desc: "Reflection-based auto-wiring" },
        { name: "Service", group: "Logic", desc: "Business rules & validation" },
        { name: "Repository", group: "Data", desc: "PostgreSQL views & raw SQL" }
      ],
      timeline: [
        { date: "Aug 01", event: "Core Engine: Autoloader & Router" },
        { date: "Aug 15", event: "DI Container: Reflection-based wiring" },
        { date: "Sep 02", event: "Multi-Warehouse Stock Logic (FIFO)" },
        { date: "Sep 20", event: "Admin SPA Dashboard" }
      ],
      whyParagraph: "Frameworks like Laravel are great, but they hide the complexity of the underlying systems. I wanted to understand how a DI container actually resolves dependencies using Reflection, how a regex-based router parses URIs, and how to manage concurrency in a complex stock system without the safety net of an ORM.",
      buildStory: "What started as a simple PHP script grew into a full MVC system with 22 controllers and 18 models. The biggest challenge was the DI container—making it recursively resolve dependencies through the constructor while detecting circular loops. It proved that you don't need a heavy framework to build a secure, scalable web app.",
      learnings: [
        {
          title: "Floats are not numbers for money",
          desc: "0.1 + 0.2 = 0.30000000000000004. This realization changed everything. I moved all financial logic to price_cents INTEGER and never touched a float in a calculation again. Floating point errors in e-commerce are silent until they're expensive."
        },
        {
          title: "PostgreSQL Views as an API Boundary",
          desc: "Creating 36 views meant my application code never touched raw joins. The view is the contract. If the schema changes, I fix the view and the PHP application remains untouched. It's a clean separation of concerns at the persistence layer."
        },
        {
          title: "The Fiction of 'Simple' Auth",
          desc: "Hand-rolling auth taught me that session fixation and timing attacks are subtle side channels. I used hash_equals for CSRF because === leaks information character by character. If you don't regenerate IDs on login, you're leaving a door open for session fixation."
        },
        {
          title: "Partial Indexes vs Table Bloat",
          desc: "Indexing only WHERE is_active = TRUE and deleted_at IS NULL keeps indexes small and hot in cache. A full index on a soft-deleted table is mostly wasted space that slows down every write."
        },
        {
          title: "SPA without React is the best teacher",
          desc: "Building a SPA from scratch made me realize that virtual DOM and reconciliation aren't magic—they're solutions to the very real problems of state fragmentation and DOM memory leaks that I hit manually."
        }
      ],
      limitations: [
        "Manual asset pipeline",
        "Single-threaded PHP execution",
        "No built-in migration system (raw SQL)"
      ],
      nextSteps: [
        "Migrate to a compiled template engine",
        "Implement AI-driven product recognition",
        "Add a proper DB migration runner"
      ],
      technicalSections: [
        {
          title: "Reflection-based DI Container",
          desc: "The container uses PHP's Reflection API to inspect class constructors at runtime. It recursively resolves dependencies by checking type hints, instantiating required services, and injecting them. It includes circular dependency detection to prevent infinite loops during resolution, ensuring a safe and automated object graph construction.",
          code: "$reflection = new ReflectionClass($class);\n$constructor = $reflection->getConstructor();\n// Circular dependency check\nif (isset($this->resolving[$id])) throw new CircularException();\n$this->resolving[$id] = true;\n$dependencies = array_map(fn($p) => $this->get($p->getType()->getName()), $params);"
        },
        {
          title: "Middleware Pipeline (Chain of Responsibility)",
          desc: "Implemented a flexible middleware stack that processes requests through a chain of objects. Each middleware (Auth, CSRF, RateLimit, JSON) can either handle the request or pass it to the 'next' closure. This keeps the core controllers clean and focused only on business logic while handling cross-cutting concerns at the perimeter.",
          code: "public function process(Request $request, callable $finalHandler) {\n  $next = $this->createNext($this->middleware, $finalHandler);\n  return $next($request);\n}"
        },
        {
          title: "Multi-Warehouse FIFO Stock Logic",
          desc: "To prevent overselling, the engine uses PostgreSQL row-level locking (FOR UPDATE) during order reservation. It finds the warehouse with the most available stock, locks the row to prevent other concurrent requests from reading stale data, and reserves the quantity in a single atomic transaction. Available stock is calculated dynamically: quantity - reserved.",
          code: "SELECT id FROM stock \nWHERE product_id = :id AND (quantity - reserved) >= :qty \nFOR UPDATE LIMIT 1;"
        },
        {
          title: "API Gateway & URI Normalization",
          desc: "Since the API gateway is nested 3 directories deep, the request URI often requires normalization to match route definitions. I used Reflection to modify the private 'uri' property of the Request object at runtime, ensuring the Regex-based router receives a clean, consistent path regardless of the physical file location.",
          code: "$ref = new ReflectionClass($request);\n$prop = $ref->getProperty('uri');\n$prop->setAccessible(true);\n$prop->setValue($request, $normalizedUri);"
        },
        {
          title: "PostgreSQL JSON Aggregation",
          desc: "The Admin SPA requires rich, denormalized data for its detail views. Instead of multiple queries or complex ORM joins, I used PostgreSQL views that aggregate related entities (like stock by warehouse or product ratings) directly into JSONB arrays. This allows the backend to return a complete, deep data structure in a single, high-performance query.",
          code: "CREATE VIEW admin_detail_products AS\nSELECT p.*, \n  (SELECT JSON_AGG(row_to_json(t)) FROM (\n    SELECT w.name, s.quantity FROM stock s ...\n  ) t) as stock_by_warehouse;"
        }
      ],
      tools: [
        {
          name: "PHP 8.2",
          icon: <TechIcon name="php" />,
          desc: "Strictly typed backend logic",
          proof: "Leveraged constructor promotion, union types, and strict_types=1 to build a robust model layer. Implemented a custom PSR-4 autoloader to handle namespaced class resolution without external dependencies."
        },
        {
          name: "PostgreSQL",
          icon: <TechIcon name="postgresql" />,
          desc: "Advanced relational data store",
          proof: "Designed a schema with 17 tables, custom ENUM types for status fields, and partial indexes for high-frequency queries. Optimized the Admin SPA performance using 36 specialized views."
        },
        {
          name: "Vanilla JS",
          icon: <TechIcon name="javascript" />,
          desc: "Framework-less Frontend SPA",
          proof: "Built a custom hash-based router with dynamic module imports for the Admin dashboard. Managed state using localStorage and implemented a manual DOM cleanup cycle to prevent memory leaks."
        },
        {
          name: "Docker",
          icon: <TechIcon name="docker" />,
          desc: "Environment containerization",
          proof: "Orchestrated a multi-container setup with PHP-Apache and PostgreSQL, ensuring identical development and production environments. Managed database seeding and schema loads via Docker entrypoints."
        }
      ]
    },
    {
      id: "reservation",
      category: "WEB",
      highlight: "drag a stall, watch the price recalculate in real time",
      title: "Colombo Book Fair — Stall Reservation",
      tags: "Spring Boot · React · WebSocket · Stripe · AWS",
      description: "Real-time stall reservation platform built for the Colombo International Book Fair. Drag stalls on a live floor map — price updates instantly based on foot traffic proximity and stall geometry. Sub-100ms sync across all connected clients via STOMP WebSocket.",
      stack: [
        { name: "Java", icon: <TechIcon name="java" /> },
        { name: "React", icon: <TechIcon name="react" /> },
        { name: "PostgreSQL", icon: <TechIcon name="postgresql" /> },
        { name: "Docker", icon: <TechIcon name="docker" /> },
        { name: "AWS", icon: <TechIcon name="amazonwebservices" /> }
      ],
      metrics: [
        { label: "What it does", value: "Live Booking", sub: "Vendors browse a live floor map and book stalls" },
        { label: "How it prices", value: "Dynamic", sub: "Price updates as you drag based on map location" },
        { label: "How it was built", value: "Lead Architect", sub: "Coordinated a 5-person team from scaffold to deployment" }
      ],
      timeline: [
        { date: "Feb 09", event: "Backend + frontend scaffold, full team setup" },
        { date: "Feb 13", event: "JWT security, entity design, CORS" },
        { date: "Feb 17", event: "9 critical API security fixes in one session" },
        { date: "Feb 28", event: "Caught hardcoded secrets in tracked files, extracted to .env" },
        { date: "Mar 01", event: "TLS via Nginx, CI/CD pipeline on AWS" },
        { date: "Mar 05", event: "RAG-powered help bot, debounced live pricing" }
      ],
      whyParagraph: "The interesting problem wasn't the booking flow — it was the pricing engine. Every stall has a position on a floor plan. The price should reflect how visible that stall is: proximity to entrances, foot traffic zones, edge penalties for isolated corners. So we built a spatial heuristic that treats the floor as a field, calculates a visibility score per stall using distance falloff from influence zones, and recalculates in real time as you drag.",
      buildStory: "What started as a university assignment evolved into a production-grade platform used at the Colombo International Book Fair. As the lead, I architected the backend and security layers while coordinating with a group of talented engineers to bring the live floor map to life. We moved from a classroom scaffold to a hardened AWS deployment, ensuring sub-100ms sync across real vendor devices during the actual event. The success of the system was a testament to the team's collective effort in shipping reliable software under real-world pressure.",
      learnings: [
        {
          title: "Row-level locking isn't optional under concurrency",
          desc: "Two users booking the last available stall simultaneously both succeed without FOR UPDATE. The lock forces the second request to wait until the first transaction commits. One line of SQL prevents an entire class of double-booking bugs."
        },
        {
          title: "WebSocket state is not REST state",
          desc: "REST assumes stateless request-response. WebSocket assumes persistent shared state across clients. Mixing the two without a clear broadcast model means some clients see stale data silently. STOMP topics gave us an explicit pub-sub contract."
        },
        {
          title: "Secrets in git history are permanent",
          desc: "Committed a JWT secret and Stripe key early on. Even after removing them, they exist in git history forever. Learned to use .env with .env.example placeholders from day one, and to treat any secret that touched a commit as fully compromised."
        },
        {
          title: "N+1 is invisible until it's catastrophic",
          desc: "Loading reservations for the admin dashboard triggered a separate query per stall per reservation. Fine with 10 rows. The query count scales linearly with data. JOIN FETCH collapsed dozens of round trips into one query."
        }
      ],
      limitations: [
        "In-memory STOMP broker — doesn't survive server restart",
        "Single EC2 instance — no horizontal scaling",
        "Pricing engine not validated against real foot traffic data"
      ],
      nextSteps: [
        "Replace in-memory broker with Redis pub/sub",
        "Validate pricing heuristic against actual visitor flow data",
        "Multi-venue support"
      ],
      technicalSections: [
        {
          title: "Spatial Pricing Engine",
          label: "Real-time Calculation",
          desc: "The core problem: how do you price a physical location on a floor plan without manually setting every stall's price? The answer is treating the floor as a spatial field. Every stall has a centroid in normalized coordinate space (0–100). Influence zones — entrances, food courts, main stages — each have a position, radius, and intensity. For every stall, the engine calculates a visibility contribution using inverse distance falloff (linear or exponential). An edge proximity penalty subtracts from any stall within 2% of the floor boundary. The tricky part was debouncing: we used client-side calculation for live preview and a 300ms debounced backend sync for persistence.",
          code: "// Spatial contribution per influence zone\ndouble d = distance(stall.centroid, zone.position);\nif (d < zone.radius)\n  score += zone.intensity * (1 - d / zone.radius); // linear falloff"
        },
        {
          title: "Atomic Stall Locking",
          label: "Concurrency Control",
          desc: "The race condition is obvious: two vendors view the same available stall, both click reserve, both get a confirmation. Naive application-level locking fails because two requests can both read 'reserved = false' before either writes 'true'. SELECT FOR UPDATE acquires a row-level lock at read time, forcing the second request to block entirely until the first transaction commits or rolls back. The critical detail is transaction scope: @Transactional must wrap the entire lock → validate → update sequence to ensure the lock isn't released prematurely.",
          code: "SELECT * FROM event_stalls \nWHERE id = :id \nFOR UPDATE;"
        },
        {
          title: "Real-time WebSocket Sync",
          label: "State Synchronization",
          desc: "STOMP over SockJS provides a pub-sub model for instant state updates. Every stall mutation triggers a broadcast to /topic/stalls. To handle corporate proxies that block WebSockets, SockJS transparently falls back to long-polling. We treated WebSocket as a 'delta stream' rather than the source of truth: if a client reconnects after a drop, they fetch the full state via REST and then rejoin the delta stream. This architecture ensures the map stays in sync sub-100ms without the overhead of polling.",
          code: "simpMessagingTemplate\n  .convertAndSend(\"/topic/stalls\", stallUpdateMessage);"
        }
      ],
      tools: [
        {
          name: "Spring Boot",
          icon: <TechIcon name="spring" />,
          desc: "Java backend framework",
          proof: "Configured a tiered security filter chain — Bucket4j rate limiting → JWT validation → method-level @PreAuthorize. Managed @Transactional boundaries strictly at the service layer to ensure ACID compliance across multi-step reservation flows."
        },
        {
          name: "PostgreSQL",
          icon: <TechIcon name="postgresql" />,
          desc: "Relational database",
          proof: "Used SELECT FOR UPDATE for atomic stall locking during concurrent bookings. Designed JOIN FETCH queries to eliminate N+1 on reservation loading. Soft deletes with deletedAt for full audit trail."
        },
        {
          name: "React + TanStack Query",
          icon: <TechIcon name="react" />,
          desc: "Frontend + server state",
          proof: "Invalidated query caches on successful mutations to keep admin dashboards in sync without manual refetch logic. Debounced the pricing engine calls on drag events to avoid flooding the backend."
        },
        {
          name: "AWS EC2 + Nginx",
          icon: <TechIcon name="amazonwebservices" />,
          desc: "Production deployment",
          proof: "Deployed on t3.micro with Nginx as SSL termination layer and reverse proxy. Set up GitHub Actions CI/CD pipeline — push to main triggers build, test, and deploy automatically."
        },
        {
          name: "GitHub Actions",
          icon: <TechIcon name="githubactions" />,
          desc: "CI/CD pipeline",
          proof: "Caught a broken ESLint dependency version during CI that was silently passing locally. Fixed by pinning eslint to v9. Pipeline now fails fast on dependency conflicts before they hit production."
        },
        {
          name: "TypeScript",
          icon: <TechIcon name="typescript" />,
          desc: "Type-safe frontend",
          proof: "Implemented strict interface definitions for the floor map state, preventing runtime crashes during complex drag-and-drop price recalculations."
        }
      ]
    },
    {
      id: "rag-pipeline",
      category: "ML",
      highlight: "self-hosted semantic search with HNSW indexing",
      title: "Modular RAG Pipeline",
      tags: "Python · pgvector · FastAPI · Groq · Docker",
      description: "A minimal, self-hosted RAG pipeline. No managed vector databases, no LangChain orchestration. Uses pgvector with an HNSW index for high-performance approximate nearest-neighbor search. Built to understand the mechanics of retrieval-augmented generation.",
      stack: [
        { name: "Python", icon: <TechIcon name="python" /> },
        { name: "PostgreSQL", icon: <TechIcon name="postgresql" /> },
        { name: "FastAPI", icon: <TechIcon name="fastapi" /> },
        { name: "Docker", icon: <TechIcon name="docker" /> }
      ],
      metrics: [
        { label: "Search Index", value: "HNSW", sub: "Vector cosine ops (384d)" },
        { label: "Providers", value: "Abstract", sub: "Swappable LLM interface" },
        { label: "Chunking", value: "Semantic", sub: "Header-aware markdown splitting" }
      ],
      whyParagraph: "The goal wasn't to build another wrapper around OpenAI and Pinecone. Managed RAG services hide the most interesting parts: the geometry of the vector space, the retrieval performance tradeoffs, and the chunking strategy. I wanted to see if I could build a professional-grade pipeline using just a relational database (PostgreSQL + pgvector) and local embedding models. It turns out, when you own the index, search becomes a systems problem, not just an API call.",
      buildStory: "Started by understanding the distance metrics in pgvector—cosine similarity vs Euclidean distance. Decided on a 384-dimension model (all-MiniLM-L6-v2) for its high throughput-to-accuracy ratio. The biggest challenge was chunking; naive fixed-size splitting breaks semantic context. Implementing MarkdownHeaderTextSplitter ensured that the LLM always receives complete, logical sections of text.",
      learnings: [
        {
          title: "Meaning as Geometry",
          desc: "Built this to understand one thing: how does a question about 'resetting passwords' find the right paragraph without any keyword matching? The answer is embedding space—meaning encoded as geometry. Conceptual similarity becomes geometric proximity. Once you realize that retrieval is just 'find the nearest points in high-dimensional space,' every managed service like Pinecone or LangChain becomes a transparent wrapper around that single idea."
        },
        {
          title: "Chunking is the hidden bottleneck",
          desc: "Fixed-size chunking is easy, but it cut my documentation right in the middle of a code block. Header-aware chunking means the LLM gets the entire 'Quick Start' or 'Configuration' section. Retrieval quality depends more on how you cut the text than the LLM you use."
        },
        {
          title: "HNSW Indexing is a game changer",
          desc: "Brute force cosine similarity scales linearly with your data. HNSW (Hierarchical Navigable Small World) builds a graph structure for approximate nearest neighbor search. It turns a search into a graph traversal problem, keeping query times sub-50ms even as the document count grows."
        }
      ],
      limitations: [
        "No re-ranking step after initial retrieval",
        "Single-user auth (recommends FastAPI docs for implementation)",
        "In-memory embedding model on CPU (no GPU acceleration)"
      ],
      nextSteps: [
        "Add a Cross-Encoder re-ranker for Top-10 refinement",
        "Support for PDF and Docx ingestion",
        "GPU-accelerated inference for local embeddings"
      ],
      technicalSections: [
        {
          title: "Vector Search Implementation",
          label: "System Architecture",
          desc: "Unlike managed services, this pipeline runs its own vector store. We use PostgreSQL with the pgvector extension. To ensure performance at scale, we create an HNSW index using vector_cosine_ops. This allows the database to skip 99% of distance calculations by traversing a pre-built graph of document relationships.",
          code: "CREATE INDEX ON documents \nUSING hnsw (embedding vector_cosine_ops) \nWITH (m = 16, ef_construction = 64);"
        },
        {
          title: "Provider Pattern for LLMs",
          label: "Design Pattern",
          desc: "The pipeline is decoupled from specific vendors. Using an abstract LLMProvider interface, you can swap between Groq (for speed), OpenAI (for quality), or Ollama (for local privacy) without changing a single line of query logic. The RAGQuery service only cares that the provider has a .generate() method.",
          code: "class LLMProvider(ABC):\n    @abstractmethod\n    def generate(self, context: str, question: str) -> str:\n        pass"
        }
      ],
      tools: [
        {
          name: "pgvector",
          icon: <TechIcon name="postgresql" />,
          desc: "Vector search in Postgres",
          proof: "Implemented HNSW graph indexing on 384d vectors. Used the <=> cosine similarity operator to calculate semantic distance directly within SQL queries, avoiding data transfer to the application layer for ranking."
        },
        {
          name: "FastAPI",
          icon: <TechIcon name="fastapi" />,
          desc: "High-performance API",
          proof: "Built an asynchronous endpoint for /query that handles embedding generation and LLM inference in parallel using Python's asyncio."
        },
        {
          name: "TypeScript",
          icon: <TechIcon name="typescript" />,
          desc: "Type-safe UI",
          proof: "Ensured the RAG dashboard handles streamed LLM tokens safely using strict type definitions for the chunk-based response structure."
        }
      ]
    },
    {
      id: "storeit",
      category: "WEB",
      highlight: "server-side file orchestration & storage",
      title: "StoreIt — Cloud Storage",
      tags: "Next.js 15 · Appwrite · TypeScript · Tailwind · Shadcn",
      description: "A full-stack cloud storage platform built with Next.js 15. Features secure OTP authentication, drag-and-drop file uploads, and automatic file categorization. Built to explore the limits of Next.js Server Actions and integrated Backend-as-a-Service (Appwrite) architecture.",
      stack: [
        { name: "Next.js", icon: <TechIcon name="nextdotjs" /> },
        { name: "TypeScript", icon: <TechIcon name="typescript" /> },
        { name: "Appwrite", icon: <TechIcon name="appwrite" /> },
        { name: "Tailwind", icon: <TechIcon name="tailwindcss" /> }
      ],
      metrics: [
        { label: "Architecture", value: "Server Actions", sub: "End-to-end type safety with Next.js 15" },
        { label: "Auth", value: "OTP / Session", sub: "Secure multi-factor authentication flow" },
        { label: "Performance", value: "Edge Ready", sub: "Optimized for Vercel & Appwrite Cloud" }
      ],
      whyParagraph: "I wanted to build something that required more than just 'fetching data'. A cloud storage platform forces you to think about binary data streams, mime-type validation, and complex state management across the server and client. Using Appwrite as the backbone allowed me to focus on the orchestration layer—how a file goes from a user's desktop to a secure bucket while maintaining searchable metadata in a relational database.",
      buildStory: "Started with the Next.js 15 App Router to leverage the latest React 19 features. The biggest challenge was the 'Browser API' dependency in some server components—I had to refactor the Auth flow to ensure it works correctly in server-side contexts. Implemented a custom file categorization engine that sorts uploads into logical buckets based on extension and metadata.",
      learnings: [
        {
          title: "The Server/Client Boundary",
          desc: "Next.js 15 makes it easy to leak browser APIs into the server. I learned the hard way that 'use server' doesn't mean 'works everywhere'. Refactoring the Auth layer to be environment-agnostic was a deep lesson in how modern frameworks bridge the network gap."
        },
        {
          title: "BaaS is about Orchestration",
          desc: "Appwrite isn't just a database; it's a set of primitives. The real work is in the glue logic: ensuring that a successful storage upload always has a corresponding database entry, and handling the cleanup if one fails. It's about transactionality in a distributed system."
        },
        {
          title: "MIME-types are more than strings",
          desc: "Validating file types at the edge is critical. I built a mapping system that translates raw file extensions into the app's internal categories (Documents, Media, etc.) while ensuring the actual binary content matches the claimed type."
        }
      ],
      limitations: [
        "No client-side encryption (files are encrypted at rest by Appwrite)",
        "Large file uploads (>50MB) may time out on serverless functions",
        "Sharing limited to email-based user lookup"
      ],
      nextSteps: [
        "Implement client-side encryption (AES-256) before upload",
        "Add support for chunked large-file uploads",
        "Real-time collaborative folder editing"
      ],
      technicalSections: [
        {
          title: "File Ingestion & Metadata Mapping",
          label: "System Architecture",
          desc: "When a file is uploaded, the system performs a multi-step orchestration: first, the binary is streamed to Appwrite Storage. Upon success, a Server Action triggers to create a document in the database with the file's URL, size, and account owner. We use a custom categorization engine to map the file's extension to one of four internal types—ensuring the dashboard remains organized automatically.",
          code: "const fileType = getFileType(file.name);\nconst bucketFile = await storage.createFile(BUCKET_ID, ID.unique(), file);\nawait database.createDocument(DB_ID, COL_ID, ID.unique(), {\n  name: file.name, type: fileType.type, url: getFileUrl(bucketFile.$id)\n});"
        },
        {
          title: "Secure OTP Authentication",
          label: "Security Implementation",
          desc: "Moving beyond simple passwords, I implemented a one-time password (OTP) flow using Appwrite Auth. This ensures that users can't login without access to their registered email. The flow handles state across a modal-based UI, triggering the email delivery on the server and validating the 6-digit code with immediate session regeneration.",
          code: "const session = await account.createEmailToken(ID.unique(), email);\nsetAccountId(session.userId);\n// On code entry\nawait account.createSession(accountId, otpCode);"
        }
      ],
      tools: [
        {
          name: "Next.js 15",
          icon: <TechIcon name="nextdotjs" />,
          desc: "React Framework",
          proof: "Leveraged Server Actions for all data mutations, eliminating the need for a separate API layer. Used the new Metadata API for dynamic SEO tags on share links."
        },
        {
          name: "Appwrite",
          icon: <TechIcon name="appwrite" />,
          desc: "Backend-as-a-Service",
          proof: "Configured granular Bucket permissions to ensure users can only read their own files. Used Appwrite Functions to handle automatic thumbnail generation for uploaded images."
        },
        {
          name: "TypeScript",
          icon: <TechIcon name="typescript" />,
          desc: "Strict type safety",
          proof: "Leveraged TypeScript to define the recursive folder structure and complex file metadata schemas, ensuring total type safety across Server Actions."
        }
      ]
    },
    {
      id: "mcpwatch",
      category: "SYSTEMS",
      highlight: "JSON-RPC interception layer for MCP",
      title: "MCPWatch",
      tags: "Go · SQLite · JSON-RPC · Systems Proxy",
      description: "Disclaimer: ACTIVE RESEARCH / IN PROGRESS. A universal observation proxy for autonomous agents. While the current focus is MCP, the architecture is designed to 'watch the world'—standardizing behavior tracking across pipes, network streams, and internal agent state.",
      stack: [
        { name: "Go", icon: <TechIcon name="go" /> },
        { name: "SQLite", icon: <TechIcon name="sqlite" /> },
        { name: "JSON-RPC", icon: <Terminal size={14} /> }
      ],
      metrics: [
        { label: "Interception", value: "Stdio Pipe", sub: "Zero-latency TeeReader proxying" },
        { label: "Storage", value: "SQLite WAL", sub: "High-concurrency write-ahead logging" },
        { label: "Protocol", value: "JSON-RPC", sub: "Deep inspection of MCP method calls" }
      ],
      whyParagraph: "The Model Context Protocol (MCP) is the first milestone, but the goal is a 'watch the world' monitor for agent behavior. I built MCPWatch to solve a fundamental problem: as LLM agents become more autonomous, their actions (pipes, HTTPS calls, tool usage) must become observable. This isn't just a debugger; it's a universal audit layer. Whether it's a node script talking over stdio or a remote agent calling an HTTPS tool, it should be observable, searchable, and auditable in real-time.",
      buildStory: "Originally started in another language but transitioned to Go for its superior concurrency primitives and low-level control over process execution. The core challenge was proxying stdio without blocking: I used io.TeeReader to split the streams and bufio.Scanner to extract JSON lines asynchronously. Implemented SQLite's WAL (Write-Ahead Logging) mode to ensure the UI can read from the database even during heavy logging bursts.",
      learnings: [
        {
          title: "The power of TeeReader",
          desc: "Proxying isn't just about passing data; it's about observing it without affecting the original flow. io.TeeReader is the perfect primitive for this—it allowed me to 'tap' the pipe for logging while the original command continues to receive data as if I wasn't there."
        },
        {
          title: "WAL Mode is non-negotiable for logging",
          desc: "Standard SQLite locking will block your UI if the logger is busy. Enabling PRAGMA journal_mode=WAL; was a game changer—it allows readers and writers to operate simultaneously, which is critical when you have a live dashboard polling a database that's being flooded with RPC logs."
        },
        {
          title: "Signals and Process Life-cycles",
          desc: "Wrapping a process means you own its life-cycle. I had to learn how to properly propagate signals and wait for the child process to exit before closing the database and log channels. If you don't wait correctly, you lose the last (and often most important) messages."
        }
      ],
      limitations: [
        "Stdio only (no support for WebSocket-based MCP yet)",
        "Limited to line-delimited JSON-RPC",
        "Single-process wrapping only"
      ],
      nextSteps: [
        "Support for WebSocket and HTTP/SSE MCP servers",
        "Real-time chart visualizations for latency tracking",
        "Payload modification for testing error scenarios"
      ],
      technicalSections: [
        {
          title: "Stdio Interception Logic",
          label: "System Proxying",
          desc: "To intercept traffic without blocking the child process, MCPWatch uses io.TeeReader to clone the stdin/stdout streams. The data is passed through to the original destination in real-time, while a background scanner parses the JSON-RPC messages and queues them for logging. This ensures the proxy is completely transparent to both the client and the server.",
          code: "// Capture Server -> Client (stdout)\nreader := io.TeeReader(stdout, os.Stdout)\nscanner := bufio.NewScanner(reader)\nfor scanner.Scan() {\n    line := scanner.Text()\n    queueLog(\"OUT\", line)\n}"
        },
        {
          title: "Asynchronous Log Pipeline",
          label: "Concurrency Pattern",
          desc: "Logging to disk is slow; proxying must be fast. Interactions are sent to a buffered channel (logChan) and processed by a dedicated background goroutine. This decouples the hot path of the stdio proxy from the I/O latency of SQLite, allowing the system to handle high-frequency RPC bursts without back-pressure.",
          code: "func backgroundLogger() {\n    for i := range logChan {\n        db.Exec(`INSERT INTO interactions ...`, ...)\n    }\n}"
        }
      ],
      tools: [
        {
          name: "Go",
          icon: <TechIcon name="go" />,
          desc: "Systems programming language",
          proof: "Used goroutines and channels to implement a non-blocking log pipeline. Managed child process execution and stdio piping using the os/exec package."
        },
        {
          name: "SQLite",
          icon: <TechIcon name="sqlite" />,
          desc: "Embedded database",
          proof: "Configured Write-Ahead Logging (WAL) for concurrent read/write access. Designed a schema optimized for fast retrieval of the latest interaction logs."
        }
      ]
    }
  ],
  writing: [
    {
      id: 1,
      title: "The CPU You Think You Know Doesn’t Exist",
      date: "Oct 2024",
      url: "https://medium.com/@niroshasulochini/the-cpu-you-think-you-know-doesnt-exist-a1b2c3d4e5f6",
      description: "Why modern CPUs aren't the sequential instruction executors we think they are. A deep dive into out-of-order execution and branch prediction."
    },
    {
      id: 2,
      title: "Deadlines?",
      date: "Sep 2024",
      url: "https://medium.com/@niroshasulochini/deadlines-a1b2c3d4e5f6",
      description: "Banned C++ features in real-time systems and the extreme engineering constraints of medical and aerospace software."
    },
    {
      id: 3,
      title: "My Journey into the Machine: Building an OS from Scratch",
      date: "Aug 2024",
      url: "https://medium.com/@niroshasulochini/my-journey-into-the-machine-a1b2c3d4e5f6",
      description: "The technical and mental challenge of writing a kernel. From the first BIOS interrupt to a working VGA driver."
    },
    {
      id: 4,
      title: "How Mathematics is Predicting Wildfire Paths",
      date: "Jul 2024",
      url: "https://medium.com/@niroshasulochini/wildfire-prediction-a1b2c3d4e5f6",
      description: "Analyzing the mathematical models from ICAPS 2025. How differential equations and spatial data simulate fire front propagation."
    }
  ],
  fullStack: [
    {
      category: "LANGUAGES",
      items: [
        { name: "C++", icon: <TechIcon name="cplusplus" />, projects: [{ id: "backtesting", title: "Backtesting Engine", context: "orderbook, OFI pipeline, object pool" }] },
        { name: "Go", icon: <TechIcon name="go" />, projects: [{ id: "mcpwatch", title: "MCPWatch", context: "JSON-RPC interception layer" }] },
        { name: "Python", icon: <TechIcon name="python" />, projects: [{ id: "rag-pipeline", title: "RAG Pipeline", context: "semantic search & ingestion" }] },
        { name: "Java", icon: <TechIcon name="java" />, projects: [{ id: "reservation", title: "Book Fair Reservation", context: "Spring Boot & WebSocket sync" }] },
        { name: "TypeScript", icon: <TechIcon name="typescript" />, projects: [{ id: "storeit", title: "StoreIt", context: "Next.js 15 Server Actions" }] },
        { name: "PHP", icon: <TechIcon name="php" />, projects: [{ id: "royal-liquor", title: "Royal Liquor Store", context: "Custom MVC framework" }] },
        { name: "JavaScript", icon: <TechIcon name="javascript" />, projects: [{ id: "royal-liquor", title: "Royal Liquor Store", context: "Vanilla JS SPA dashboard" }] },
        { name: "x86 Assembly", icon: <Binary size={24} />, projects: [{ id: "luckyos", title: "LuckyOS", context: "Bootloader & VGA drivers" }] }
      ]
    },
    {
      category: "SYSTEMS",
      items: [
        { name: "Concurrency Control", icon: <Activity size={24} />, projects: [{ id: "reservation", title: "Book Fair Reservation", context: "Atomic row-level locking" }, { id: "backtesting", title: "Backtesting Engine", context: "Lock-free ring buffers" }] },
        { name: "Real-time Sync", icon: <Activity size={24} />, projects: [{ id: "reservation", title: "Book Fair Reservation", context: "STOMP WebSocket broadcasts" }] },
        { name: "Interception Proxy", icon: <Terminal size={24} />, projects: [{ id: "mcpwatch", title: "MCPWatch", context: "stdio TeeReader proxying" }] },
        { name: "Vector Search", icon: <Binary size={24} />, projects: [{ id: "rag-pipeline", title: "RAG Pipeline", context: "HNSW graph indexing" }] },
        { name: "Memory allocators", icon: <Binary size={24} />, projects: [{ id: "backtesting", title: "Backtesting Engine", context: "OS-backed page pools" }] },
        { name: "Cache alignment", icon: <Gauge size={24} />, projects: [{ id: "backtesting", title: "Backtesting Engine", context: "alignas(64) hot paths" }] }
      ]
    },
    {
      category: "DATABASES",
      items: [
        { name: "PostgreSQL", icon: <TechIcon name="postgresql" />, projects: [{ id: "royal-liquor", title: "Royal Liquor Store", context: "Complex views & triggers" }, { id: "reservation", title: "Book Fair Reservation", context: "FOR UPDATE locking" }, { id: "rag-pipeline", title: "RAG Pipeline", context: "pgvector semantic search" }] },
        { name: "SQLite", icon: <TechIcon name="sqlite" />, projects: [{ id: "mcpwatch", title: "MCPWatch", context: "WAL-mode RPC logging" }] },
        { name: "Appwrite", icon: <TechIcon name="appwrite" />, projects: [{ id: "storeit", title: "StoreIt", context: "BaaS file orchestration" }] }
      ]
    },
    {
      category: "INFRASTRUCTURE",
      items: [
        { name: "Docker", icon: <TechIcon name="docker" />, projects: [{ id: "mcpwatch", title: "MCPWatch", context: "Containerized deployment" }, { id: "rag-pipeline", title: "RAG Pipeline", context: "Multi-service composition" }, { id: "royal-liquor", title: "Royal Liquor Store", context: "Dev-prod parity" }] },
        { name: "AWS", icon: <TechIcon name="amazonwebservices" />, projects: [{ id: "reservation", title: "Book Fair Reservation", context: "EC2 & Nginx deployment" }] },
        { name: "Linux", icon: <TechIcon name="linux" />, projects: [{ id: "backtesting", title: "Backtesting Engine", context: "perf profiling & tuning" }] },
        { name: "GitHub Actions", icon: <TechIcon name="githubactions" />, projects: [{ id: "reservation", title: "Book Fair Reservation", context: "Automated CI/CD pipeline" }] }
      ]
    },
    {
      category: "TOOLS & FRAMEWORKS",
      items: [
        { name: "Next.js 15", icon: <TechIcon name="nextdotjs" />, projects: [{ id: "storeit", title: "StoreIt", context: "Server Actions & Auth" }] },
        { name: "Spring Boot", icon: <TechIcon name="spring" />, projects: [{ id: "reservation", title: "Book Fair Reservation", context: "Security filter chains" }] },
        { name: "FastAPI", icon: <TechIcon name="fastapi" />, projects: [{ id: "rag-pipeline", title: "RAG Pipeline", context: "Async API orchestration" }] },
        { name: "Perf", icon: <Gauge size={24} />, projects: [{ id: "backtesting", title: "Backtesting Engine", context: "L3 cache bottleneck verification" }] },
        { name: "GDB", icon: <TechIcon name="gdb" />, projects: [{ id: "backtesting", title: "Backtesting Engine", context: "low-level debugging" }] }
      ]
    }
  ]
};
