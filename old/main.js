// ============================================================
//  CONFIG — The only things you ever touch
// ============================================================

var GITHUB_USER = 'StereoSachiiii';
var MEDIUM_FEED = 'https://medium.com/feed/@niroshasulochini';

// Which repos appear, in what order. Everything else hidden.
var FEATURED = ['backtesting_engine', 'os-dev-project', 'royal-liquor', 'reservation_system', 'rag-pipeline', 'GPT-2-style-BPE'];

// Detail-view enrichment (GitHub can't provide these)
var ENRICHMENT = {
    backtesting_engine: {
        displayTitle: 'BACKTESTING ENGINE',
        nouns: 'NASDAQ ITCH 5.0 · lock-free SPSC · 128-bit CAS · x86 intrinsics',
        detailDescription: 'High-performance C++ orderbook reconstructor for nanosecond-level latency. Parses raw binary feeds into a cache-aware limit order book using lock-free SPSC queues and object pools. Implements 128-bit atomic operations for ABA prevention and zero heap allocations on the hot path.',
        decisions: [
            'lock-free over mutex — contention was measurable at 10k messages/sec',
            'store buffer drain order informed struct layout to minimize write stalls',
            'Windows-only implementation leveraging Winsock and IOCP for maximized throughput',
            'std::hive for order pool \u2014 pointer stability without indirection'
        ],
        resonance: 'cpp'
    },
    'os-dev-project': {
        displayTitle: 'LUCKY OS',
        nouns: 'x86 Assembly · BIOS interrupts · bootloader · kernel zero',
        detailDescription: 'A 16-bit operating system written in x86 Assembly. Features a custom bootloader that handles the transition from BIOS, CPUID detection, and a minimal kernel. Built to understand the raw interface between software and hardware.',
        decisions: [
            '16-bit Real Mode \u2014 easier access to BIOS interrupts for legacy I/O',
            'nasm over gas \u2014 preferred intel syntax for readability',
            'direct VGA memory writing \u2014 zero-abstraction screen output'
        ],
        resonance: 'cpp'
    },
    'royal-liquor': {
        displayTitle: 'ROYAL LIQUOR',
        nouns: 'custom DI container · framework-less SPA · middleware pipeline',
        detailDescription: 'Full e-commerce platform built without frameworks. Custom router, dependency injection container, and vanilla SPA renderer. 23 models, 26 services, layered middleware architecture. Built to understand what Laravel and Symfony abstract away.',
        decisions: [
            'no framework \u2014 the point was to build what frameworks typically hide',
            'custom DI container over service locator \u2014 explicit wiring of 26+ services',
            'SPA rendering with vanilla DOM diffing \u2014 understood React fundamentals'
        ],
        resonance: null
    },
    'reservation_system': {
        displayTitle: 'RESERVATION SYSTEM',
        nouns: 'Spring Boot · influence zone math · STOMP WebSocket · Stripe',
        detailDescription: 'Enterprise-grade book fair management system. Features a custom stall map designer with influence zone calculations for spatial planning. Implements real-time booking synchronization via WebSockets and secure payment processing with Stripe.',
        decisions: [
            'STOMP over raw WebSockets \u2014 simplified sub/pub for stall states',
            'influence zone math \u2014 automated stall pricing based on visitor flow',
            'Spring Security with JWT \u2014 stateless auth for scalability',
            'CI/CD on t3.micro \u2014 optimized for cost-effective deployment'
        ],
        resonance: 'typescript'
    },
    'rag-pipeline': {
        displayTitle: 'RAG PIPELINE',
        nouns: 'vector embeddings · groq inference · context-aware retrieval',
        detailDescription: 'Minimal retrieval-augmented generation pipeline. Less than 10 lines of config to set up an expert for any application. Uses Groq as inference provider for sub-200ms response times. Chunking strategy optimized for technical documentation.',
        decisions: [
            'groq over OpenAI \u2014 latency was the constraint, not quality',
            'fixed chunk size over semantic splitting \u2014 simpler, predictable',
            'no agent framework \u2014 direct pipeline, no LangChain overhead'
        ],
        resonance: 'python'
    },
    'GPT-2-style-BPE': {
        displayTitle: 'BPE TOKENIZER',
        nouns: 'Byte Pair Encoding · NLP · Python · greedy merging',
        detailDescription: 'A pure Python implementation of the Byte Pair Encoding algorithm used in GPT-2. Designed to understand the greedy merge process and vocabulary construction from scratch. Handles byte-level encoding to ensure universal character support.',
        decisions: [
            'byte-level encoding \u2014 avoids [UNK] token issues across different languages',
            'pure python \u2014 prioritized logic clarity over execution speed for learning',
            'greedy merging \u2014 direct implementation of the GPT-2 paper approach'
        ],
        resonance: 'python'
    }
};

// ============================================================
//  HELPERS
// ============================================================

var MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function formatDate(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    return MONTHS[d.getMonth()] + ' ' + d.getFullYear();
}

function stripHtml(html) {
    var el = document.createElement('div');
    el.innerHTML = html;
    return (el.textContent || el.innerText || '').trim();
}

function truncate(str, len) {
    if (!str) return '';
    str = str.trim();
    return str.length > len ? str.slice(0, len - 1).trim() + '\u2026' : str;
}

// ============================================================
//  FALLBACKS (used when API/RSS calls fail)
// ============================================================

var FALLBACK_PROJECTS = FEATURED.map(function (name) {
    var e = ENRICHMENT[name] || {};
    return {
        id: name,
        title: e.displayTitle || name.toUpperCase().replace(/-/g, ' '),
        nouns: e.nouns || '',
        description: e.detailDescription || 'A high-performance C++ orderbook reconstructor designed for nanosecond-level latency. It parses raw NASDAQ ITCH 5.0 binary feeds into a cache-aware limit order book using custom lock-free SPSC queues and object pools.',
        decisions: e.decisions || [],
        github: 'https://github.com/' + GITHUB_USER + '/' + name,
        screenshot: null,
        resonance: e.resonance || null,
        language: null,
        pushedAt: null
    };
});

var FALLBACK_WRITING = [
    { id: 'deadlines', title: 'Deadlines? \u2014 Banned C++ Features in Real-Time Systems', url: 'https://medium.com/@niroshasulochini/deadlines-83d54ef287bf', date: 'Mar 2026', description: 'Why every banned feature in HFT has cost = f(runtime input). WCET analysis, store buffer drains, and making systems provably bounded.' },
    { id: 'wildfire', title: 'How Mathematics is Predicting Wildfire Paths', url: 'https://medium.com/@niroshasulochini/how-mathematics-is-predicting-wildfire-paths-4fd00dcf3f58', date: 'Dec 2025', description: 'ICAPS 2025 research review \u2014 Level Set Method with Bayesian correction for wildfire boundary simulation.' },
    { id: 'luckyos', title: 'Building an OS from Scratch', url: 'https://medium.com/@niroshasulochini/my-journey-into-the-machine-building-an-os-from-scratch-a87f1d41e11d', date: 'Jun 2025', description: 'LuckyOS \u2014 a 16-bit operating system written in x86 Assembly. BIOS interrupts, CPUID, custom bootloader.' },
    { id: 'stored-procedures', title: 'MySQL Stored Procedures', url: 'https://medium.com/@niroshasulochini/mysql-stored-procedures-4a75f1dcdfeb', date: 'Jan 2025', description: 'Precompiled SQL, reduced network traffic, and encapsulated database logic.' },
    { id: 'cia-triad', title: 'The CIA Triad: The Cornerstone of Cyber Security', url: 'https://medium.com/@niroshasulochini/the-cia-triad-the-cornerstone-of-cyber-security-9a99d0e65bea', date: 'Jul 2024', description: 'Confidentiality, Integrity, Availability \u2014 the framework for evaluating security measures.' }
];

var STACK_DATA = [
    {
        category: 'When I need performance',
        items: [
            { name: 'C++23', slug: 'cplusplus', res: 'cpp', sn: 'lock-free SPSC queue, tagged pointer object pool, NASDAQ ITCH 5.0 parser. cache-line aligned throughout. \u2192 <a class="repo-link" href="https://github.com/StereoSachiiii/backtesting_engine" target="_blank">backtesting_engine</a>' },
            { name: 'CMake', slug: 'cmake', sn: 'Modern build automation with presets for cross-platform C++23 development. \u2192 build automation' },
            { name: 'MSVC', slug: 'microsoftvisualstudio', sn: 'leveraging 128-bit atomics and _InterlockedCompareExchange128 for ABA prevention. \u2192 MSVC intrinsic' },
            { name: 'Valgrind', slug: 'linux', sn: 'profiling the backtesting engine. where the cache misses actually are versus where you think they are. \u2192 <a class="repo-link" href="https://github.com/StereoSachiiii/backtesting_engine" target="_blank">backtesting_engine</a>' },
            { name: 'perf', slug: 'linux', sn: 'Hot-spot identification and micro-architectural analysis on x86. \u2192 kernel profile' },
            { name: 'x86', slug: 'intel', sn: 'Optimized for x86-64 memory model, prioritizing store buffer drain order to minimize write stalls. \u2192 hardware logic' }
        ]
    },
    {
        category: 'When I need a backend fast',
        items: [
            { name: 'FastAPI', slug: 'fastapi', res: 'python', sn: 'RAG pipeline API \u2014 query endpoint, embedding ingestion, provider abstraction. up in an afternoon. \u2192 <a class="repo-link" href="https://github.com/StereoSachiiii/rag-pipeline" target="_blank">rag-pipeline</a>' },
            { name: 'Python', slug: 'python', res: 'python', sn: 'Core language for rapid prototyping and high-level logic orchestration. \u2192 production scripts' },
            { name: 'PostgreSQL', slug: 'postgresql', sn: 'primary database across every project. partial indexes, JSONB, pgvector, denormalized admin views, row-level locking for race conditions. \u2192 <a class="repo-link" href="https://github.com/StereoSachiiii/rag-pipeline" target="_blank">rag-pipeline</a>' }
        ]
    },
    {
        category: 'When I need a UI fast',
        items: [
            { name: 'Next.js', slug: 'nextdotjs', res: 'typescript', sn: 'default UI choice. fitness app and startup-x both ship on it. \u2192 production Vercel' },
            { name: 'TypeScript', slug: 'typescript', res: 'typescript', sn: 'Statically typed development for robust, scaleable frontend architectures. \u2192 type safety' },
            { name: 'React', slug: 'react', res: 'typescript', sn: 'Component-driven UI development with hooks and state management. \u2192 reactive UI' },
            { name: 'Tailwind', slug: 'tailwindcss', sn: 'Utility-first CSS for rapid, maintainable design system implementation. \u2192 design system' }
        ]
    },
    {
        category: 'When I need a SaaS fast',
        items: [
            { name: 'Next.js', slug: 'nextdotjs', res: 'typescript', sn: 'Using full-stack features for rapid iteration and hybrid rendering. \u2192 edge runtime' },
            { name: 'Supabase', slug: 'supabase', sn: 'fitness SaaS \u2014 auth, storage, realtime. next+supabase is my fastest path to a working product. \u2192 postgres-core' }
        ]
    },
    {
        category: 'When I need cloud compute',
        items: [
            { name: 'Docker', slug: 'docker', sn: 'multi-container compose across reservation system and RAG pipeline. EC2 deployment with Nginx reverse proxy and TLS. \u2192 container orchestration' },
            { name: 'AWS EC2', slug: 'amazonaws', sn: 'Reliable infrastructure for deploying containerized services. \u2192 t3.micro' },
            { name: 'GitHub Actions', slug: 'githubactions', sn: 'Automated CI/CD pipelines for testing, building, and automated deployment. \u2192 workflow automation' },
            { name: 'Nginx', slug: 'nginx', sn: 'Reverse proxy configuration, load balancing, and secure SSL termination. \u2192 edge ingress' }
        ]
    },
    {
        category: 'When I need data/ML',
        items: [
            { name: 'pandas', slug: 'pandas', sn: 'Data manipulation and analysis for market feed backtesting. \u2192 vector ops' },
            { name: 'scikit-learn', slug: 'scikitlearn', sn: 'Machine learning implementations for pattern recognition. \u2192 model training' },
            { name: 'matplotlib', slug: 'chartjs', sn: 'Visualization of backtesting results and performance profiles. \u2192 visual proof' },
            { name: 'pgvector', slug: 'postgresql', sn: '384-dimension embeddings with HNSW index for cosine similarity search. \u2192 <a class="repo-link" href="https://github.com/StereoSachiiii/rag-pipeline" target="_blank">rag-pipeline</a>' }
        ]
    },
    {
        category: 'When I built at scale',
        items: [
            { name: 'Spring Boot', slug: 'springboot', sn: 'reservation system \u2014 JWT, Bucket4j, STOMP WebSocket, deployed on t3.micro. \u2192 <a class="repo-link" href="javascript:void(0)" style="cursor:default">reservation_system</a>' },
            { name: 'Java', slug: 'openjdk', sn: 'Enterprise-grade development with emphasis on multithreading and GC tuning. \u2192 JVM tuning' },
            { name: 'TanStack Query', slug: 'reactquery', sn: 'Asynchronous state management for robust data fetching and caching UI. \u2192 async state' },
            { name: 'STOMP/WebSocket', slug: 'socketdotio', sn: 'Real-time bidirectional communication for live reservation updates. \u2192 live sync' },
            { name: 'Bucket4j', slug: 'openjdk', sn: 'Advanced rate limiting and throttling to protect service uptime. \u2192 rate limiter' }
        ]
    },
    {
        category: 'When I go deep on storage',
        items: [
            { name: 'PostgreSQL', slug: 'postgresql', sn: 'Relational consistency with advanced indexing and JSONB storage. \u2192 <a class="repo-link" href="https://github.com/StereoSachiiii/rag-pipeline" target="_blank">rag-pipeline</a>' },
            { name: 'SQLite', slug: 'sqlite', sn: 'Embedded database for local storage and testing portability. \u2192 local store' },
            { name: 'Redis', slug: 'redis', sn: 'High-speed caching and session management for low-latency access. \u2192 distributed cache' },
            { name: 'pgvector', slug: 'postgresql', sn: 'Vector similarity search for retrieval-augmented generation. \u2192 <a class="repo-link" href="https://github.com/StereoSachiiii/rag-pipeline" target="_blank">rag-pipeline</a>' }
        ]
    }
];

// ============================================================
//  DATA FETCHING
// ============================================================

function fetchProjects() {
    return fetch('https://api.github.com/users/' + GITHUB_USER + '/repos?sort=pushed&per_page=30')
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(function (repos) {
            var projects = [];
            FEATURED.forEach(function (name) {
                var repo = repos.find(function (r) { return r.name === name; });
                if (!repo) return;
                var e = ENRICHMENT[name] || {};
                projects.push({
                    id: repo.name,
                    title: e.displayTitle || repo.name.toUpperCase().replace(/-/g, ' '),
                    nouns: e.nouns || (repo.topics && repo.topics.length ? repo.topics.join(' · ') : repo.language || ''),
                    description: e.detailDescription || repo.description || '',
                    decisions: e.decisions || [],
                    github: repo.html_url,
                    screenshot: null,
                    resonance: e.resonance || null,
                    language: repo.language,
                    pushedAt: repo.pushed_at
                });
            });
            return projects.length ? projects : FALLBACK_PROJECTS;
        })
        .catch(function () { return FALLBACK_PROJECTS; });
}

function fetchWriting() {
    var url = 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(MEDIUM_FEED);
    return fetch(url)
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(function (data) {
            if (data.status !== 'ok' || !data.items || !data.items.length) throw new Error('bad rss');
            return data.items.map(function (item) {
                return {
                    id: item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30),
                    title: item.title,
                    url: item.link,
                    date: formatDate(item.pubDate),
                    description: truncate(stripHtml(item.description), 160)
                };
            });
        })
        .catch(function () { return FALLBACK_WRITING; });
}

// ============================================================
//  UI
// ============================================================

document.addEventListener('DOMContentLoaded', function () {
    var contentContainer = document.getElementById('content-container');
    var contentToggle = document.querySelector('.content-toggle');
    var toggleLinks = document.querySelectorAll('.toggle-link');
    var tokens = document.querySelectorAll('.stack-token');
    var isInteractive = false;
    var currentMode = 'projects';
    var inDetailView = false;

    // Start fetching immediately — data ready before user clicks explore
    var portfolioData = { projects: FALLBACK_PROJECTS, writing: FALLBACK_WRITING };
    var dataReady = Promise.all([fetchProjects(), fetchWriting()])
        .then(function (results) {
            portfolioData.projects = results[0];
            portfolioData.writing = results[1];
        });

    // Trigger interactivity immediately
    enterInteractiveState();

    function enterInteractiveState() {
        if (isInteractive) return;
        isInteractive = true;
        document.body.classList.remove('state-arrival');
        document.body.classList.add('state-interactive');
        dataReady.then(function () { renderContent('projects'); });
    }

    // --- List view ---
    function renderContent(mode) {
        inDetailView = false;
        contentToggle.style.display = '';
        contentContainer.innerHTML = '';
        resetResonance();

        if (mode === 'stack') {
            var grid = document.createElement('div');
            grid.className = 'stack-grid';

            var intro = document.createElement('div');
            intro.className = 'stack-intro';
            intro.textContent = 'these are my defaults. everything else is a decision.';
            grid.appendChild(intro);

            STACK_DATA.forEach(function (cat) {
                var group = document.createElement('div');
                group.className = 'stack-group';
                group.innerHTML = '<h3 class="stack-group-title">' + cat.category + '</h3>';

                var list = document.createElement('div');
                list.className = 'stack-list';

                var infoArea = document.createElement('div');
                infoArea.className = 'stack-info-area';
                var sentenceDisplay = document.createElement('p');
                sentenceDisplay.className = 'stack-sentence';
                infoArea.appendChild(sentenceDisplay);

                cat.items.forEach(function (it) {
                    var container = document.createElement('div');
                    container.className = 'stack-item-container';

                    var icon = document.createElement('img');
                    icon.className = 'stack-logo';
                    icon.src = 'https://cdn.simpleicons.org/' + it.slug;
                    icon.alt = it.name;

                    var name = document.createElement('span');
                    name.className = 'stack-item';
                    name.textContent = it.name;

                    container.appendChild(icon);
                    container.appendChild(name);

                    container.addEventListener('mouseenter', function () {
                        if (it.res) setResonance(it.res);
                        sentenceDisplay.innerHTML = '<span class="proof-label">where did i use this? \u2192</span> ' + it.sn;
                        sentenceDisplay.classList.add('active');
                    });
                    container.addEventListener('mouseleave', function () {
                        resetResonance();
                        sentenceDisplay.classList.remove('active');
                    });

                    list.appendChild(container);
                });

                group.appendChild(list);
                group.appendChild(infoArea);
                grid.appendChild(group);
            });

            contentContainer.appendChild(grid);
            return;
        }

        var data = portfolioData[mode];
        if (!data) return;

        data.forEach(function (item) {
            var article = document.createElement('article');
            article.className = (mode === 'projects' ? 'project' : 'writing') + '-item';

            if (mode === 'projects') {
                article.addEventListener('click', function (e) {
                    e.stopPropagation();
                    renderProjectDetail(item);
                });
            }

            if (mode === 'writing' && item.url) {
                article.addEventListener('click', function (e) {
                    e.stopPropagation();
                    window.open(item.url, '_blank');
                });
            }

            var html = '<h2 class="item-title">' + item.title + '</h2>';
            if (item.nouns) html += '<p class="item-nouns">' + item.nouns + '</p>';
            if (item.date) html += '<p class="item-nouns">' + item.date + '</p>';
            if (item.description && mode === 'writing') html += '<p class="item-description">' + item.description + '</p>';
            article.innerHTML = html;

            contentContainer.appendChild(article);
        });
    }

    // --- Detail view ---
    function renderProjectDetail(project) {
        inDetailView = true;
        contentToggle.style.display = 'none';
        contentContainer.innerHTML = '';

        if (project.resonance) setResonance(project.resonance);

        var nav = document.createElement('div');
        nav.className = 'detail-nav';
        nav.innerHTML =
            '<span class="detail-back">\u2190 back</span>' +
            (project.github
                ? '<a href="' + project.github + '" target="_blank" class="detail-github-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.2-.3 2.4 0 3.5-.73 1.05-1.08 2.25-1 3.5 0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>check it out</a>'
                : '');
        nav.querySelector('.detail-back').addEventListener('click', function (e) {
            e.stopPropagation();
            renderContent(currentMode);
        });
        contentContainer.appendChild(nav);

        var visual = document.createElement('div');
        visual.className = 'detail-screenshot';
        visual.innerHTML = project.screenshot
            ? '<img src="' + project.screenshot + '" alt="' + project.title + '">'
            : '<span class="detail-placeholder-text">' + project.title + '</span>';
        contentContainer.appendChild(visual);

        var title = document.createElement('h2');
        title.className = 'item-title';
        title.textContent = project.title;
        contentContainer.appendChild(title);

        if (project.nouns) {
            var nouns = document.createElement('p');
            nouns.className = 'item-nouns';
            nouns.textContent = project.nouns;
            contentContainer.appendChild(nouns);
        }

        if (project.language || project.pushedAt) {
            var meta = document.createElement('p');
            meta.className = 'item-nouns';
            var parts = [];
            if (project.language) parts.push(project.language);
            if (project.pushedAt) parts.push('last pushed ' + formatDate(project.pushedAt));
            meta.textContent = parts.join(' · ');
            contentContainer.appendChild(meta);
        }

        if (project.description) {
            var desc = document.createElement('p');
            desc.className = 'detail-description';
            desc.textContent = project.description;
            contentContainer.appendChild(desc);
        }

        if (project.decisions && project.decisions.length) {
            var decisionsSection = document.createElement('div');
            decisionsSection.className = 'detail-decisions';
            decisionsSection.innerHTML = '<span class="detail-decisions-label">decisions.</span>';
            project.decisions.forEach(function (d) {
                var line = document.createElement('p');
                line.className = 'detail-decision-line';
                line.textContent = '· ' + d;
                decisionsSection.appendChild(line);
            });
            contentContainer.appendChild(decisionsSection);
        }

        if (project.github) {
            var source = document.createElement('a');
            source.className = 'detail-source';
            source.href = project.github;
            source.target = '_blank';
            source.textContent = '\u2192 view source';
            contentContainer.appendChild(source);
        }
    }

    // --- Resonance ---
    function setResonance(targetId) {
        tokens.forEach(function (t) {
            t.classList.toggle('dominant', t.getAttribute('data-target') === targetId);
        });
    }

    function resetResonance() {
        tokens.forEach(function (t) { t.classList.remove('dominant'); });
    }

    // --- Toggle ---
    toggleLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.stopPropagation();
            var mode = link.getAttribute('data-mode');
            if (mode === currentMode && !inDetailView) return;
            currentMode = mode;
            toggleLinks.forEach(function (l) { l.classList.remove('active'); });
            link.classList.add('active');
            renderContent(mode);
        });
    });

    tokens.forEach(function (token) {
        token.addEventListener('click', function (e) {
            e.stopPropagation();
            tokens.forEach(function (t) { t.classList.remove('dominant'); });
            token.classList.add('dominant');
        });
    });
});
