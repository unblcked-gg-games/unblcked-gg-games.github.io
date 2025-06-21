document.addEventListener('DOMContentLoaded', function() {
    const favoritesGrid = document.getElementById('favorites-grid');
    const searchBar = document.getElementById('search-bar');
    let allGames = [];
    let favoriteGames = [];

    // Load games and display favorites
    fetch('games.json')
        .then(response => response.json())
        .then(games => {
            allGames = games;
            loadFavorites();
            populateCategories(games);
        })
        .catch(error => {
            console.error('Error loading games:', error);
            if (favoritesGrid) {
                favoritesGrid.innerHTML = '<div class="error-message">Failed to load games. Please refresh the page.</div>';
            }
        });

    function loadFavorites() {
        const favorites = getFavorites();
        favoriteGames = allGames.filter(game => favorites.includes(game.name));
        displayFavorites(favoriteGames);
    }

    function getFavorites() {
        const favorites = localStorage.getItem('unblocked-games-favorites');
        return favorites ? JSON.parse(favorites) : [];
    }

    function displayFavorites(games) {
        if (!favoritesGrid) return;
        
        favoritesGrid.innerHTML = '';
        
        if (games.length === 0) {
            favoritesGrid.innerHTML = `
                <div class="no-games-found">
                    <h3>No favorite games yet! 💔</h3>
                    <p>Start exploring games and click the heart icon to add them to your favorites.</p>
                    <a href="index.html" style="color: var(--accent-color); text-decoration: none;">← Back to Games</a>
                </div>
            `;
            return;
        }

        games.forEach(game => {
            favoritesGrid.appendChild(createGameCard(game));
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
        img.loading = 'lazy';
        img.decoding = 'async';
        img.width = 150;
        img.height = 150;
        img.onerror = () => { img.src = 'icons/fav.png'; };

        const title = document.createElement('h3');
        title.textContent = game.name;

        // Add remove from favorites button
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-favorite-btn';
        removeBtn.innerHTML = '×';
        removeBtn.title = 'Remove from favorites';
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            removeFromFavorites(game.name);
        });

        card.appendChild(img);
        card.appendChild(title);
        card.appendChild(removeBtn);
        return card;
    }

    function removeFromFavorites(gameName) {
        const favorites = getFavorites();
        const updatedFavorites = favorites.filter(name => name !== gameName);
        localStorage.setItem('unblocked-games-favorites', JSON.stringify(updatedFavorites));
        loadFavorites(); // Refresh the display
    }

    function populateCategories(games) {
        const categoriesList = document.getElementById('categories');
        if (!categoriesList) return;
        
        const categories = [...new Set(games.map(game => game.type))];
        const iconMap = {
            'Action': 'actions.webp', 'Adventure': 'adventure.webp', 'Battle': 'actions.webp',
            'Board': 'board.webp', 'Classic': 'classic.webp', 'Retro': 'classic.webp',
            'Clicker': 'clicker.webp', 'Idle': 'clicker.webp', 'Multiplayer': 'multiplayer.webp',
            'Other': 'other.webp', 'Platformer': 'adventure.webp', 'Puzzle': 'puzzle.webp',
            'Racing': 'racing.webp', 'Shooter': 'actions.webp', 'Skill': 'sport.webp',
            'Sport': 'sport.webp', 'Simulation': 'simulation.webp', 'Rpg': 'rpg.webp',
            'Trivia': 'trivia.webp', 'Girls': 'girls.webp', '3d': '3d.webp', 'All': 'rocket.webp'
        };

        categoriesList.innerHTML = '';

        // Add 'All' category
        const allLi = document.createElement('li');
        const allIcon = document.createElement('img');
        allIcon.className = 'category-icon';
        allIcon.src = 'icons/rocket.webp';
        allIcon.alt = 'All icon';
        allLi.appendChild(allIcon);
        allLi.append('All');
        allLi.addEventListener('click', () => window.location.href = 'index.html');
        categoriesList.appendChild(allLi);

        // Add Favorites category (mark as active since we're on favorites page)
        const favLi = document.createElement('li');
        favLi.className = 'favorites-category active';
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

        // Add other categories
        categories.sort().forEach(category => {
            const li = document.createElement('li');
            const icon = document.createElement('img');
            icon.className = 'category-icon';
            icon.src = `icons/${iconMap[category] || 'other.webp'}`;
            icon.alt = `${category} icon`;
            li.appendChild(icon);
            li.append(category);
            li.addEventListener('click', () => {
                window.location.href = `index.html?category=${encodeURIComponent(category)}`;
            });
            categoriesList.appendChild(li);
        });
    }

    // Search functionality
    if (searchBar) {
        searchBar.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredGames = favoriteGames.filter(game => 
                game.name.toLowerCase().includes(searchTerm)
            );
            displayFavorites(filteredGames);
        });
    }
}); 