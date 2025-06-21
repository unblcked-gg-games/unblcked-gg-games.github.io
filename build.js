const fs = require('fs-extra');
const path = require('path');

// Configuration
const BUILD_DIR = 'dist';
const PUBLIC_FILES = [
    'index.html',
    'game.html', 
    'favorites.html',
    'legal.html',
    'racing-games-faq.html',
    'style.css',
    'script.js',
    'game.js',
    'favorites.js',
    'components.js',
    'header.html',
    'footer.html',
    'games.json',
    'sitemap.xml',
    'robots.txt'
];

const PUBLIC_DIRS = [
    'icons',
    'game-images',
    'fonts'
];

async function build() {
    try {
        console.log('🚀 Starting build process...');
        
        // Clean build directory
        console.log('🧹 Cleaning build directory...');
        await fs.remove(BUILD_DIR);
        await fs.ensureDir(BUILD_DIR);
        
        // Copy public files
        console.log('📁 Copying files...');
        for (const file of PUBLIC_FILES) {
            if (await fs.pathExists(file)) {
                await fs.copy(file, path.join(BUILD_DIR, file));
                console.log(`  ✅ Copied: ${file}`);
            } else {
                console.log(`  ⚠️  File not found: ${file}`);
            }
        }
        
        // Copy public directories
        console.log('📂 Copying directories...');
        for (const dir of PUBLIC_DIRS) {
            if (await fs.pathExists(dir)) {
                await fs.copy(dir, path.join(BUILD_DIR, dir));
                console.log(`  ✅ Copied directory: ${dir}`);
            } else {
                console.log(`  ⚠️  Directory not found: ${dir}`);
            }
        }
        
        // Create a minimal games.json (remove any sensitive data if needed)
        console.log('🔒 Processing games.json...');
        const gamesData = await fs.readJson('games.json');
        
        // Remove any potentially sensitive fields (if any)
        const cleanGamesData = gamesData.map(game => ({
            name: game.name,
            type: game.type,
            image: game.image,
            url: game.url,
            description: game.description,
            newtab: game.newtab || undefined
        }));
        
        await fs.writeJson(path.join(BUILD_DIR, 'games.json'), cleanGamesData, { spaces: 2 });
        
        // Create CNAME file for custom domain (if needed)
        console.log('🌐 Creating CNAME file...');
        await fs.writeFile(path.join(BUILD_DIR, 'CNAME'), 'unblocked-gg-games.github.io');
        
        // Create .nojekyll file to prevent Jekyll processing
        console.log('⚙️  Creating .nojekyll file...');
        await fs.writeFile(path.join(BUILD_DIR, '.nojekyll'), '');
        
        // Create README for the public repo
        console.log('📝 Creating README...');
        const readme = `# Unblocked Games GG

🎮 **Play the Best Free Online Games**

This is the public repository for [Unblocked Games GG](https://unblocked-gg-games.github.io) - a collection of free, unblocked games that can be played instantly in your browser.

## 🌟 Features

- 180+ Free Games
- No Downloads Required
- Mobile Friendly
- Instant Play
- Regular Updates

## 🎯 Categories

- Action Games
- Puzzle Games
- Racing Games
- Sports Games
- Multiplayer Games
- And many more!

## 🚀 Quick Start

Simply visit [unblocked-gg-games.github.io](https://unblocked-gg-games.github.io) to start playing!

## 📱 Mobile Support

All games are optimized for both desktop and mobile devices.

## 🤝 Contributing

This is an automatically generated repository. The source code is maintained privately.

## 📄 License

MIT License - See LICENSE file for details.

---

Built with ❤️ for the gaming community
`;
        
        await fs.writeFile(path.join(BUILD_DIR, 'README.md'), readme);
        
        // Create a simple LICENSE file
        console.log('⚖️  Creating LICENSE...');
        const license = `MIT License

Copyright (c) 2024 Unblocked Games GG

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;
        
        await fs.writeFile(path.join(BUILD_DIR, 'LICENSE'), license);
        
        console.log('✅ Build completed successfully!');
        console.log(`📦 Built files are in: ${BUILD_DIR}/`);
        console.log('🚀 Ready for deployment to GitHub Pages!');
        
    } catch (error) {
        console.error('❌ Build failed:', error);
        process.exit(1);
    }
}

// Run build if called directly
if (require.main === module) {
    build();
}

module.exports = build; 