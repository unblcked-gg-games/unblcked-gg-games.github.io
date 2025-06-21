const { execSync } = require('child_process');
const fs = require('fs-extra');
const path = require('path');

// Configuration
const BUILD_DIR = 'dist';
const REPO_URL = 'https://github.com/unblocked-gg-games/unblocked-gg-games.github.io.git';
const TEMP_DIR = 'temp-deploy';

async function deploy() {
    try {
        console.log('🚀 Starting deployment process...');
        
        // Check if build directory exists
        if (!await fs.pathExists(BUILD_DIR)) {
            console.log('❌ Build directory not found. Running build first...');
            require('./build.js');
        }
        
        console.log('📂 Preparing deployment...');
        
        // Clean temp directory
        await fs.remove(TEMP_DIR);
        await fs.ensureDir(TEMP_DIR);
        
        // Initialize git repo in temp directory
        console.log('🔧 Setting up git repository...');
        process.chdir(TEMP_DIR);
        
        try {
            execSync('git init', { stdio: 'inherit' });
            execSync('git remote add origin ' + REPO_URL, { stdio: 'inherit' });
            
            // Copy built files to temp directory
            console.log('📁 Copying built files...');
            process.chdir('..');
            await fs.copy(BUILD_DIR, TEMP_DIR, {
                filter: (src, dest) => {
                    // Don't copy git files
                    return !src.includes('.git');
                }
            });
            
            process.chdir(TEMP_DIR);
            
            // Configure git user (you may want to customize this)
            execSync('git config user.name "GitHub Actions"', { stdio: 'inherit' });
            execSync('git config user.email "actions@github.com"', { stdio: 'inherit' });
            
            // Add all files
            execSync('git add .', { stdio: 'inherit' });
            
            // Commit changes
            const commitMessage = `Deploy: ${new Date().toISOString()}`;
            execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
            
            console.log('✅ Files committed successfully!');
            console.log('');
            console.log('🔑 MANUAL STEP REQUIRED:');
            console.log('To complete the deployment, run these commands:');
            console.log('');
            console.log(`cd ${TEMP_DIR}`);
            console.log('git push -u origin main --force');
            console.log('');
            console.log('Or if you want to push to a different branch:');
            console.log('git checkout -b gh-pages');
            console.log('git push -u origin gh-pages --force');
            console.log('');
            console.log('⚠️  Note: You\'ll need to authenticate with GitHub when pushing.');
            
        } catch (error) {
            console.error('❌ Git operations failed:', error.message);
            console.log('');
            console.log('🔧 Manual deployment option:');
            console.log(`1. Copy all files from ${BUILD_DIR}/ to your GitHub Pages repository`);
            console.log('2. Commit and push to GitHub');
        }
        
    } catch (error) {
        console.error('❌ Deployment failed:', error);
        process.exit(1);
    } finally {
        // Return to original directory
        process.chdir('..');
    }
}

// Run deploy if called directly
if (require.main === module) {
    deploy();
}

module.exports = deploy; 