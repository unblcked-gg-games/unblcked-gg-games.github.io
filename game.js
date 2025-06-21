document.addEventListener('DOMContentLoaded', () => {
    const gamesUrl = 'games.json';

    // DOM Elements
    const gameTitle = document.getElementById('game-title');
    const gameFrame = document.getElementById('game-frame');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const favoriteBtn = document.getElementById('favorite-btn');
    const favoriteIcon = document.getElementById('favorite-icon');
    const gameDescription = document.getElementById('game-description');
    const relatedGamesGrid = document.getElementById('related-games-grid');
    const categoriesList = document.getElementById('categories');
    const breadcrumbCategory = document.getElementById('breadcrumb-category');
    const breadcrumbGame = document.getElementById('breadcrumb-game');
    const gameFaqContainer = document.getElementById('game-faq-container');
    const stars = document.querySelectorAll('.star');
    const ratingText = document.getElementById('rating-text');

    // Get game name from URL
    const urlParams = new URLSearchParams(window.location.search);
    const gameName = urlParams.get('name');

    if (!gameName) {
        if(gameTitle) gameTitle.textContent = "No game specified.";
        return;
    }

    // Show loading state
    if(gameTitle) gameTitle.textContent = "Loading...";
    if(gameDescription) gameDescription.textContent = "Loading game information...";

    fetch(gamesUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(games => {
            const allGames = games;

            // Extract all unique categories
            const allCategories = [...new Set(games.map(game => game.type).filter(Boolean).map(type => type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()))];
            
            const currentGame = allGames.find(game => game.name === gameName);

            if (currentGame) {
                // Update page with game details
                updatePageSEO(currentGame);
                if(gameTitle) gameTitle.textContent = currentGame.name;
                if(gameFrame) {
                    gameFrame.src = currentGame.url;
                    gameFrame.loading = 'lazy'; // Lazy load iframe
                }
                if(gameDescription) gameDescription.textContent = currentGame.description || 'No description available for this game.';
                
                // Update breadcrumbs
                updateBreadcrumbs(currentGame);
                
                // Populate UI components
                populateCategories(allCategories, currentGame);
                displayRelatedGames(allGames, currentGame);
                
                // Generate game-specific FAQs
                generateGameFAQs(currentGame);
                
                // Update FAQ schema
                updateFAQSchema(currentGame);

            } else {
                if(gameTitle) gameTitle.textContent = "Game not found";
                if(gameDescription) gameDescription.textContent = `Sorry, we couldn't find a game with the name "${gameName}".`;
                // Update page title for 404 case
                document.title = "Game Not Found - Unblocked Games GG";
            }
        })
        .catch(error => {
            console.error('Error fetching or processing games:', error);
            if(gameTitle) gameTitle.textContent = "Error loading game data";
            if(gameDescription) gameDescription.textContent = "There was a problem loading the game data. Please try again later.";
        });

    // Enhanced SEO meta tag updates
    function updatePageSEO(game) {
        const title = `Play ${game.name} - Free Online Game | Unblocked Games GG`;
        const description = game.description || `Play ${game.name} for free online. ${game.type} game available instantly in your browser - no downloads required!`;
        
        document.title = title;
        
        // Update or create meta description
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.name = 'description';
            document.head.appendChild(metaDesc);
        }
        metaDesc.content = description;
        
        // Update or create canonical URL
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.rel = 'canonical';
            document.head.appendChild(canonical);
        }
        canonical.href = `https://unblocked-gg-games.github.io/game.html?name=${encodeURIComponent(game.name)}`;
        
        // Add Open Graph tags
        updateOpenGraphTags(game, title, description);
    }
    
    function updateOpenGraphTags(game, title, description) {
        const gameUrl = `https://unblocked-gg-games.github.io/game.html?name=${encodeURIComponent(game.name)}`;
        const gameImage = game.image ? `https://unblocked-gg-games.github.io/${game.image}` : 'https://unblocked-gg-games.github.io/icons/UNBLOCKED-GAMES-GG.png';
        
        const ogTags = [
            { property: 'og:title', content: title },
            { property: 'og:description', content: description },
            { property: 'og:type', content: 'website' },
            { property: 'og:url', content: gameUrl },
            { property: 'og:image', content: gameImage },
            { property: 'og:image:width', content: '1200' },
            { property: 'og:image:height', content: '630' },
            { property: 'og:site_name', content: 'Unblocked Games GG' },
            { property: 'og:locale', content: 'en_US' }
        ];
        
        // Twitter Cards
        const twitterTags = [
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:title', content: title },
            { name: 'twitter:description', content: description },
            { name: 'twitter:image', content: gameImage },
            { name: 'twitter:url', content: gameUrl }
        ];
        
        // Update Open Graph tags
        ogTags.forEach(tag => {
            let metaTag = document.querySelector(`meta[property="${tag.property}"]`);
            if (!metaTag) {
                metaTag = document.createElement('meta');
                metaTag.setAttribute('property', tag.property);
                document.head.appendChild(metaTag);
            }
            metaTag.content = tag.content;
        });
        
        // Update Twitter tags
        twitterTags.forEach(tag => {
            let metaTag = document.querySelector(`meta[name="${tag.name}"], meta[property="${tag.name}"]`);
            if (!metaTag) {
                metaTag = document.createElement('meta');
                metaTag.setAttribute('property', tag.name);
                document.head.appendChild(metaTag);
            }
            metaTag.content = tag.content;
        });
        
        // Update keywords meta tag
        const keywords = `${game.name}, ${game.type} games, unblocked games, free games, online games, browser games, play ${game.name} online`;
        let keywordsMeta = document.querySelector('meta[name="keywords"]');
        if (!keywordsMeta) {
            keywordsMeta = document.createElement('meta');
            keywordsMeta.name = 'keywords';
            document.head.appendChild(keywordsMeta);
        }
        keywordsMeta.content = keywords;
    }

    // Fullscreen functionality with better error handling
    if(fullscreenBtn) {
        fullscreenBtn.addEventListener('click', () => {
            if (!gameFrame) return;
            
            try {
                if (gameFrame.requestFullscreen) {
                    gameFrame.requestFullscreen();
                } else if (gameFrame.mozRequestFullScreen) { /* Firefox */
                    gameFrame.mozRequestFullScreen();
                } else if (gameFrame.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
                    gameFrame.webkitRequestFullscreen();
                } else if (gameFrame.msRequestFullscreen) { /* IE/Edge */
                    gameFrame.msRequestFullscreen();
                }
            } catch (error) {
                console.warn('Fullscreen not supported or failed:', error);
            }
        });
    }

    // Initialize rating and favorite functionality
    initializeGameActions();

    function initializeGameActions() {
        // Initialize favorites
        if (favoriteBtn && favoriteIcon) {
            const favorites = getFavorites();
            const isFavorite = favorites.includes(gameName);
            updateFavoriteButton(isFavorite);

            favoriteBtn.addEventListener('click', () => {
                toggleFavorite(gameName);
            });
        }

        // Initialize rating
        if (stars.length > 0) {
            const currentRating = getRating(gameName);
            updateRatingDisplay(currentRating);

            stars.forEach(star => {
                star.addEventListener('click', () => {
                    const rating = parseInt(star.dataset.rating);
                    setRating(gameName, rating);
                    updateRatingDisplay(rating);
                });

                star.addEventListener('mouseenter', () => {
                    const rating = parseInt(star.dataset.rating);
                    highlightStars(rating);
                });
            });

            // Reset stars on mouse leave
            const ratingContainer = document.querySelector('.rating-container');
            if (ratingContainer) {
                ratingContainer.addEventListener('mouseleave', () => {
                    const currentRating = getRating(gameName);
                    updateRatingDisplay(currentRating);
                });
            }
        }
    }

    // Favorites functionality
    function getFavorites() {
        const favorites = localStorage.getItem('unblocked-games-favorites');
        return favorites ? JSON.parse(favorites) : [];
    }

    function toggleFavorite(gameNameToToggle) {
        const favorites = getFavorites();
        const index = favorites.indexOf(gameNameToToggle);
        
        if (index > -1) {
            favorites.splice(index, 1);
            updateFavoriteButton(false);
        } else {
            favorites.push(gameNameToToggle);
            updateFavoriteButton(true);
        }
        
        localStorage.setItem('unblocked-games-favorites', JSON.stringify(favorites));
    }

    function updateFavoriteButton(isFavorite) {
        if (favoriteIcon && favoriteBtn) {
            if (isFavorite) {
                favoriteIcon.textContent = '♥';
                favoriteBtn.classList.add('active');
            } else {
                favoriteIcon.textContent = '♡';
                favoriteBtn.classList.remove('active');
            }
        }
    }

    // Rating functionality
    function getRating(gameNameToRate) {
        const ratings = JSON.parse(localStorage.getItem('unblocked-games-ratings') || '{}');
        return ratings[gameNameToRate] || 0;
    }

    function setRating(gameNameToRate, rating) {
        const ratings = JSON.parse(localStorage.getItem('unblocked-games-ratings') || '{}');
        ratings[gameNameToRate] = rating;
        localStorage.setItem('unblocked-games-ratings', JSON.stringify(ratings));
    }

    function updateRatingDisplay(rating) {
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
        
        if (ratingText) {
            ratingText.textContent = rating > 0 ? `(${rating}/5)` : '(0)';
        }
    }

    function highlightStars(rating) {
        stars.forEach((star, index) => {
            if (index < rating) {
                star.style.color = '#ffd700';
            } else {
                star.style.color = '#ddd';
            }
        });
    }

    function updateBreadcrumbs(game) {
        if (breadcrumbCategory && breadcrumbGame) {
            const categoryName = game.type.charAt(0).toUpperCase() + game.type.slice(1).toLowerCase();
            breadcrumbCategory.textContent = categoryName + ' Games';
            breadcrumbGame.textContent = game.name;
        }
    }

    function generateGameFAQs(game) {
        if (!gameFaqContainer) return;
        
        const gameType = game.type.toLowerCase();
        const gameName = game.name;
        
        // Generate game-specific FAQs based on game type and general gaming questions
        const faqs = [
            {
                question: `How do I play ${gameName}?`,
                answer: `${gameName} is easy to play! Simply click on the game above and it will load in your browser. Use your mouse and keyboard to control the game. Each game may have different controls, so look for any on-screen instructions.`
            },
            {
                question: `Is ${gameName} free to play?`,
                answer: `Yes, ${gameName} is completely free to play on Unblocked Games GG. No downloads, registrations, or payments required.`
            },
            {
                question: `Can I play ${gameName} on my mobile device?`,
                answer: `Many of our games, including ${gameName}, are mobile-friendly. Try playing it on your smartphone or tablet through your mobile browser.`
            },
            {
                question: `Why won't ${gameName} load?`,
                answer: `If ${gameName} isn't loading, try refreshing the page, checking your internet connection, or trying a different browser. Some games may take a moment to load completely.`
            }
        ];

        // Add game-type specific FAQs
        if (gameType.includes('racing') || gameType.includes('car')) {
            faqs.push({
                question: `What are the controls for this racing game?`,
                answer: `Most racing games use arrow keys or WASD for steering and acceleration. Some games may use the mouse for steering. Check for control instructions when the game loads.`
            });
        } else if (gameType.includes('puzzle')) {
            faqs.push({
                question: `How do I solve the puzzles in this game?`,
                answer: `Puzzle games require logical thinking and strategy. Take your time to analyze each level and don't be afraid to experiment with different approaches.`
            });
        } else if (gameType.includes('action') || gameType.includes('shooter')) {
            faqs.push({
                question: `What are the controls for this action game?`,
                answer: `Action games typically use WASD or arrow keys for movement, mouse for aiming, and spacebar or mouse clicks for actions. Check the game's instruction screen for specific controls.`
            });
        } else if (gameType.includes('platformer')) {
            faqs.push({
                question: `How do I jump and move in this platformer?`,
                answer: `Most platformer games use arrow keys or WASD for movement and spacebar or up arrow for jumping. Some games may have double-jump or special movement abilities.`
            });
        }

        // Render FAQs
        gameFaqContainer.innerHTML = '';
        faqs.forEach(faq => {
            const faqItem = document.createElement('div');
            faqItem.className = 'faq-item';
            faqItem.innerHTML = `
                <h3 class="faq-question">${faq.question}</h3>
                <p class="faq-answer">${faq.answer}</p>
            `;
            gameFaqContainer.appendChild(faqItem);
        });
    }

    function updateFAQSchema(game) {
        const schemaElement = document.getElementById('game-faq-schema');
        if (!schemaElement) return;

        const gameName = game.name;
        const gameType = game.type.toLowerCase();

        const schemaData = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": `How do I play ${gameName}?`,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": `${gameName} is easy to play! Simply click on the game above and it will load in your browser. Use your mouse and keyboard to control the game.`
                    }
                },
                {
                    "@type": "Question",
                    "name": `Is ${gameName} free to play?`,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": `Yes, ${gameName} is completely free to play on Unblocked Games GG. No downloads, registrations, or payments required.`
                    }
                },
                {
                    "@type": "Question",
                    "name": `Can I play ${gameName} on my mobile device?`,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": `Many of our games, including ${gameName}, are mobile-friendly and can be played on smartphones and tablets.`
                    }
                },
                {
                    "@type": "Question",
                    "name": `Why won't ${gameName} load?`,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": `If ${gameName} isn't loading, try refreshing the page, checking your internet connection, or trying a different browser.`
                    }
                }
            ]
        };

        schemaElement.textContent = JSON.stringify(schemaData, null, 2);
    }

    function populateCategories(categories, currentGame) {
        if (!categoriesList) return;
        categoriesList.innerHTML = ''; 

        const iconMap = {
            'Action': 'actions.webp', 'Adventure': 'adventure.webp', 'Battle': 'actions.webp',
            'Board': 'board.webp', 'Classic': 'classic.webp', 'Retro': 'classic.webp',
            'Clicker': 'clicker.webp', 'Idle': 'clicker.webp', 'Multiplayer': 'multiplayer.webp',
            'Other': 'other.webp', 'Platformer': 'adventure.webp', 'Puzzle': 'puzzle.webp',
            'Racing': 'racing.webp', 'Shooter': 'actions.webp', 'Skill': 'sport.webp',
            'Sport': 'sport.webp', 'Simulation': 'simulation.webp', 'Rpg': 'rpg.webp',
            'Trivia': 'trivia.webp', 'Girls': 'girls.webp', '3d': '3d.webp', 'All': 'rocket.webp'
        };
        
        const createCategoryItem = (categoryName, isAllCategory = false) => {
            const li = document.createElement('li');
            const icon = document.createElement('img');
            icon.className = 'category-icon';
            
            const normalizedCategory = categoryName.charAt(0).toUpperCase() + categoryName.slice(1).toLowerCase();
            const iconFile = iconMap[normalizedCategory] || normalizedCategory.toLowerCase().replace(/\s+/g, '-') + '.webp';
            icon.src = `icons/${iconFile}`;
            icon.alt = `${categoryName} icon`;
            // Remove lazy loading for above-the-fold category icons
            icon.onerror = () => { icon.src = 'icons/other.webp'; };
            
            li.appendChild(icon);
            li.append(categoryName);
            
            if (!isAllCategory && currentGame && normalizedCategory === (currentGame.type.charAt(0).toUpperCase() + currentGame.type.slice(1).toLowerCase())) {
                li.classList.add('active');
            }

            li.addEventListener('click', () => {
                const destination = isAllCategory ? 'index.html' : `index.html?category=${encodeURIComponent(categoryName)}`;
                window.location.href = destination;
            });
            return li;
        };

        categoriesList.appendChild(createCategoryItem('All', true));
        
        // Add Favorites category
        const favLi = document.createElement('li');
        favLi.className = 'favorites-category';
        const favIcon = document.createElement('img');
        favIcon.className = 'category-icon';
        favIcon.src = 'icons/like.png';
        favIcon.alt = 'Favorites icon';
        favLi.appendChild(favIcon);
        favLi.append('Favorites');
        favLi.addEventListener('click', () => {
            window.location.href = 'favorites.html';
        });
        categoriesList.appendChild(favLi);
        
        categories.sort().forEach(category => categoriesList.appendChild(createCategoryItem(category)));
    }

    function displayRelatedGames(allGames, currentGame) {
        if (!relatedGamesGrid) return;
        relatedGamesGrid.innerHTML = '';
        
        const related = allGames.filter(game => 
            game.type.toLowerCase() === currentGame.type.toLowerCase() && 
            game.name !== currentGame.name
        );
        
        const shuffled = related.sort(() => 0.5 - Math.random());
        const gamesToDisplay = shuffled.slice(0, 18);

        if (gamesToDisplay.length === 0) {
            relatedGamesGrid.innerHTML = '<p class="no-games-found">No related games found.</p>';
            return;
        }

        gamesToDisplay.forEach(game => {
            relatedGamesGrid.appendChild(createGameCard(game));
        });
    }

    function createGameCard(game) {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.addEventListener('click', () => {
            window.location.href = `game.html?name=${encodeURIComponent(game.name)}`;
        });

        const img = document.createElement('img');
        img.src = game.image;
        img.alt = game.name;
        img.loading = 'lazy'; // Add lazy loading for performance
        img.decoding = 'async'; // Async image decoding
        img.width = 150; // Explicit dimensions for CLS
        img.height = 150;
        img.onerror = () => { img.src = 'icons/fav.png'; };

        const title = document.createElement('h3');
        title.textContent = game.name;

        card.appendChild(img);
        card.appendChild(title);
        return card;
    }
});
