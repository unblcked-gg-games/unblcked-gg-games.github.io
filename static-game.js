/**
 * Lightweight client script for static game pages.
 * Handles fullscreen, local favorites, star rating, and interactive controls
 * without needing an 81KB games.json fetch or layout shifts.
 */
document.addEventListener('DOMContentLoaded', () => {
    const gameFrame = document.getElementById('game-frame');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const favoriteBtn = document.getElementById('favorite-btn');
    const favoriteIcon = document.getElementById('favorite-icon');
    const stars = document.querySelectorAll('.star');
    const ratingText = document.getElementById('rating-text');
    const ratingContainer = document.querySelector('.rating-container');

    const gameName = favoriteBtn ? favoriteBtn.getAttribute('data-game-name') : '';

    // Fullscreen handler
    if (fullscreenBtn && gameFrame) {
        fullscreenBtn.addEventListener('click', () => {
            try {
                if (gameFrame.requestFullscreen) {
                    gameFrame.requestFullscreen();
                } else if (gameFrame.mozRequestFullScreen) {
                    gameFrame.mozRequestFullScreen();
                } else if (gameFrame.webkitRequestFullscreen) {
                    gameFrame.webkitRequestFullscreen();
                } else if (gameFrame.msRequestFullscreen) {
                    gameFrame.msRequestFullscreen();
                }
            } catch (err) {
                console.warn('Fullscreen request failed:', err);
            }
        });
    }

    if (!gameName) return;

    // Favorites
    function getFavorites() {
        try {
            return JSON.parse(localStorage.getItem('unblocked-games-favorites') || '[]');
        } catch {
            return [];
        }
    }

    function updateFavoriteButton(isFavorite) {
        if (!favoriteBtn || !favoriteIcon) return;
        if (isFavorite) {
            favoriteIcon.textContent = '♥';
            favoriteBtn.classList.add('active');
        } else {
            favoriteIcon.textContent = '♡';
            favoriteBtn.classList.remove('active');
        }
    }

    const currentFavorites = getFavorites();
    updateFavoriteButton(currentFavorites.includes(gameName));

    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', () => {
            const list = getFavorites();
            const idx = list.indexOf(gameName);
            if (idx > -1) {
                list.splice(idx, 1);
                updateFavoriteButton(false);
            } else {
                list.push(gameName);
                updateFavoriteButton(true);
            }
            localStorage.setItem('unblocked-games-favorites', JSON.stringify(list));
        });
    }

    // Ratings
    function getRating(name) {
        try {
            const ratings = JSON.parse(localStorage.getItem('unblocked-games-ratings') || '{}');
            return ratings[name] || 0;
        } catch {
            return 0;
        }
    }

    function setRating(name, rating) {
        try {
            const ratings = JSON.parse(localStorage.getItem('unblocked-games-ratings') || '{}');
            ratings[name] = rating;
            localStorage.setItem('unblocked-games-ratings', JSON.stringify(ratings));
        } catch (e) {
            console.error('Error saving rating:', e);
        }
    }

    function updateRatingDisplay(rating) {
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
                star.style.color = '#ffd700';
            } else {
                star.classList.remove('active');
                star.style.color = '#ddd';
            }
        });
        if (ratingText) {
            ratingText.textContent = rating > 0 ? `(${rating}/5)` : '(0)';
        }
    }

    const currentRating = getRating(gameName);
    updateRatingDisplay(currentRating);

    stars.forEach(star => {
        star.addEventListener('click', () => {
            const rating = parseInt(star.dataset.rating, 10);
            setRating(gameName, rating);
            updateRatingDisplay(rating);
        });

        star.addEventListener('mouseenter', () => {
            const rating = parseInt(star.dataset.rating, 10);
            stars.forEach((s, i) => {
                s.style.color = i < rating ? '#ffd700' : '#ddd';
            });
        });
    });

    if (ratingContainer) {
        ratingContainer.addEventListener('mouseleave', () => {
            const rating = getRating(gameName);
            updateRatingDisplay(rating);
        });
    }
});
