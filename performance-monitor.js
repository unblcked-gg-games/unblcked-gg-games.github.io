// Performance Monitoring Script
// Track Core Web Vitals and other performance metrics

(function() {
    'use strict';
    
    // Performance metrics storage
    const metrics = {};
    
    // Track First Contentful Paint (FCP)
    function trackFCP() {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
                if (entry.name === 'first-contentful-paint') {
                    metrics.fcp = entry.startTime;
                    console.log('FCP:', entry.startTime);
                }
            });
        });
        observer.observe({ entryTypes: ['paint'] });
    }
    
    // Track Largest Contentful Paint (LCP)
    function trackLCP() {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            metrics.lcp = lastEntry.startTime;
            console.log('LCP:', lastEntry.startTime);
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
    
    // Track Cumulative Layout Shift (CLS)
    function trackCLS() {
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            }
            metrics.cls = clsValue;
            console.log('CLS:', clsValue);
        });
        observer.observe({ entryTypes: ['layout-shift'] });
    }
    
    // Track First Input Delay (FID)
    function trackFID() {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                const delay = entry.processingStart - entry.startTime;
                metrics.fid = delay;
                console.log('FID:', delay);
            }
        });
        observer.observe({ entryTypes: ['first-input'] });
    }
    
    // Track Time to Interactive (TTI)
    function trackTTI() {
        window.addEventListener('load', () => {
            const navigationStart = performance.timing.navigationStart;
            const loadEventEnd = performance.timing.loadEventEnd;
            metrics.tti = loadEventEnd - navigationStart;
            console.log('TTI:', metrics.tti);
        });
    }
    
    // Track resource loading times
    function trackResourceTiming() {
        window.addEventListener('load', () => {
            const resources = performance.getEntriesByType('resource');
            const slowResources = resources.filter(resource => resource.duration > 1000);
            
            if (slowResources.length > 0) {
                console.warn('Slow loading resources:', slowResources);
                metrics.slowResources = slowResources.map(r => ({
                    name: r.name,
                    duration: r.duration,
                    size: r.transferSize
                }));
            }
        });
    }
    
    // Track JavaScript errors
    function trackErrors() {
        window.addEventListener('error', (event) => {
            console.error('JavaScript Error:', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno
            });
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled Promise Rejection:', event.reason);
        });
    }
    
    // Initialize all tracking
    function init() {
        if ('PerformanceObserver' in window) {
            trackFCP();
            trackLCP();
            trackCLS();
            trackFID();
        }
        
        trackTTI();
        trackResourceTiming();
        trackErrors();
        
        // Log summary after page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                console.log('Performance Summary:', metrics);
                
                // Performance recommendations
                const recommendations = [];
                
                if (metrics.fcp > 2500) {
                    recommendations.push('FCP is slow. Consider optimizing critical rendering path.');
                }
                
                if (metrics.lcp > 4000) {
                    recommendations.push('LCP is slow. Optimize largest content element loading.');
                }
                
                if (metrics.cls > 0.25) {
                    recommendations.push('CLS is high. Stabilize layout shifts.');
                }
                
                if (metrics.fid > 300) {
                    recommendations.push('FID is high. Optimize JavaScript execution.');
                }
                
                if (recommendations.length > 0) {
                    console.warn('Performance Recommendations:', recommendations);
                }
            }, 5000);
        });
    }
    
    // Start monitoring
    init();
})(); 