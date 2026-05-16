import React from 'react';
import { Github, Linkedin, Twitter, Activity, Gauge, Binary, Terminal, Code2 } from 'lucide-react';
import { TechIcon } from './components/TechIcon';

export const data = {
  identity: {
    name: "Sachin",
    oneLine: "I like building things and understanding how they actually work.",
    philosophy: "Mostly backend and systems stuff — I get excited about the layers most people never see. I care a lot about writing software that's fast, honest, and well-understood.",
    photo: "/image.png",
    stack: [
      { label: "C++", icon: <TechIcon name="cplusplus" /> },
      { label: "Go", icon: <TechIcon name="go" /> },
      { label: "Python", icon: <TechIcon name="python" /> },
      { label: "JS", icon: <TechIcon name="javascript" /> },
      { label: "TS", icon: <TechIcon name="typescript" /> },
      { label: "React", icon: <TechIcon name="react" /> }
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
      tags: "A from-scratch C++ trading simulator — parses real NASDAQ data, rebuilds order books, and runs strategies against it.",
      description: "This one started as curiosity about how trading systems actually work under the hood. It reads real NASDAQ market data, reconstructs the full order book in real time, detects signals, and simulates a market-making strategy. I wrote it in C++ because I wanted to learn what it takes to make something genuinely fast — not just 'fast enough.'",
      stack: [
        { name: "C++", icon: <TechIcon name="cplusplus" /> },
        { name: "CMake", icon: <TechIcon name="cmake" /> },
        { name: "Linux", icon: <TechIcon name="linux" /> },
        { name: "MSVC", icon: <TechIcon name="visualstudio" /> },
        { name: "GCC", icon: <TechIcon name="gcc" /> },
        { name: "GDB", icon: <TechIcon name="gdb" /> },
        { name: "ASAN", icon: <TechIcon name="llvm" /> },
        { name: "Perf", icon: <Gauge size={14} /> },
        { name: "Godbolt", icon: <TechIcon name="compilerexplorer" /> }
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
        { date: "Feb 11", event: "Started with a lock-free SPSC ring buffer — wanted to understand cache-line alignment and atomics" },
        { date: "Feb 25", event: "Object pool with tagged pointers to prevent ABA — first time dealing with placement new" },
        { date: "Mar 20", event: "MVP ITCH parser — memcpy + byte-swap approach, imagine the manual conversions on the hot path" },
        { date: "May 05", event: "v3 orderbook overhaul — 4-layer hierarchical bitset, custom hash, OS-backed allocation" },
        { date: "May 08", event: "Multi-level OFI signal, multi-symbol market maker, flat-array optimizations" }
      ],
      whyParagraph: "Here's the thing about NASDAQ data — it's 10,000+ messages per second per symbol. I tried std::map first and quickly learned why that doesn't work: pointer chasing through red-black tree nodes kills your cache. std::unordered_map was better but had these random latency spikes from rehashing. So I ended up building my own data structures — a flat price-level array with a hierarchical bitset for O(1) best-bid/ask, and a custom hash table with murmur64 + linear probing for order lookups. That's where most of the interesting learning happened.",
      buildStory: "I didn't start with the parser — I started with the boring stuff. Spent all of February building the foundation: a lock-free queue, a high-resolution timer, and an object pool that uses tagged pointers to prevent ABA during concurrent allocation. The parser came in March ('imagine this shh on the hotpath' — actual commit message). The orderbook went through three rewrites before I landed on the v3 architecture in May. 9.03 GB of real NASDAQ data from October 30, 2019 — high-volatility day. It held up.",
      learnings: [
        {
          title: "Cache is everything",
          desc: "A cache miss to DRAM costs ~200 cycles. An L1 hit costs ~4. The difference between my std::map orderbook and the flat array wasn't algorithmic complexity — it was that one pointer-chases through random memory and the other is sequential. perf confirmed it: the bottleneck was never the algorithm, it was always the memory access pattern."
        },
        {
          title: "Exception handling has hidden costs even when nothing throws",
          desc: "C++ zero-cost exceptions aren't actually zero-cost everywhere. The compiler lays out exception tables in the binary for every potential throw site, and this affects code layout, inlining decisions, and can cause unpredictable latency at call sites even on the happy path. On the hot path, noexcept isn't just a hint — it changes what the compiler is allowed to do."
        },
        {
          title: "FORCE_INLINE doesn't mean the compiler will inline",
          desc: "I assumed __attribute__((always_inline)) was a guarantee. It's not — the compiler will still refuse it in some situations, like across translation units or when the function is too complex. I had to open Godbolt and check the actual assembly to confirm my hot path was actually inlined. This became a habit."
        },
        {
          title: "Branch prediction is incredible, but you can help it",
          desc: "The CPU's branch predictor is genuinely impressive, but random access patterns destroy it. Using [[likely]]/[[unlikely]] on the out-of-window and null-pointer checks helped, but the bigger win was making the common path branchless — array indexing instead of if/else chains. The hardware can't predict what you never ask it to."
        },
        {
          title: "The Avellaneda-Stoikov model",
          desc: "This was my first real exposure to market microstructure math. The model computes optimal bid and ask quotes as a function of your current inventory and realized volatility — you quote tighter when flat, wider when you're holding a position. Understanding why the spread exists and what it compensates for changed how I think about the data I was parsing."
        },
        {
          title: "Market microstructure is genuinely deep",
          desc: "OFI (Order Flow Imbalance) sounds simple — bid volume minus ask volume — but the multi-level weighted version tells you a lot more. Prices move before trades happen because order book shape is information. Understanding this is what makes the difference between treating market data as numbers and actually understanding what it represents."
        },
        {
          title: "Synchronization is really hard",
          desc: "The lock-free object pool looks clean but the ABA problem is subtle — two threads can CAS the same pointer even after the underlying memory has been reused. Tagged pointers with a monotonic counter fix it, but only if the counter never wraps in a visible window. I spent a long time convincing myself the memory ordering was correct across every interleaving."
        },
        {
          title: "Simple data structures go faster than clever ones",
          desc: "A flat array beats a balanced tree not because it's a smarter algorithm but because it's simple enough for the CPU to prefetch and the compiler to optimize. The hierarchical bitset is fast because it's just integer operations on contiguous memory. The lesson: keeping your data layout simple is a performance optimization, not a compromise."
        },
        {
          title: "Data layout is king — TLB pressure is real",
          desc: "The OrderBookMemory struct is a single 4096-byte-aligned allocation via VirtualAlloc/mmap. This isn't just about avoiding fragmentation — it's about TLB pressure. Every unique page your code touches needs a TLB entry. If your data is scattered across many pages, you start evicting TLB entries and paying the page-walk cost. Prefaulting the pages upfront (via memset or MAP_POPULATE) means you pay that cost once at startup, not randomly during market hours."
        },
        {
          title: "The compiler deleted my code",
          desc: "The compiler proved my result was never observed under the memory model, so it just... removed it. No warning, no error. I spent hours debugging 'missing' logic that the optimizer had legally erased. Volatile and memory barriers aren't paranoia — they're how you have a conversation with the optimizer."
        },
        {
          title: "Store buffers are not cache coherence",
          desc: "I assumed writing a value meant other cores could see it. Turns out store buffers sit between your core and the cache, and MESI coherence doesn't flush them. A write can sit in a store buffer for hundreds of cycles before it's visible. std::memory_order_release doesn't move data — it orders when it becomes visible."
        },
        {
          title: "Move semantics aren't what I thought",
          desc: "I went in thinking move semantics were about physically moving memory. They're really about value categories and overload resolution — the 'move' is a polite fiction the type system agrees to. The actual bytes often don't move at all, the compiler just stops calling the destructor on the source. Understanding this changed how I read C++ entirely."
        },
        {
          title: "Borrow checking clicked in hindsight",
          desc: "After days debugging aliased mutable access with ASAN, I realized Rust's borrow checker solves the exact same problem — it just catches it at compile time instead of at 3am with a sanitizer. Made me appreciate both languages more."
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
          title: "OrderBook + Hierarchical Bitset",
          label: "Hot Path",
          desc: "The book uses a flat price-level array indexed by offset from a base price — no trees, no pointer chasing. The interesting part is BBO discovery: I built a 4-layer hierarchical bitset where L0 has one bit per price level (1M bits), L1 summarizes L0, and so on up to a single uint64_t at L3. Finding best bid is just 4 TZCNT/LZCNT instructions walking down the layers. No matter how sparse the book is, it's always 4 lookups.",
          code: "// Best bid: walk down 4 layers\nint find_last() const {\n  size_t i2 = 63 - __builtin_clzll(l3);\n  size_t i1 = (i2 << 6) + (63 - __builtin_clzll(l2[i2]));\n  size_t i0 = (i1 << 6) + (63 - __builtin_clzll(l1[i1]));\n  return (i0 << 6) + (63 - __builtin_clzll(l0[i0]));\n}"
        },
        {
          title: "Memory Layout",
          label: "System Architecture",
          desc: "The entire OrderBookMemory struct is one 4096-byte-aligned allocation using VirtualAlloc on Windows or mmap on Linux — no malloc, no heap fragmentation. The object pool uses placement new for construction and tagged pointers (TaggedPtr with a monotonic counter) to prevent ABA during lock-free allocation. Guard pages between the hash index and price level arrays catch overflows at the OS level instead of corrupting silently.",
          code: "struct alignas(4096) OrderBookMemory {\n  IndexEntry order_index[INDEX_SIZE];\n  alignas(4096) char _pad0[4096]; // guard page\n  PriceLevel* price_levels[2][PRICE_WINDOW];\n  HierarchicalBitset bits[2];\n};"
        },
        {
          title: "ITCH Parser Dispatch",
          label: "Zero-Copy Decoding",
          desc: "The parser uses a static function pointer table indexed by message type — table['A'] points to parse_add_order, table['D'] to parse_delete_order, etc. No virtual dispatch, no switch statement. The actual field parsing uses memcpy + platform-specific byte swaps (_byteswap_ushort on MSVC, __builtin_bswap16 on GCC) which the compiler turns into single instructions. The interest_mask array lets you filter by stock locate before doing any real work.",
          code: "// Dispatch table — no switch, no vtable\nParserFn fn = table[data[0]];\nif (LIKELY(fn)) { fn(data, order); return true; }\n\n// Field parsing: memcpy + bswap = single instruction\nuint32_t v; memcpy(&v, p, 4);\nreturn __builtin_bswap32(v);"
        }
      ],
      tools: [
        {
          name: "C++",
          icon: <TechIcon name="cplusplus" />,
          desc: "C++23 / Systems language",
          proof: "Used [[likely]]/[[unlikely]] attributes on hot paths, alignas(4096) for page-aligned memory, placement new for the object pool, and std::atomic with explicit memory ordering (acquire/release) for the lock-free SPSC queue and pool."
        },
        {
          name: "MSVC",
          icon: <TechIcon name="visualstudio" />,
          desc: "Microsoft Visual C++ Compiler",
          proof: "Used _byteswap_ushort/_byteswap_ulong for ITCH field parsing, _tzcnt_u64/_lzcnt_u64 for the hierarchical bitset, and _aligned_malloc for the object pool's cache-line-aligned storage."
        },
        {
          name: "GCC",
          icon: <TechIcon name="gcc" />,
          desc: "GNU Compiler Collection",
          proof: "Used __builtin_bswap16/32/64 for zero-copy byte swapping in the parser, __builtin_ctzll/__builtin_clzll for the bitset, and __builtin_expect for branch hints. Cross-compiled with MSVC to make sure both work."
        },
        {
          name: "GDB",
          icon: <TechIcon name="gdb" />,
          desc: "Low-level debugger",
          proof: "Caught a segfault in the object pool — the pool was returning a slot before placement new finished constructing the object. Stack trace made it obvious once I saw the destructor being called on uninitialized memory."
        },
        {
          name: "ASAN",
          icon: <TechIcon name="llvm" />,
          desc: "Memory error detector",
          proof: "Found a dangling pointer in the hash index after erase — the linear probing rehash was relocating an entry but the old slot's pointer was still live long enough to be dereferenced once. Subtle and would've been a nightmare without ASAN."
        },
        {
          name: "Perf",
          icon: <Gauge size={20} />,
          desc: "Linux perf counters",
          proof: "Confirmed that the realistic benchmark bottleneck was L3 cache misses, not the algorithm — the OrderBookMemory struct is large enough that it doesn't stay hot in L1/L2 under multi-symbol workloads."
        },
        {
          name: "Godbolt",
          icon: <TechIcon name="compilerexplorer" />,
          desc: "Compiler Explorer",
          proof: "Verified find_last() compiles to 4 TZCNT/LZCNT instructions as expected. Also checked that FORCE_INLINE (__forceinline on MSVC, __attribute__((always_inline)) on GCC) was actually being respected."
        }
      ]
    },
    {
      id: "luckyos",
      category: "OS",
      highlight: "built from the first instruction the CPU executes",
      title: "LuckyOS",
      tags: "x86 Assembly · BIOS · Kernel basics",
      description: "A tiny operating system kernel I wrote from scratch. Bootloader, VGA text mode, the whole thing. Only time I wrote assembly and honestly it was pretty wild.",
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
      title: "Royal Beverages",
      tags: "PHP 8.2 · Vanilla JS · PostgreSQL · Custom MVC — no Laravel, no React, no jQuery.",
      whatIsThis: "A full online store — browse products, add to cart, checkout, track orders. There's a customer-facing storefront and a separate admin dashboard for managing inventory, orders, and customers. Every part of it, from the login system to the stock reservation logic, was written from scratch.",
      showArchDiagram: true,
      overviewLayers: [
        {
          label: 'What customers see',
          tagline: 'The website',
          colorBg: 'bg-orange-50',
          colorBorder: 'border-orange-200',
          colorIcon: 'text-orange-500',
          colorDot: 'bg-orange-500',
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
              <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
            </svg>
          ),
          bullets: ['Browse & search products', 'Add to cart, checkout', 'Track your order', 'Manage your wishlist'],
          reveal: 'Every click sends a request to the engine — nothing happens without it.',
        },
        {
          label: 'The engine',
          tagline: 'Processes everything',
          colorBg: 'bg-black/[0.02]',
          colorBorder: 'border-black/15',
          colorIcon: 'text-black/60',
          colorDot: 'bg-black',
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
              <circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
            </svg>
          ),
          bullets: ['Handles login & sessions', 'Checks stock before reserving', 'Routes each request correctly', 'Enforces who can do what'],
          reveal: 'Hand-rolled from scratch — no frameworks. Every rule lives here.',
        },
        {
          label: 'Stores everything',
          tagline: 'The memory',
          colorBg: 'bg-blue-50',
          colorBorder: 'border-blue-200',
          colorIcon: 'text-blue-500',
          colorDot: 'bg-blue-500',
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
              <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0018 0V5"/><path d="M3 12a9 3 0 0018 0"/>
            </svg>
          ),
          bullets: ['Products & inventory levels', 'Orders & order history', 'Customer accounts', 'Wishlists & recipe pages'],
          reveal: 'Over 30 pre-built read patterns power the whole site — fast and consistent.',
        },
      ],
      featureChips: ['Product catalog','Cart & checkout','Order tracking','Stock reservation','Wishlists','Flavor profiles','Recipe pages','User accounts','Admin dashboard','Inventory management','Order management','Customer management'],
      screenshots: [
        { label: "Storefront", placeholder: true },
        { label: "Product page", placeholder: true },
        { label: "Admin dashboard", placeholder: true },
        { label: "Order management", placeholder: true },
      ],
      description: "I built an entire e-commerce platform without touching a single framework. No Laravel, no React, no jQuery — just PHP 8.2, ES6 modules, and PostgreSQL. Every pattern in here (MVC, DI container, middleware, routing, stock reservation) is hand-rolled. I wanted to understand how web systems actually work before using libraries that do it for me.",
      stack: [
        { name: "PHP 8.2", icon: <TechIcon name="php" /> },
        { name: "JavaScript", icon: <TechIcon name="javascript" /> },
        { name: "PostgreSQL", icon: <TechIcon name="postgresql" /> },
        { name: "TailwindCSS", icon: <TechIcon name="tailwindcss" /> },
        { name: "Docker", icon: <TechIcon name="docker" /> },
        { name: "Apache", icon: <TechIcon name="apache" /> }
      ],
      metrics: [
        { label: "Scale", value: "22 / 21 / 20", sub: "Controllers / Services / Repositories — all auto-wired by the DI container" },
        { label: "Database", value: "17 tables · 36 views", sub: "Full schema with JSONB aggregates, partial indexes, and ENUM types" },
        { label: "Features shipped", value: "12 domains", sub: "Cart, orders, stock, auth, wishlist, recipes, flavor profiles, admin SPA..." }
      ],
      pipeline: [
        { name: "Request", group: "Entry", desc: "Apache mod_rewrite → index.php" },
        { name: "Middleware", group: "Entry", desc: "Auth, CSRF, RateLimit, CORS, JSON" },
        { name: "Router", group: "Core", desc: "Regex-based URI matching with groups" },
        { name: "DI Container", group: "Core", desc: "Reflection auto-wiring, singleton registry" },
        { name: "Controller", group: "Logic", desc: "Parse input, delegate — no business logic" },
        { name: "Service", group: "Logic", desc: "Business rules, validation" },
        { name: "Repository", group: "Data", desc: "SQL via 36 PostgreSQL views" },
        { name: "Model", group: "Data", desc: "PHP 8.2 constructor promotion" }
      ],
      timeline: [
        { date: "Phase 1", event: "Core engine — PSR-4 autoloader, regex router, session + CSRF singletons" },
        { date: "Phase 2", event: "DI container with Reflection auto-wiring and circular dependency detection" },
        { date: "Phase 3", event: "Middleware pipeline, exception hierarchy, standardized Response contract" },
        { date: "Phase 4", event: "17-table PostgreSQL schema, 36 admin views, multi-warehouse FIFO stock logic" },
        { date: "Phase 5", event: "Admin SPA — hash-based router, dynamic module imports, localStorage state" }
      ],
      whyParagraph: "I genuinely wanted to understand how frameworks work before using them. I couldn't explain how a DI container resolves a dependency graph, how a regex router works, or how you prevent overselling in a concurrent stock system without an ORM doing it for you. So I built all of it — and it turns out every 'magic' framework feature has a pretty understandable implementation underneath.",
      buildStory: "What started as a bare PHP script became a full MVC-S-R system with 22 controllers, 21 services, 20 repositories, and 18 models — all auto-wired by a Reflection-based DI container with circular dependency detection. The Admin SPA is framework-less too: hash-based routing, dynamic ES6 module imports, and a manual cleanup cycle to prevent DOM memory leaks. The database ended up with 36 PostgreSQL views so the PHP code never touches raw joins.",
      learnings: [
        {
          title: "Floats and money don't mix",
          desc: "0.1 + 0.2 = 0.30000000000000004. The moment I saw a cart total off by a fraction of a cent, I moved everything to price_cents INTEGER and never looked back. Floating point errors in e-commerce are silent until someone's invoice is wrong. Every price in the schema is stored in cents."
        },
        {
          title: "PostgreSQL views as a clean architectural boundary",
          desc: "36 views, one for every entity in both list and detail form. The PHP code never touches raw joins — the view is the contract. admin_list_products returns lightweight columns for table rendering. admin_detail_products returns JSONB aggregates for modals. If the schema changes, I fix the view and the application code stays the same."
        },
        {
          title: "Auth is way harder than it looks",
          desc: "Hand-rolling auth taught me about session fixation, timing attacks, and CSRF in ways I'd never thought about before. I had to use hash_equals for CSRF validation because regular === comparison leaks timing information character by character. session_regenerate_id(true) on login prevents session fixation. Small details, big consequences."
        },
        {
          title: "Partial indexes are underused",
          desc: "Indexing only WHERE is_active = TRUE AND deleted_at IS NULL keeps the index small and hot. A full index on a soft-deleted table is mostly wasted space that slows down every write. idx_carts_active_user is a unique partial index — only one active cart per user is enforced at the database level, not in application code."
        },
        {
          title: "Building a SPA without React taught me why React exists",
          desc: "Virtual DOM and reconciliation aren't magic — they're solutions to exact problems I ran into: state getting out of sync, DOM memory leaks from unremoved event listeners, and update logic becoming a tangled mess. Every page module now exports a cleanup() function. I get it now."
        },
        {
          title: "Reflection-based DI is beautiful but slow",
          desc: "Reading constructor signatures at runtime to auto-wire dependencies is elegant. It's also a syscall per class instantiation. The fix was registering everything as singletons in the ServiceProvider so resolution only happens once per request. 22 controllers, 21 services, 20 repositories — all wired, none reconstructed."
        },
        {
          title: "Row-level locking is the right answer for stock",
          desc: "Two concurrent requests can both read 'stock available = 1' before either commits a reservation. FOR UPDATE locks the stock row inside the transaction so the second request waits. Available stock is always calculated dynamically as quantity - reserved, never stored as a separate column that can drift."
        }
      ],
      limitations: [
        "Manual asset pipeline — no bundler, raw JS files",
        "Single-threaded PHP execution model",
        "No migration system — schema changes are raw SQL",
        "AI product recognition is schema-ready but WIP"
      ],
      nextSteps: [
        "Complete AI product recognition (Gemini Vision API)",
        "Add a proper DB migration runner",
        "OAuth login (scaffold already in users table)"
      ],
      technicalSections: [
        {
          title: "Reflection-based DI Container",
          label: "Auto-wiring",
          desc: "The container uses PHP's ReflectionClass to inspect constructor signatures at runtime and recursively resolves the full dependency graph. It detects circular dependencies by tracking which classes are currently being resolved, and registers singletons so the graph is only built once per request. When you call $container->get(ProductController::class), it walks: Controller → Service → Repository, instantiating each in reverse order.",
          code: "private function resolve(string $class): object {\n  $reflection = new ReflectionClass($class);\n  $constructor = $reflection->getConstructor();\n  // Recursively resolve each typed parameter\n  $deps = array_map(\n    fn($p) => $this->get($p->getType()->getName()),\n    $constructor->getParameters()\n  );\n  return $reflection->newInstanceArgs($deps);\n}"
        },
        {
          title: "Middleware Pipeline",
          label: "Chain of Responsibility",
          desc: "The middleware stack uses a recursive closure builder — each call to createNext() wraps the remaining middleware around the final handler, producing a nested callable chain. Five layers run on every request: AuthMiddleware (session + admin flag), CSRFMiddleware (hash_equals validation), JsonMiddleware (Content-Type), CorsMiddleware, and RateLimitMiddleware (session-based sliding window, no Redis needed).",
          code: "private function createNext(array $mw, callable $final): callable {\n  if (empty($mw)) return $final;\n  $current = array_shift($mw);\n  return fn($req) => $current->handle(\n    $req,\n    $this->createNext($mw, $final)\n  );\n}"
        },
        {
          title: "Multi-Warehouse FIFO Stock",
          label: "Concurrency",
          desc: "Stock reservation runs inside a transaction with FOR UPDATE on the stock row. This means the second concurrent request waits at the lock, reads the already-decremented quantity, and fails gracefully instead of double-booking. Available stock is calculated dynamically as quantity - reserved everywhere — it's never stored as a separate column that can drift out of sync across concurrent writes.",
          code: "-- Find warehouse with most available stock, lock it\nSELECT id, warehouse_id FROM stock\nWHERE product_id = :product_id\n  AND (quantity - reserved) >= :qty\nORDER BY (quantity - reserved) DESC\nLIMIT 1\nFOR UPDATE;\n\n-- Reserve\nUPDATE stock SET reserved = reserved + :qty WHERE id = :stock_id;"
        },
        {
          title: "Admin SPA — Hash Router",
          label: "Framework-less SPA",
          desc: "The admin panel is a single PHP shell that loads once. Navigation is hash-based (#products, #orders). Each route in ROUTE_MAP maps to a dynamic ES6 import — the module is loaded on demand, its view() function renders HTML into the <main> element, and its init() function returns a { cleanup() } object. Before every navigation, the previous cleanup() runs to remove event listeners and cancel any pending requests. Last visited page persists to localStorage.",
          code: "export const ROUTE_MAP = {\n  'products': {\n    module: () => import('./pages/Products/Products.js'),\n    view: 'Products',\n    init: 'initProducts'\n  },\n  // 18+ pages\n};\n// On navigate:\nawait cleanupActiveHandler();\nconst mod = await route.module();\ndocument.getElementById('content').innerHTML = mod[route.view]();\nactiveCleanup = mod[route.init]();"
        },
        {
          title: "PostgreSQL JSON Aggregation",
          label: "Schema Design",
          desc: "Every entity has two views: admin_list_* for table rendering (lightweight columns) and admin_detail_* for detail modals (rich JSONB aggregates). This means the PHP Repository makes one query and gets back a complete, deeply nested data structure — stock by warehouse, average rating, order history — without ORMs or N+1 queries. 36 views total.",
          code: "CREATE VIEW admin_detail_products AS\nSELECT p.*,\n  -- Stock by warehouse as JSON array\n  (SELECT JSON_AGG(row_to_json(t)) FROM (\n    SELECT w.name, s.quantity, s.reserved\n    FROM stock s\n    JOIN warehouses w ON s.warehouse_id = w.id\n    WHERE s.product_id = p.id\n  ) t) as stock_by_warehouse,\n  -- Average rating\n  (SELECT AVG(rating) FROM feedback f\n   WHERE f.product_id = p.id\n   AND f.is_active = TRUE) as avg_rating\nFROM products p WHERE p.deleted_at IS NULL;"
        }
      ],
      tools: [
        {
          name: "PHP 8.2",
          icon: <TechIcon name="php" />,
          desc: "Strictly typed backend",
          proof: "Used constructor promotion for all 18 models, strict_types=1 everywhere, named arguments for clarity, and the Reflection API for the DI container. Built a custom PSR-4 autoloader with a global fallback for legacy non-namespaced classes."
        },
        {
          name: "PostgreSQL",
          icon: <TechIcon name="postgresql" />,
          desc: "Relational DB with advanced features",
          proof: "17 tables, custom ENUM types for cart_status/order_status/payment_status, partial indexes (WHERE is_active = TRUE AND deleted_at IS NULL), unique partial indexes for cart integrity, and 36 views with JSONB aggregation."
        },
        {
          name: "Vanilla JS",
          icon: <TechIcon name="javascript" />,
          desc: "ES6 modules, no framework",
          proof: "Built a hash-based SPA router with dynamic import() for code splitting, a CSRF-aware fetch wrapper that auto-injects tokens on mutating requests, and a domain-organized API client with 10+ modules (products, cart, orders, wishlist, recipes...)."
        },
        {
          name: "Docker",
          icon: <TechIcon name="docker" />,
          desc: "One-command dev environment",
          proof: "docker-compose.yml spins up PHP 8.2-apache + PostgreSQL 15-alpine with volume mounts and auto-runs schema.sql and seed_data.sql on first start. Dev and prod environments are identical."
        },
        {
          name: "Apache",
          icon: <TechIcon name="apache" />,
          desc: "Web server with mod_rewrite",
          proof: "Two separate .htaccess configurations: one for the storefront (rewrites everything to public/index.php) and one for the API gateway (rewrites /api/v1/* to public/api/v1/index.php). URI normalization handles the 3-directory nesting via Reflection."
        }
      ]
    },
    {
      id: "reservation",
      category: "WEB",
      highlight: "drag a stall, watch the price recalculate in real time",
      title: "Colombo Book Fair — Stall Reservation",
      tags: "Spring Boot · React · WebSocket · Stripe · AWS",
      description: "A real-time booking platform I built with a team for the Colombo International Book Fair. You can drag stalls around on a live floor map and the price updates instantly based on where you place it. The fun part was making it sync across everyone's screen in under 100ms.",
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
        { label: "How it was built", value: "Team of 5", sub: "I led the architecture and security, we shipped it together" }
      ],
      timeline: [
        { date: "Feb 09", event: "Backend + frontend scaffold, full team setup" },
        { date: "Feb 13", event: "JWT security, entity design, CORS" },
        { date: "Feb 17", event: "9 critical API security fixes in one session" },
        { date: "Feb 28", event: "Caught hardcoded secrets in tracked files, extracted to .env" },
        { date: "Mar 01", event: "TLS via Nginx, CI/CD pipeline on AWS" },
        { date: "Mar 05", event: "RAG-powered help bot, debounced live pricing" }
      ],
      whyParagraph: "The booking flow was straightforward — the pricing engine was the fun part. Every stall has a position on the floor plan, and we wanted the price to reflect how good that spot actually is: close to an entrance? More expensive. Stuck in a corner? Cheaper. So we built this spatial scoring system that recalculates in real time as you drag stalls around. It felt like building a tiny physics engine.",
      buildStory: "Started as a university assignment but we got really into it. I handled the backend and security, and worked with four other people who are genuinely great engineers. We went from a classroom scaffold to something running on AWS with real vendors using it at the actual book fair. Seeing people book stalls on their phones with our system was pretty surreal.",
      learnings: [
        {
          title: "Row-level locking saved us from a nightmare",
          desc: "Without FOR UPDATE, two people could book the same stall at the same time and both get a confirmation. One line of SQL prevents that entire class of bugs. It was a 'wait, that's it?' moment but it really is that important."
        },
        {
          title: "WebSocket and REST think about state differently",
          desc: "This tripped us up for a while. REST is stateless, WebSocket is persistent shared state. If you mix them without a clear broadcast model, some clients just silently see stale data. STOMP topics gave us the pub-sub contract we needed."
        },
        {
          title: "I committed secrets to git (and learned the hard way)",
          desc: "Pushed a JWT secret and a Stripe key early on. Even after removing them, they're in the history forever. Now I use .env from day one and treat anything that touched a commit as compromised. Embarrassing but valuable lesson."
        },
        {
          title: "N+1 queries are invisible until everything is slow",
          desc: "The admin dashboard was firing a separate query per stall per reservation. Fine with 10 rows, brutal with real data. JOIN FETCH collapsed dozens of round trips into one query. Classic thing you don't notice until it's too late."
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
      description: "A RAG pipeline I built from scratch to understand what's actually happening behind tools like LangChain and Pinecone. No managed vector databases, no orchestration libraries — just pgvector, an HNSW index, and a local embedding model. I wanted to see how retrieval actually works.",
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
      whyParagraph: "I kept using RAG tools without really understanding them. Like, how does a question about 'resetting passwords' find the right paragraph without any keyword matching? I wanted to build one myself to figure that out. Turns out when you own the index, search becomes a systems problem — and it's way more interesting than just calling an API.",
      buildStory: "Started by just trying to understand the distance metrics in pgvector — cosine similarity vs Euclidean distance. Picked a 384-dimension model (all-MiniLM-L6-v2) because it has a great speed-to-accuracy ratio. The biggest headache was chunking: naive fixed-size splitting kept cutting right through the middle of code blocks. Header-aware splitting fixed that and made a huge difference in retrieval quality.",
      learnings: [
        {
          title: "Meaning is just geometry",
          desc: "This is the thing that blew my mind. How does a question about 'resetting passwords' find the right paragraph without any keyword matching? Because meaning gets encoded as coordinates in space, and similar meanings end up near each other. Once I understood that, tools like Pinecone and LangChain stopped being magic — they're just wrappers around that one idea."
        },
        {
          title: "How you chunk the text matters more than which LLM you use",
          desc: "Fixed-size chunking is easy to implement but it kept cutting my docs right in the middle of a code block. Header-aware chunking means the LLM gets the full 'Quick Start' or 'Configuration' section as one piece. The retrieval quality jump was dramatic."
        },
        {
          title: "HNSW indexing is really cool",
          desc: "Brute force cosine similarity scales linearly with your data. HNSW builds a graph structure for approximate nearest neighbor search — it turns the problem into a graph traversal. Query times stay sub-50ms even as the document count grows. The math behind it is genuinely elegant."
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
          proof: "Implemented HNSW graph indexing on 384d vectors. Used the <=> cosine similarity operator to calculate semantic distance directly within SQL queries, avoiding data transfer to the application layer for ranking.\""
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
      description: "A cloud storage app like Google Drive — login, upload files, use them anywhere. I built it with Next.js 15 to see how far Server Actions and Appwrite can go as a full backend replacement. It was also an excuse to play with the newest React 19 features.",
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
      whyParagraph: "I wanted to build something that's more than just fetching data. A cloud storage app forces you to think about binary streams, mime-type validation, and managing state across server and client. Using Appwrite let me focus on the interesting orchestration part — how does a file actually get from someone's desktop to a secure bucket while keeping all the metadata searchable?",
      buildStory: "The biggest surprise was how much the server/client boundary in Next.js 15 trips you up. Some of my auth code was accidentally trying to use browser APIs on the server. Refactoring that was a deep lesson in how these modern frameworks bridge the network gap. The file categorization engine was the fun part — it sorts uploads into logical buckets automatically based on extension and metadata.",
      learnings: [
        {
          title: "The server/client boundary is trickier than it looks",
          desc: "Next.js 15 makes it really easy to accidentally use browser APIs on the server. 'use server' doesn't mean 'works everywhere.' Refactoring the auth layer to be environment-agnostic taught me a lot about how these frameworks actually work under the hood."
        },
        {
          title: "BaaS is really about the glue code",
          desc: "Appwrite gives you primitives, but the real work is making sure a successful upload always has a matching database entry — and cleaning up if one fails. It's distributed transactionality, just at a smaller scale than it sounds."
        },
        {
          title: "MIME types are sneakier than you'd think",
          desc: "I built a mapping system that checks file extensions against the actual binary content. Someone renaming a .exe to .jpg shouldn't get past your upload validation. Small detail, but important."
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
      description: "Disclaimer: this is still a work in progress! It's a proxy that sits between you and an MCP server, logging everything the agent does. Right now it intercepts stdio pipes, but the goal is to make it work with any transport — I want to be able to watch what autonomous agents are actually doing.",
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
      whyParagraph: "As LLM agents get more autonomous, I think we need better ways to see what they're actually doing. MCPWatch started with MCP but the goal is bigger — whether it's a node script talking over stdio or a remote agent calling an HTTPS tool, it should be observable and searchable in real-time. It's not just a debugger, it's more like an audit layer for AI.",
      buildStory: "I started this in another language but switched to Go because its concurrency model is perfect for this kind of thing. The core challenge was proxying stdio without blocking the process — io.TeeReader let me tap the stream for logging while the original command keeps running like I'm not there. SQLite's WAL mode was essential so the dashboard can read while the logger is writing.",
      learnings: [
        {
          title: "TeeReader is the perfect primitive for this",
          desc: "Proxying isn't just passing data — it's observing it without affecting the flow. io.TeeReader lets me tap the pipe for logging while the original command keeps receiving data like I'm not there. It's one of those stdlib gems that does exactly what you need."
        },
        {
          title: "WAL mode is essential for live dashboards",
          desc: "Standard SQLite locking blocks your UI if the logger is busy writing. Enabling WAL mode lets readers and writers work at the same time. When you have a live dashboard polling a database that's being flooded with RPC logs, this isn't optional."
        },
        {
          title: "You own the process lifecycle now",
          desc: "Wrapping a process means you're responsible for its entire lifecycle. I had to learn how to properly propagate signals and wait for the child to exit before closing the database. If you don't wait correctly, you lose the last messages — which are usually the most important ones."
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
    },
    {
      id: "pysqlite",
      category: "EXPERIMENTS",
      title: "PySQLITE",
      highlight: "failed experiment with descriptors",
      tags: "Python · Metaprogramming · SQL · Descriptors",
      description: "A Python-based framework for working with SQL using metaprogramming and the descriptor protocol. It was meant to be a tiny ORM until it got too complex for its own good. A great lesson in why some things are better left simple.",
      stack: [
        { name: "Python", icon: <TechIcon name="python" /> },
        { name: "SQLite", icon: <TechIcon name="sqlite" /> }
      ],
      whyParagraph: "I wanted to understand how ORMs like SQLAlchemy actually work under the hood. I got deep into Python descriptors and metaclasses. It mostly works, but the complexity exploded faster than I expected. Still, I learned more about Python's internals here than in any other project.",
      buildStory: "Started as a 100-line script to automate some SQL queries. Ended up as a full-blown descriptor-based system. It's 'failed' in the sense that I wouldn't use it for a real app, but 'successful' because I finally understand what `__get__` and `__set__` actually do.",
      learnings: [
        {
          title: "Metaprogramming is a double-edged sword",
          desc: "You can make things look like magic, but debugging that magic is a nightmare. I spent more time debugging the ORM than I would have spent just writing raw SQL."
        }
      ],
      metrics: [
        { label: "Production Usage", value: "0%", sub: "Successfully kept away from real databases" },
        { label: "Learning ROI", value: "Infinite", sub: "Finally understood descriptors and metaclasses" }
      ]
    },
    {
      id: "gpt-tokenizer",
      category: "EXPERIMENTS",
      title: "GPT-2 Style Tokenizer",
      highlight: "cute little BPE implementation",
      tags: "Python · ML · Tokenization · BPE",
      description: "A from-scratch implementation of Byte Pair Encoding (BPE), the same tokenization algorithm used by GPT-2. Built because I wanted to understand how a model actually 'sees' text before the embeddings happen.",
      stack: [
        { name: "Python", icon: <TechIcon name="python" /> }
      ],
      whyParagraph: "Tokenization is the foundation of LLMs, but most people just treat it as a black box. I wanted to see how you actually build a vocabulary from scratch and handle sub-word splits.",
      buildStory: "Wrote this while following along with some research papers. It was a lot of fun to see how common character pairs gradually merge into meaningful tokens. It's simple, but it works.",
      learnings: [
        {
          title: "The beauty of BPE",
          desc: "It's such an elegant way to handle the vocabulary problem. You start with bytes and end up with words, and it's all just counting frequencies."
        }
      ],
      metrics: [
        { label: "Vocabulary Size", value: "50,257", sub: "Same as GPT-2's base vocab" },
        { label: "Training Speed", value: "4ms", sub: "Per-epoch latency for token merges" },
        { label: "Context Window", value: "0", sub: "It just cuts the text, doesn't think yet" }
      ]
    },
    {
      id: "piano-tiles",
      category: "EXPERIMENTS",
      title: "Piano Tiles",
      highlight: "pure fun, no serious engineering",
      tags: "JavaScript · HTML5 · CSS3 · GameDev",
      description: "A simple clone of the Piano Tiles game. No high-performance systems, no complex backend — just a fun little project to practice DOM manipulation and event handling. Sometimes you just need to build something that moves.",
      stack: [
        { name: "JavaScript", icon: <TechIcon name="javascript" /> },
        { name: "HTML5", icon: <TechIcon name="html5" /> },
        { name: "CSS3", icon: <TechIcon name="css3" /> }
      ],
      whyParagraph: "This was one of the first things I built just because I was bored. It's not 'heavy engineering,' but it reminded me why I started programming in the first place: it's fun to make things happen on the screen.",
      buildStory: "Built in a weekend. I was trying to see how fast I could make the tiles move before the browser started dropping frames. Not exactly 48M msgs/sec, but it was a blast.",
      learnings: [
        {
          title: "Keeping it simple",
          desc: "Not every project needs a custom memory allocator. Sometimes a `requestAnimationFrame` is all you need."
        }
      ],
      metrics: [
        { label: "High Score", value: "1,420", sub: "My personal best before it gets too fast" },
        { label: "Frame Rate", value: "60 FPS", sub: "Smooth enough for a browser game" }
      ]
    }
  ],
  writing: [
    {
      id: 1,
      title: "The CPU You Think You Know Doesn’t Exist",
      date: "Oct 2024",
      url: "https://medium.com/@niroshasulochini/the-cpu-you-think-you-know-doesnt-exist-a1b2c3d4e5f6",
      description: "I tried to explain why the CPU in your head is wrong. Out-of-order execution, branch prediction, and why your mental model of 'one instruction at a time' hasn't been true for decades."
    },
    {
      id: 2,
      title: "Deadlines?",
      date: "Sep 2024",
      url: "https://medium.com/@niroshasulochini/deadlines-a1b2c3d4e5f6",
      description: "What happens when you can't use half of C++? A look at the features that are straight-up banned in medical and aerospace software, and why."
    },
    {
      id: 3,
      title: "My Journey into the Machine: Building an OS from Scratch",
      date: "Aug 2024",
      url: "https://medium.com/@niroshasulochini/my-journey-into-the-machine-a1b2c3d4e5f6",
      description: "Writing about what it was actually like to build a kernel from scratch. The BIOS interrupts, the VGA driver, and the many times I had no idea what was going on."
    },
    {
      id: 4,
      title: "How Mathematics is Predicting Wildfire Paths",
      date: "Jul 2024",
      url: "https://medium.com/@niroshasulochini/wildfire-prediction-a1b2c3d4e5f6",
      description: "I found some really interesting papers from ICAPS 2025 about predicting wildfire paths with differential equations and spatial data. Tried to explain the math in a way that makes sense."
    }
  ],
  fullStack: [
    {
      category: "LANGUAGES",
      items: [
        { name: "C++", icon: <TechIcon name="cplusplus" />, projects: [{ id: "backtesting", title: "Backtesting Engine", context: "orderbook, OFI pipeline, object pool" }] },
        { name: "Go", icon: <TechIcon name="go" />, projects: [{ id: "mcpwatch", title: "MCPWatch", context: "JSON-RPC interception layer" }] },
        { name: "Python", icon: <TechIcon name="python" />, projects: [{ id: "rag-pipeline", title: "RAG Pipeline", context: "semantic search & ingestion" }, { id: "pysqlite", title: "PySQLITE", context: "metaprogramming & descriptors" }, { id: "gpt-tokenizer", title: "GPT-2 Tokenizer", context: "BPE implementation" }] },
        { name: "Java", icon: <TechIcon name="java" />, projects: [{ id: "reservation", title: "Book Fair Reservation", context: "Spring Boot & WebSocket sync" }] },
        { name: "TypeScript", icon: <TechIcon name="typescript" />, projects: [{ id: "storeit", title: "StoreIt", context: "Next.js 15 Server Actions" }] },
        { name: "PHP", icon: <TechIcon name="php" />, projects: [{ id: "royal-liquor", title: "Royal Beverages", context: "Custom MVC framework" }] },
        { name: "JavaScript", icon: <TechIcon name="javascript" />, projects: [{ id: "royal-liquor", title: "Royal Beverages", context: "Vanilla JS SPA dashboard" }, { id: "piano-tiles", title: "Piano Tiles", context: "DOM manipulation & event handling" }] },
        { name: "x86 Assembly", icon: <Binary size={24} />, projects: [{ id: "luckyos", title: "LuckyOS", context: "Bootloader & VGA drivers" }] }
      ]
    },
    {
      category: "DATABASES",
      items: [
        { name: "PostgreSQL", icon: <TechIcon name="postgresql" />, projects: [{ id: "royal-liquor", title: "Royal Beverages", context: "Complex views & triggers" }, { id: "reservation", title: "Book Fair Reservation", context: "FOR UPDATE locking" }, { id: "rag-pipeline", title: "RAG Pipeline", context: "pgvector semantic search" }] },
        { name: "SQLite", icon: <TechIcon name="sqlite" />, projects: [{ id: "mcpwatch", title: "MCPWatch", context: "WAL-mode RPC logging" }, { id: "pysqlite", title: "PySQLITE", context: "failed descriptor-based ORM" }] },
        { name: "Appwrite", icon: <TechIcon name="appwrite" />, projects: [{ id: "storeit", title: "StoreIt", context: "BaaS file orchestration" }] }
      ]
    },
    {
      category: "INFRASTRUCTURE / DEVOPS",
      items: [
        { name: "Docker", icon: <TechIcon name="docker" />, projects: [{ id: "mcpwatch", title: "MCPWatch", context: "Containerized deployment" }, { id: "rag-pipeline", title: "RAG Pipeline", context: "Multi-service composition" }, { id: "royal-liquor", title: "Royal Beverages", context: "Dev-prod parity" }] },
        { name: "AWS", icon: <TechIcon name="amazonwebservices" />, projects: [{ id: "reservation", title: "Book Fair Reservation", context: "EC2 & Nginx deployment" }] },
        { name: "Linux", icon: <TechIcon name="linux" />, projects: [{ id: "backtesting", title: "Backtesting Engine", context: "perf profiling & tuning" }] },
        { name: "GitHub Actions", icon: <TechIcon name="githubactions" />, projects: [{ id: "reservation", title: "Book Fair Reservation", context: "Automated CI/CD pipeline" }] }
      ]
    },
    {
      category: "TOOLS & FRAMEWORKS",
      items: [
        { name: "React", icon: <TechIcon name="react" />, projects: [{ id: "reservation", title: "Book Fair Reservation", context: "Client-side floor map & state" }] },
        { name: "Next.js 15", icon: <TechIcon name="nextdotjs" />, projects: [{ id: "storeit", title: "StoreIt", context: "Server Actions & Auth" }] },
        { name: "Spring Boot", icon: <TechIcon name="spring" />, projects: [{ id: "reservation", title: "Book Fair Reservation", context: "Security filter chains" }] },
        { name: "FastAPI", icon: <TechIcon name="fastapi" />, projects: [{ id: "rag-pipeline", title: "RAG Pipeline", context: "Async API orchestration" }] },
        { name: "Perf", icon: <Gauge size={24} />, projects: [{ id: "backtesting", title: "Backtesting Engine", context: "L3 cache bottleneck verification" }] },
        { name: "GDB", icon: <TechIcon name="gdb" />, projects: [{ id: "backtesting", title: "Backtesting Engine", context: "low-level debugging" }] },
        { name: "ASAN", icon: <TechIcon name="llvm" />, projects: [{ id: "backtesting", title: "Backtesting Engine", context: "memory error detection" }] },
        { name: "MSVC", icon: <TechIcon name="visualstudio" />, projects: [{ id: "backtesting", title: "Backtesting Engine", context: "platform intrinsics" }] },
        { name: "GCC", icon: <TechIcon name="gcc" />, projects: [{ id: "backtesting", title: "Backtesting Engine", context: "branch hints & verification" }] },
        { name: "Godbolt", icon: <TechIcon name="compilerexplorer" />, projects: [{ id: "backtesting", title: "Backtesting Engine", context: "assembly verification" }] }
      ]
    }
  ]
};
