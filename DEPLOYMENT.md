# 🚀 Secure Deployment Guide for GitHub Pages

This guide will help you deploy your Unblocked Games website to GitHub Pages at `unblocked-gg-games.github.io` while keeping your source code secure.

## 🔐 Security Strategy

We use a **two-repository approach**:
1. **Private Repository**: Contains your source code and sensitive files
2. **Public Repository**: Contains only the built/compiled files for GitHub Pages

## 📋 Prerequisites

1. **Node.js 20+** installed on your machine
2. **Git** installed and configured
3. **GitHub account** with access to create repositories

## 🏗️ Setup Instructions

### Step 1: Create GitHub Repositories

1. **Create Private Repository** (for source code):
   ```
   Repository name: unblocked-games-source (or any name you prefer)
   Visibility: Private
   ```

2. **Create Public Repository** (for GitHub Pages):
   ```
   Repository name: unblocked-gg-games.github.io
   Visibility: Public
   Initialize with README: No
   ```

### Step 2: Setup Local Development

1. **Initialize your private repository**:
   ```bash
   git init
   git remote add origin https://github.com/YOUR_USERNAME/unblocked-games-source.git
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Test the build process**:
   ```bash
   npm run build
   ```

### Step 3: Configure GitHub Pages Repository

1. **Go to your public repository settings**:
   - Navigate to `https://github.com/unblocked-gg-games/unblocked-gg-games.github.io/settings`
   - Go to "Pages" section
   - Source: "Deploy from a branch"
   - Branch: "main" or "gh-pages"
   - Folder: "/ (root)"

## 🚀 Deployment Options

### Option A: Manual Deployment (Recommended for Security)

1. **Build the website**:
   ```bash
   npm run build
   ```

2. **Navigate to the build directory**:
   ```bash
   cd dist
   ```

3. **Initialize git and push to public repo**:
   ```bash
   git init
   git add .
   git commit -m "Deploy website"
   git branch -M main
   git remote add origin https://github.com/unblocked-gg-games/unblocked-gg-games.github.io.git
   git push -u origin main --force
   ```

### Option B: Semi-Automated Deployment

1. **Run the deployment script**:
   ```bash
   npm run deploy
   ```

2. **Follow the instructions** shown in the terminal to complete the push.

### Option C: GitHub Actions (Automated)

If you want to use your private repository with GitHub Actions:

1. **Push your source code to private repo**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Setup repository secrets**:
   - Go to your private repo settings
   - Add a Personal Access Token with repo permissions
   - Name it `DEPLOY_TOKEN`

3. **The workflow will automatically**:
   - Build your website on every push
   - Deploy to GitHub Pages
   - Keep source code private

## 🔒 Security Features

### What's Hidden from Public View:
- Original source code structure
- Build scripts and configuration
- Development dependencies
- Any sensitive comments or metadata
- Performance monitoring scripts

### What's Public:
- Compiled HTML, CSS, JavaScript
- Game images and assets
- Fonts and icons
- Games database (cleaned)
- SEO files (sitemap, robots.txt)

## 📁 File Structure

### Private Repository:
```
unblocked-games-source/
├── src/                    # Source files
├── build.js               # Build script
├── deploy.js              # Deployment script
├── package.json           # Dependencies
├── .github/workflows/     # GitHub Actions
└── DEPLOYMENT.md          # This guide
```

### Public Repository:
```
unblocked-gg-games.github.io/
├── index.html             # Built website
├── style.css              # Compiled styles
├── script.js              # Minified scripts
├── games.json             # Cleaned game data
├── sitemap.xml            # SEO sitemap
├── robots.txt             # Search engine rules
├── icons/                 # Game icons
├── game-images/           # Game screenshots
├── fonts/                 # Web fonts
├── .nojekyll              # GitHub Pages config
└── README.md              # Public documentation
```

## 🔧 Maintenance

### Updating the Website:

1. **Make changes in your private repository**
2. **Test locally**:
   ```bash
   npm run dev
   ```
3. **Build and deploy**:
   ```bash
   npm run build
   npm run deploy
   ```

### Adding New Games:

1. **Update `games.json`** in your private repo
2. **Add game images** to `game-images/` folder
3. **Build and deploy** as usual

## 🌐 Custom Domain (Optional)

To use a custom domain like `unblockedgames.gg`:

1. **Update CNAME file** in build script:
   ```javascript
   await fs.writeFile(path.join(BUILD_DIR, 'CNAME'), 'your-domain.com');
   ```

2. **Configure DNS** with your domain provider:
   ```
   Type: CNAME
   Name: www (or @)
   Value: unblocked-gg-games.github.io
   ```

## 🆘 Troubleshooting

### Build Fails:
```bash
npm run clean
npm install
npm run build
```

### Deployment Issues:
- Check GitHub repository permissions
- Verify GitHub Pages is enabled
- Ensure branch name matches settings

### Site Not Loading:
- Wait 5-10 minutes for GitHub Pages to update
- Check browser cache (hard refresh)
- Verify CNAME file if using custom domain

## 📞 Support

If you encounter issues:
1. Check the build logs for errors
2. Verify all files are in the `dist/` directory
3. Test the built files locally before deploying
4. Check GitHub Pages build status in repository settings

---

🎮 **Happy Gaming!** Your secure deployment is now ready! 