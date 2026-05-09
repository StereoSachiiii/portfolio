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
      title: "Backtesting Engine",
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
          desc: "To achieve O(1) access, the book uses a flat price-level array indexed by offset from a base price. Unlike std::map (O(log n)), this layout is sequential and cache-friendly, avoiding the pointer-chasing and instruction cache pollution inherent in red-black trees. BBO detection is handled by a 4-layer hierarchical bitset: a single 64-bit word covers 64 price levels, with higher layers providing an accelerated index. This ensures best bid/offer discovery in at most 4 TZCNT instructions regardless of book depth.",
          code: "// O(1) BBO — single TZCNT instruction\nint idx = memory_->bits[0].find_last();"
        },
        {
          title: "Memory Model & Cache Strategy",
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
          icon: <TechIcon name="microsoft" />,
          desc: "Microsoft Visual C++ Compiler",
          proof: "Optimized the Windows build using MSVC-specific intrinsics like __lzcnt64 and __popcnt64. Managed cache-aligned memory using _aligned_malloc for deterministic heap behavior."
        },
        {
          name: "GCC",
          icon: <TechIcon name="gnubash" />,
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
      id: "tokenizers",
      category: "SYSTEMS",
      featuredStat: "1.2M tokens/s",
      title: "Fast BPE Tokenizers",
      date: "Dec 2025",
      tags: "C++ · Python · High-performance text processing",
      description: "Clean-room implementation of Byte Pair Encoding tokenizers in C++ for maximum throughput. Optimized for LLM inference pipelines.",
      stack: [
        { label: "C++", icon: <TechIcon name="cplusplus" /> },
        { label: "Python", icon: <TechIcon name="python" /> }
      ]
    },
    {
      id: "luckyos",
      category: "OS",
      featuredStat: "boots in QEMU",
      title: "LuckyOS",
      date: "Oct 2025",
      tags: "x86 Assembly · BIOS · Kernel basics",
      description: "A minimal operating system kernel written from scratch. Implements a basic bootloader and VGA text mode drivers.",
      stack: [
        { label: "x86", icon: <Terminal size={14} /> },
        { label: "Assembly", icon: <Code2 size={14} /> }
      ]
    },
    {
      id: "royal-liquor",
      category: "WEB",
      featuredStat: "22 Controllers",
      title: "Royal Liquor Store",
      date: "Aug 2025",
      tags: "PHP · MVC · E-commerce",
      description: "A custom-built e-commerce platform using the MVC architectural pattern. Features robust inventory management and user authentication.",
      stack: [
        { label: "PHP", icon: <TechIcon name="php" /> },
        { label: "MySQL", icon: <TechIcon name="mysql" /> }
      ]
    },
    {
      id: "mcpwatch",
      category: "SYSTEMS",
      featuredStat: "12k req/s",
      title: "MCPWatch Proxy",
      tags: "Observability proxy for Model Context Protocol agents, built in Go.",
      description: "A high-performance proxy layer that intercepts and logs communication between LLM agents and MCP servers. Designed to provide visibility into agent actions and resource usage with minimal overhead.",
      metrics: [
        { label: "Overhead", value: "< 2ms", sub: "request/response delay" },
        { label: "Throughput", value: "12k req/s", sub: "single core" },
        { label: "Storage", value: "SQLite", sub: "persistent audit logs" }
      ],
      pipeline: [
        { name: "Agent", group: "Data", desc: "Claude / LLM Client" },
        { name: "Proxy", group: "Core", desc: "Go-based interception layer" },
        { name: "Audit Log", group: "Core", desc: "Structured event capture" },
        { name: "MCP Server", group: "Execution", desc: "Final tool execution" }
      ],
      timeline: [
        { date: "May 01", event: "JSON-RPC interception logic" },
        { date: "May 03", event: "SQLite persistence & audit dashboard" }
      ],
      overview: "As LLM agents become more autonomous, we need a way to monitor their tool usage in real-time. MCPWatch acts as a transparent proxy that records every JSON-RPC call, allowing for detailed auditing and security monitoring of agent-based workflows.",
      technical: "Built with Go's net/http package for high-concurrency handling. It uses a middleware-style interception pattern to log payloads before forwarding them to the destination. The persistence layer uses SQLite with write-ahead logging (WAL) enabled for maximum write performance without sacrificing ACID compliance."
    }
  ],
  writing: [
    {
      id: 1,
      title: "Engineering the OrderBook: Bitsets vs Vectors",
      date: "May 2026",
      url: "#",
      description: "Why O(log n) isn't fast enough for HFT, and how hardware-accelerated bitsets changed everything."
    },
    {
      id: 2,
      title: "The Hidden Cost of Zero-Copy Parsers",
      date: "Apr 2026",
      url: "#",
      description: "A deep dive into cache misses and branch misprediction in binary data ingestion."
    }
  ],
  fullStack: [
    {
      category: "LANGUAGES",
      items: [
        { name: "C++", icon: <TechIcon name="cplusplus" />, projects: [{ id: "backtesting", title: "Backtesting Engine", context: "orderbook, OFI pipeline, object pool" }, { id: "tokenizers", title: "Fast BPE Tokenizers", context: "SIMD-accelerated throughput" }] },
        { name: "Go", icon: <TechIcon name="go" />, projects: [{ id: "mcpwatch", title: "MCPWatch Proxy", context: "JSON-RPC interception layer" }] },
        { name: "Python", icon: <TechIcon name="python" />, projects: [{ id: "tokenizers", title: "Fast BPE Tokenizers", context: "C++ binding & testing" }] },
        { name: "PHP", icon: <TechIcon name="php" />, projects: [{ id: "royal-liquor", title: "Royal Liquor Store", context: "Custom MVC framework" }] },
        { name: "x86 Assembly", icon: <Binary size={24} />, projects: [{ id: "luckyos", title: "LuckyOS", context: "Bootloader & VGA drivers" }] }
      ]
    },
    {
      category: "SYSTEMS",
      items: [
        { name: "Lock-free structures", icon: <Activity size={24} />, projects: [{ id: "backtesting", title: "Backtesting Engine", context: "SPSC ring buffer" }] },
        { name: "Memory allocators", icon: <Binary size={24} />, projects: [{ id: "backtesting", title: "Backtesting Engine", context: "OS-backed page pools" }] },
        { name: "Cache alignment", icon: <Gauge size={24} />, projects: [{ id: "backtesting", title: "Backtesting Engine", context: "alignas(64) hot paths" }] },
        { name: "SIMD intrinsics", icon: <Activity size={24} />, projects: [{ id: "tokenizers", title: "Fast BPE Tokenizers", context: "Vectorized byte matching" }] },
        { name: "Custom hash maps", icon: <Binary size={24} />, projects: [{ id: "backtesting", title: "Backtesting Engine", context: "Robin Hood rehash indexing" }] }
      ]
    },
    {
      category: "INFRASTRUCTURE",
      items: [
        { name: "Linux", icon: <TechIcon name="linux" />, projects: [{ id: "backtesting", title: "Backtesting Engine", context: "perf profiling & tuning" }] },
        { name: "CMake", icon: <TechIcon name="cmake" />, projects: [{ id: "backtesting", title: "Backtesting Engine", context: "Cross-platform build system" }] },
        { name: "Docker", icon: <TechIcon name="docker" />, projects: [{ id: "mcpwatch", title: "MCPWatch Proxy", context: "Containerized deployment" }] }
      ]
    },
    {
      category: "TOOLS",
      items: [
        { name: "GDB", icon: <TechIcon name="gdb" />, projects: [{ id: "backtesting", title: "Backtesting Engine", context: "placement new segfault hunt" }] },
        { name: "ASAN", icon: <TechIcon name="llvm" />, projects: [{ id: "backtesting", title: "Backtesting Engine", context: "Robin Hood rehash junk pointers" }] },
        { name: "Perf", icon: <Gauge size={24} />, projects: [{ id: "backtesting", title: "Backtesting Engine", context: "L3 cache bottleneck verification" }] },
        { name: "Godbolt", icon: <TechIcon name="compilerexplorer" />, projects: [{ id: "backtesting", title: "Backtesting Engine", context: "TZCNT assembly verification" }] }
      ]
    }
  ]
};
