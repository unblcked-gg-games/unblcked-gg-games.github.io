document.addEventListener('DOMContentLoaded', () => {
    const gamesUrl = 'games.json';
    const newGamesGrid = document.getElementById('new-games-grid');
    const popularGamesGrid = document.getElementById('popular-games-grid');
    const categoriesList = document.getElementById('categories');
    const searchBar = document.getElementById('search-bar');
    let allGames = [];
    let allCategories = new Set();

    // Show loading indicator
    if (newGamesGrid) {
        newGamesGrid.innerHTML = '<div class="loading-indicator">Loading games...</div>';
    }

    fetch(gamesUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(games => {
            allGames = games;
            // Extract all unique categories
            games.forEach(game => {
                if(game.type) {
                    // Capitalize first letter
                    const category = game.type.charAt(0).toUpperCase() + game.type.slice(1).toLowerCase();
                    allCategories.add(category);
                }
            });
            
            const sortedCategories = [...allCategories].sort();
            
            populateCategories(allGames, sortedCategories);

            // Check for category in URL to filter on load
            const urlParams = new URLSearchParams(window.location.search);
            const categoryParam = urlParams.get('category');

            if (categoryParam) {
                // Filter games based on URL param
                displayGames(allGames, categoryParam);

                // Update active state in sidebar
                document.querySelector('#categories .active')?.classList.remove('active');
                const categoryItems = categoriesList.querySelectorAll('li');
                const targetLi = Array.from(categoryItems).find(li => {
                    // Find the text node directly to avoid reading text from child elements like the icon's alt text
                    const textNode = Array.from(li.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
                    return textNode && textNode.textContent.trim().toLowerCase() === categoryParam.toLowerCase();
                });
                if (targetLi) {
                    targetLi.classList.add('active');
                }
            } else {
                // Default view: display all games
                displayGames(allGames);
            }
        })
        .catch(error => {
            console.error('Error fetching games:', error);
            if (newGamesGrid) {
                newGamesGrid.innerHTML = '<div class="error-message">Failed to load games. Please refresh the page.</div>';
            }
        });

    function populateCategories(games, allCategories) {
        const categoriesList = document.getElementById('categories');
        if (!categoriesList) return;
        categoriesList.innerHTML = ''; // Clear existing categories

        const iconMap = {
            'Action': 'actions.webp',
            'Adventure': 'adventure.webp',
            'Battle': 'actions.webp',
            'Board': 'board.webp',
            'Classic': 'classic.webp',
            'Retro': 'classic.webp',
            'Clicker': 'clicker.webp',
            'Idle': 'clicker.webp',
            'Multiplayer': 'multiplayer.webp',
            'Other': 'other.webp',
            'Platformer': 'adventure.webp',
            'Puzzle': 'puzzle.webp',
            'Racing': 'racing.webp',
            'Shooter': 'actions.webp',
            'Skill': 'sport.webp',
            'Sport': 'sport.webp',
            'Simulation': 'simulation.webp',
            'Rpg': 'rpg.webp',
            'Trivia': 'trivia.webp',
            'Girls': 'girls.webp',
            '3d': '3d.webp',
            'All': 'rocket.webp'
        };

        // Add 'All' category first
        const allLi = document.createElement('li');
        allLi.className = 'active';
        const allIcon = document.createElement('img');
        allIcon.className = 'category-icon';
        allIcon.src = `icons/${iconMap['All'] || 'other.webp'}`;
        allIcon.alt = 'All icon';
        // Remove lazy loading for above-the-fold category icons
        allLi.appendChild(allIcon);
        allLi.append('All');
        allLi.addEventListener('click', () => {
            document.querySelector('#categories .active')?.classList.remove('active');
            allLi.classList.add('active');
            displayGames(games, 'all');
        });
        categoriesList.appendChild(allLi);

        // Add 'Favorites' category
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

        allCategories.forEach(category => {
            const li = document.createElement('li');

            const icon = document.createElement('img');
            icon.className = 'category-icon';
            icon.src = `icons/${iconMap[category] || category.toLowerCase() + '.webp' || 'other.webp'}`;
            icon.alt = `${category} icon`;
            // Remove lazy loading for above-the-fold category icons
            li.appendChild(icon);
            li.append(category);

            li.addEventListener('click', () => {
                document.querySelector('#categories .active')?.classList.remove('active');
                li.classList.add('active');
                displayGames(games, category);
            });
            categoriesList.appendChild(li);
        });
    }
    
    function displayGames(games, filter = 'all') {
        const newGamesGrid = document.getElementById('new-games-grid');
        const popularGamesGrid = document.getElementById('popular-games-grid');
        const newGamesSection = document.getElementById('new-games');
        const popularGamesSection = document.getElementById('popular-games');
        
        if (!newGamesGrid || !popularGamesGrid || !newGamesSection || !popularGamesSection) return;
        
        const newGamesTitle = newGamesSection.querySelector('h2');
        const popularGamesTitle = popularGamesSection.querySelector('h2');

        newGamesGrid.innerHTML = '';
        popularGamesGrid.innerHTML = '';

        const searchTerm = searchBar?.value.toLowerCase() || '';
        let displayedGames = games;
        let isFilteredOrSearched = false;

        if (filter && filter.toLowerCase() !== 'all') {
            displayedGames = displayedGames.filter(game => game.type.toLowerCase() === filter.toLowerCase());
            isFilteredOrSearched = true;
        }

        if (searchTerm) {
            displayedGames = displayedGames.filter(game => game.name.toLowerCase().includes(searchTerm));
            isFilteredOrSearched = true;
        }

        if (isFilteredOrSearched) {
            popularGamesSection.style.display = 'none';

            if (searchTerm) {
                newGamesTitle.textContent = `Search Results for "${searchTerm}"`;
            } else {
                const categoryName = filter.charAt(0).toUpperCase() + filter.slice(1);
                newGamesTitle.textContent = `${categoryName} Games`;
            }

            if (displayedGames.length === 0) {
                newGamesGrid.innerHTML = '<p class="no-games-found">No games found. Try another category or search term.</p>';
            } else {
                displayedGames.forEach(game => {
                    newGamesGrid.appendChild(createGameCard(game));
                });
            }
        } else {
            popularGamesSection.style.display = 'block';
            newGamesTitle.textContent = 'New Games';
            popularGamesTitle.textContent = 'Popular Games';
            
            const newGames = games.slice(0, 40);
            const popularGames = games.slice(40, 100);

            newGames.forEach(game => {
                newGamesGrid.appendChild(createGameCard(game));
            });

            popularGames.forEach(game => {
                popularGamesGrid.appendChild(createGameCard(game));
            });
        }
    }

    function createGameCard(game) {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.addEventListener('click', () => {
            // Navigate to the new game page, passing game name as a URL parameter
            window.location.href = `game.html?name=${encodeURIComponent(game.name)}`;
        });

        const img = document.createElement('img');
        img.src = game.image;
        img.alt = game.name;
        img.loading = 'lazy'; // Add lazy loading for performance
        img.decoding = 'async'; // Async image decoding
        img.width = 150; // Explicit dimensions for CLS
        img.height = 150;
        
        // Enhanced error handling with better fallback
        img.onerror = () => {
            img.src = 'icons/fav.png'; // Use local fallback instead of external
        };

        const title = document.createElement('h3');
        title.textContent = game.name;

        card.appendChild(img);
        card.appendChild(title);
        return card;
    }

    // Optimized search with debouncing
    let searchTimeout;
    if (searchBar) {
        searchBar.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const activeCategoryElement = document.querySelector('#categories li.active');
                let activeCategory = 'all';
                if (activeCategoryElement) {
                    // Get category name from the text node to avoid reading "icon" from the image alt text
                    const textNode = Array.from(activeCategoryElement.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
                    if (textNode) {
                        activeCategory = textNode.textContent.trim();
                    }
                }
                displayGames(allGames, activeCategory);
            }, 300); // 300ms debounce
        });
    }

    function filterByCategory(category) {
        if (category === 'All') {
            displayGames(allGames);
        } else {
            const filteredGames = allGames.filter(game => game.type && game.type.toLowerCase() === category.toLowerCase());
            displayGames(filteredGames);
        }
    }
    
    function setActiveCategory(activeLi) {
        // Remove active class from all categories
        document.querySelectorAll('#categories li').forEach(li => {
            li.classList.remove('active');
        });
        // Add active class to the clicked category
        activeLi.classList.add('active');
    }
});
