/**
 * Slug utility for generating consistent, SEO-friendly game URLs.
 */
(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.slugify = factory().slugify;
        root.getGameUrl = factory().getGameUrl;
    }
}(typeof self !== 'undefined' ? self : this, function () {
    function slugify(name) {
        if (!name) return '';
        return name
            .toString()
            .toLowerCase()
            .trim()
            .replace(/&/g, '-and-')
            .replace(/[\s\W-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    function getGameUrl(game, basePath = '') {
        const slug = slugify(game.name || game);
        const prefix = basePath ? (basePath.endsWith('/') ? basePath : basePath + '/') : '';
        return `${prefix}games/${slug}/`;
    }

    return { slugify, getGameUrl };
}));
