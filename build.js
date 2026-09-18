const fs = require('fs');
const path = require('path');
const { slugify } = require('./slug.js');

const BASE_URL = 'https://unblcked-gg-games.github.io';
const SITE_NAME = 'Unblocked Games GG';

const gamesFile = path.join(__dirname, 'games.json');
const gamesData = JSON.parse(fs.readFileSync(gamesFile, 'utf8'));

const gamesDir = path.join(__dirname, 'games');
if (!fs.existsSync(gamesDir)) {
    fs.mkdirSync(gamesDir, { recursive: true });
}

// Icon mappings for categories
const iconMap = {
    'Action': 'actions.webp', 'Adventure': 'adventure.webp', 'Battle': 'actions.webp',
    'Board': 'board.webp', 'Classic': 'classic.webp', 'Retro': 'classic.webp',
    'Clicker': 'clicker.webp', 'Idle': 'clicker.webp', 'Multiplayer': 'multiplayer.webp',
    'Other': 'other.webp', 'Platformer': 'adventure.webp', 'Puzzle': 'puzzle.webp',
    'Racing': 'racing.webp', 'Shooter': 'actions.webp', 'Skill': 'sport.webp',
    'Sport': 'sport.webp', 'Simulation': 'simulation.webp', 'Rpg': 'rpg.webp',
    'Trivia': 'trivia.webp', 'Girls': 'girls.webp', '3d': '3d.webp', 'All': 'rocket.webp'
};

function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function getFAQs(game) {
    const gameName = game.name;
    const gameType = (game.type || '').toLowerCase();

    const faqs = [
        {
            question: `How do I play ${gameName}?`,
            answer: `${gameName} is easy to play! Simply click on the game above and it will load in your browser. Use your mouse and keyboard to control the game. Each game may have different controls, so look for any on-screen instructions.`
        },
        {
            question: `Is ${gameName} free to play unblocked?`,
            answer: `Yes, ${gameName} is completely free to play unblocked on Unblocked Games GG. No downloads, registrations, or payments are required.`
        },
        {
            question: `Can I play ${gameName} on school or work networks?`,
            answer: `Yes, Unblocked Games GG is optimized to work directly in web browsers on school, work, or restricted networks without requiring installation.`
        },
        {
            question: `Can I play ${gameName} on mobile devices?`,
            answer: `Many games on our site, including ${gameName}, support touch devices and can be played smoothly on phones and tablets.`
        },
        {
            question: `Why won't ${gameName} load?`,
            answer: `If ${gameName} doesn't load immediately, try refreshing your page, checking your internet connection, or disabling ad-blockers that might block the game frame.`
        }
    ];

    if (gameType.includes('racing') || gameType.includes('car')) {
        faqs.push({
            question: `What are the controls for ${gameName}?`,
            answer: `Most racing games use arrow keys or WASD for steering, braking, and acceleration. Check for on-screen controls when the game loads.`
        });
    } else if (gameType.includes('puzzle')) {
        faqs.push({
            question: `How do I solve levels in ${gameName}?`,
            answer: `Puzzle games require logical thinking and strategy. Take your time to analyze each level and experiment with different moves.`
        });
    } else if (gameType.includes('action') || gameType.includes('shooter')) {
        faqs.push({
            question: `What are the controls for ${gameName}?`,
            answer: `Action and shooter games typically use WASD or arrow keys for movement, mouse for aiming, and mouse clicks or spacebar to attack.`
        });
    } else if (gameType.includes('platformer')) {
        faqs.push({
            question: `How do I jump and move in ${gameName}?`,
            answer: `Platformer games usually use arrow keys or WASD for running and spacebar or up-arrow for jumping. Watch out for double jumps!`
        });
    }

    return faqs;
}

// Generate category list HTML
const allCategories = [...new Set(gamesData.map(g => g.type).filter(Boolean).map(t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()))].sort();

function renderCategorySidebar(activeCategory) {
    let html = '<li><a href="../../index.html"><img class="category-icon" src="../../icons/rocket.webp" alt="All icon">All</a></li>\n';
    html += '<li><a href="../../favorites.html"><span class="category-icon" style="display:inline-flex;align-items:center;justify-content:center;">❤️</span>Favorites</a></li>\n';
    
    allCategories.forEach(cat => {
        const iconFile = iconMap[cat] || 'other.webp';
        const isActive = activeCategory && activeCategory.toLowerCase() === cat.toLowerCase();
        html += `<li class="${isActive ? 'active' : ''}"><a href="../../index.html?category=${encodeURIComponent(cat)}"><img class="category-icon" src="../../icons/${iconFile}" alt="${escapeHtml(cat)} icon">${escapeHtml(cat)}</a></li>\n`;
    });
    return html;
}

function renderRelatedGames(currentGame) {
    const sameType = gamesData.filter(g => g.name !== currentGame.name && g.type && g.type.toLowerCase() === (currentGame.type || '').toLowerCase());
    const others = gamesData.filter(g => g.name !== currentGame.name && (!g.type || g.type.toLowerCase() !== (currentGame.type || '').toLowerCase()));
    const related = [...sameType, ...others].slice(0, 6);

    return related.map(game => {
        const slug = slugify(game.name);
        return `
            <a href="../${slug}/" class="game-card" style="text-decoration:none;color:inherit;">
                <img src="../../${escapeHtml(game.image)}" alt="${escapeHtml(game.name)}" loading="lazy" decoding="async" width="150" height="150" onerror="this.src='../../icons/fav.png'">
                <h3>${escapeHtml(game.name)}</h3>
            </a>
        `;
    }).join('\n');
}

console.log(`Starting static generation for ${gamesData.length} games...`);

const generatedSlugs = new Set();

gamesData.forEach((game, index) => {
    let slug = slugify(game.name);
    if (generatedSlugs.has(slug)) {
        slug = `${slug}-${index + 1}`;
    }
    generatedSlugs.add(slug);

    const gameDir = path.join(gamesDir, slug);
    if (!fs.existsSync(gameDir)) {
        fs.mkdirSync(gameDir, { recursive: true });
    }

    const title = `${game.name} - Unblocked gg`;
    let description = game.description 
        ? game.description.trim() 
        : `Play ${game.name} unblocked for free. Instant ${game.type || 'browser'} game online with no downloads.`;
    if (description.length > 160) {
        description = description.slice(0, 157).trim() + '...';
    }
    const keywords = `${game.name}, play ${game.name} unblocked, ${game.name} online, ${game.type} games unblocked, free online games, unblocked games gg`;
    const canonicalUrl = `${BASE_URL}/games/${slug}/`;
    
    // Resolve image URL
    const isLocalImage = game.image && !game.image.startsWith('http');
    const imageUrl = isLocalImage ? `${BASE_URL}/${game.image}` : (game.image || `${BASE_URL}/icons/UNBLOCKED-GAMES-GG.png`);

    // Resolve iframe URL (from /games/<slug>/index.html, local project requires ../../)
    let iframeSrc = game.url;
    if (game.url && !game.url.startsWith('http') && !game.url.startsWith('//')) {
        iframeSrc = `../../${game.url.replace(/^\/+/, '')}`;
    }

    const faqs = getFAQs(game);
    const categoryName = game.type ? (game.type.charAt(0).toUpperCase() + game.type.slice(1).toLowerCase()) : 'General';

    // JSON-LD Schemas
    const schemaData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebSite",
                "@id": `${BASE_URL}/#website`,
                "url": `${BASE_URL}/`,
                "name": SITE_NAME,
                "description": "Play hundreds of free unblocked games online at school or work."
            },
            {
                "@type": "VideoGame",
                "@id": `${canonicalUrl}#game`,
                "name": game.name,
                "description": game.description || description,
                "genre": [categoryName, "Unblocked Games"],
                "url": canonicalUrl,
                "image": imageUrl,
                "playMode": "SinglePlayer",
                "applicationCategory": "Game",
                "operatingSystem": "Any browser"
            },
            {
                "@type": "BreadcrumbList",
                "@id": `${canonicalUrl}#breadcrumb`,
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": `${BASE_URL}/`
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": `${categoryName} Games`,
                        "item": `${BASE_URL}/?category=${encodeURIComponent(categoryName)}`
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": game.name,
                        "item": canonicalUrl
                    }
                ]
            },
            {
                "@type": "FAQPage",
                "@id": `${canonicalUrl}#faq`,
                "mainEntity": faqs.map(faq => ({
                    "@type": "Question",
                    "name": faq.question,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": faq.answer
                    }
                }))
            }
        ]
    };

    const faqsHtml = faqs.map(faq => `
        <div class="faq-item">
            <h3 class="faq-question">${escapeHtml(faq.question)}</h3>
            <p class="faq-answer">${escapeHtml(faq.answer)}</p>
        </div>
    `).join('\n');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <meta name="keywords" content="${escapeHtml(keywords)}">
    <meta name="author" content="${SITE_NAME}">
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
    <meta name="googlebot" content="index, follow">
    <meta name="bingbot" content="index, follow">
    
    <!-- Search Engine Verification -->
    <meta name="msvalidate.01" content="9D16E596AD3A0F95BC6DE3E03A96BAC0" />
    <meta name="yandex-verification" content="ebfb372ffce7edb2" />
    
    <!-- Canonical URL -->
    <link rel="canonical" href="${canonicalUrl}">
    
    <!-- Theme & App Tags -->
    <meta name="theme-color" content="#2ea043">
    <meta name="msapplication-TileColor" content="#2ea043">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="${SITE_NAME}">
    <meta name="language" content="English">
    <meta name="content-language" content="en-US">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:site_name" content="${SITE_NAME}">
    <meta property="og:locale" content="en_US">

    <!-- Twitter Cards -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="${canonicalUrl}">
    <meta property="twitter:title" content="${escapeHtml(title)}">
    <meta property="twitter:description" content="${escapeHtml(description)}">
    <meta property="twitter:image" content="${imageUrl}">
    
    <!-- Preload & Prefetch -->
    <link rel="preload" href="../../style.css" as="style">
    <link rel="dns-prefetch" href="//cdn.statically.io">
    <link rel="dns-prefetch" href="//files.catbox.moe">
    
    <link rel="stylesheet" href="../../style.css">
    <link rel="icon" href="../../icons/fav.png" type="image/png">
    
    <!-- JSON-LD Structured Data for SEO -->
    <script type="application/ld+json">
    ${JSON.stringify(schemaData, null, 2)}
    </script>
</head>
<body>
    <header>
        <div class="header-content">
            <a href="../../index.html" class="logo-link">
                <img src="../../icons/UNBLOCKED-GAMES-GG.png" alt="Unblocked Games GG Logo" class="logo-img">
            </a>
            <nav class="header-nav">
                <a href="../../index.html">Home</a>
                <a href="../../favorites.html">Favorites</a>
                <a href="../../legal.html">Legal</a>
                <div id="header-actions"></div>
            </nav>
        </div>
    </header>

    <div class="container">
        <aside class="sidebar">
            <nav>
                <h2>Categories</h2>
                <ul id="categories">
                    ${renderCategorySidebar(game.type)}
                </ul>
            </nav>
        </aside>
        <main class="main-content">
            <div class="game-container">
                <h1 id="game-title">${escapeHtml(game.name)}</h1>
                
                <!-- Breadcrumb Navigation -->
                <nav class="breadcrumb" aria-label="Breadcrumb">
                    <a href="../../index.html">Home</a>
                    <span class="breadcrumb-separator">&gt;</span>
                    <a href="../../index.html?category=${encodeURIComponent(categoryName)}" id="breadcrumb-category">${escapeHtml(categoryName)} Games</a>
                    <span class="breadcrumb-separator">&gt;</span>
                    <span id="breadcrumb-game">${escapeHtml(game.name)}</span>
                </nav>
                
                <div class="game-frame-container">
                    <iframe id="game-frame" src="${escapeHtml(iframeSrc)}" allowfullscreen loading="lazy" title="${escapeHtml(game.name)} game window"></iframe>
                </div>
                <div class="game-actions">
                    <button id="fullscreen-btn" class="action-btn" aria-label="Toggle Fullscreen">⛶ Fullscreen</button>
                    <button id="favorite-btn" class="action-btn" data-game-name="${escapeHtml(game.name)}" aria-label="Add to favorites">
                        <span id="favorite-icon">♡</span> Favorite
                    </button>
                    <div class="action-btn rating-container" data-game-name="${escapeHtml(game.name)}">
                        <span>Rate:</span>
                        <div class="stars">
                            <span class="star" data-rating="1">★</span>
                            <span class="star" data-rating="2">★</span>
                            <span class="star" data-rating="3">★</span>
                            <span class="star" data-rating="4">★</span>
                            <span class="star" data-rating="5">★</span>
                        </div>
                        <span class="rating-text" id="rating-text">(0)</span>
                    </div>
                </div>
                <div class="game-description-container">
                    <h2>About ${escapeHtml(game.name)}</h2>
                    <p id="game-description">${escapeHtml(game.description || `Play ${game.name} unblocked for free. An exciting ${game.type || 'browser'} game available instantly on Unblocked Games GG.`)}</p>
                </div>
            </div>
            
            <!-- Game-specific FAQ Section -->
            <section class="faq-section game-faq">
                <h2>${escapeHtml(game.name)} FAQ</h2>
                <div class="faq-container" id="game-faq-container">
                    ${faqsHtml}
                </div>
            </section>
            
            <div class="related-games-container">
                <h2>Related Games</h2>
                <div class="games-grid" id="related-games-grid">
                    ${renderRelatedGames(game)}
                </div>
            </div>
        </main>
    </div>

    <footer>
        <div class="footer-content">
            <div class="footer-section">
                <h3>Popular Categories</h3>
                <ul class="footer-links">
                    <li><a href="../../index.html?category=Action">Action Games</a></li>
                    <li><a href="../../index.html?category=Racing">Racing Games</a></li>
                    <li><a href="../../index.html?category=Puzzle">Puzzle Games</a></li>
                    <li><a href="../../index.html?category=Platformer">Platformer Games</a></li>
                    <li><a href="https://crazygg.com">Crazy Games</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h3>Game Types</h3>
                <ul class="footer-links">
                    <li><a href="https://gamegeometrydash.com">Geometry Dash Games</a></li>
                    <li><a href="../../index.html?category=Shooter">Shooter Games</a></li>
                    <li><a href="../../index.html?category=Skill">Skill Games</a></li>
                    <li><a href="../../index.html?category=Idle">Idle Games</a></li>
                    <li><a href="https://crazygg.com">Crazy Games</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h3>Help & Info</h3>
                <ul class="footer-links">
                    <li><a href="../../index.html#faq">FAQ</a></li>
                    <li><a href="../../racing-games-faq.html">Racing Games FAQ</a></li>
                    <li><a href="../../favorites.html">❤️ My Favorites</a></li>
                    <li><a href="../../legal.html">Terms & Privacy</a></li>
                    <li><a href="../../index.html">All Games</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h3>About Unblocked Games GG</h3>
                <p>Your ultimate destination for free online gaming. Play hundreds of unblocked games instantly in your browser - no downloads required!</p>
                <p class="footer-contact">Contact: contact@unblocked-gg-games.github.io</p>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2025 Unblocked Games GG. All rights reserved.</p>
            <p>Play free unblocked games online - Always updated, always fun!</p>
        </div>
    </footer>

    <script src="../../static-game.js"></script>
</body>
</html>
`;

    fs.writeFileSync(path.join(gameDir, 'index.html'), html, 'utf8');
});

console.log(`Generated ${generatedSlugs.size} static game pages in /games/ directory.`);

// Generate updated sitemap.xml
const today = new Date().toISOString().split('T')[0];
let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${BASE_URL}/favorites.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/legal.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${BASE_URL}/racing-games-faq.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;

generatedSlugs.forEach(slug => {
    sitemapContent += `  <url>
    <loc>${BASE_URL}/games/${slug}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
});

sitemapContent += `</urlset>\n`;
fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemapContent, 'utf8');
console.log(`Regenerated sitemap.xml with ${generatedSlugs.size + 4} total URLs.`);
