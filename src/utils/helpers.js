/**
 * ZERA Liquid Template Customizer - Utility Helper Functions
 * 
 * Collection of reusable utility functions for common operations
 * like validation, formatting, DOM manipulation, and data processing.
 */

const ZeraHelpers = {

    // ===== STRING UTILITIES =====

    /**
     * Convert string to kebab-case
     */
    toKebabCase: (str) => {
        return str
            .replace(/([a-z])([A-Z])/g, '$1-$2')
            .replace(/\s+/g, '-')
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, '');
    },

    /**
     * Convert string to camelCase
     */
    toCamelCase: (str) => {
        return str
            .replace(/[-_\s]+(.)?/g, (match, chr) => chr ? chr.toUpperCase() : '')
            .replace(/^[A-Z]/, chr => chr.toLowerCase());
    },

    /**
     * Convert string to PascalCase
     */
    toPascalCase: (str) => {
        return str
            .replace(/[-_\s]+(.)?/g, (match, chr) => chr ? chr.toUpperCase() : '')
            .replace(/^[a-z]/, chr => chr.toUpperCase());
    },

    /**
     * Truncate string with ellipsis
     */
    truncate: (str, length = 50, suffix = '...') => {
        if (str.length <= length) return str;
        return str.substring(0, length - suffix.length) + suffix;
    },

    /**
     * Escape HTML entities
     */
    escapeHtml: (unsafe) => {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    },

    /**
     * Generate random string
     */
    randomString: (length = 8, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') => {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    },

    // ===== NUMBER UTILITIES =====

    /**
     * Clamp number between min and max
     */
    clamp: (num, min, max) => {
        return Math.min(Math.max(num, min), max);
    },

    /**
     * Round to specified decimal places
     */
    round: (num, decimals = 2) => {
        return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
    },

    /**
     * Convert px to rem (assuming 16px base)
     */
    pxToRem: (px, base = 16) => {
        return px / base;
    },

    /**
     * Convert rem to px (assuming 16px base)
     */
    remToPx: (rem, base = 16) => {
        return rem * base;
    },

    /**
     * Generate range of numbers
     */
    range: (start, end, step = 1) => {
        const result = [];
        for (let i = start; i <= end; i += step) {
            result.push(i);
        }
        return result;
    },

    // ===== COLOR UTILITIES =====

    /**
     * Convert hex to RGB
     */
    hexToRgb: (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },

    /**
     * Convert RGB to hex
     */
    rgbToHex: (r, g, b) => {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    },

    /**
     * Convert hex to HSL
     */
    hexToHsl: (hex) => {
        const rgb = ZeraHelpers.hexToRgb(hex);
        if (!rgb) return null;
        
        const { r, g, b } = rgb;
        const rNorm = r / 255;
        const gNorm = g / 255;
        const bNorm = b / 255;
        
        const max = Math.max(rNorm, gNorm, bNorm);
        const min = Math.min(rNorm, gNorm, bNorm);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
                case gNorm: h = (bNorm - rNorm) / d + 2; break;
                case bNorm: h = (rNorm - gNorm) / d + 4; break;
            }
            h /= 6;
        }
        
        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    },

    /**
     * Generate color variations (lighter/darker)
     */
    colorVariations: (hex, steps = 5) => {
        const hsl = ZeraHelpers.hexToHsl(hex);
        if (!hsl) return [];
        
        const variations = [];
        for (let i = -steps; i <= steps; i++) {
            const newL = ZeraHelpers.clamp(hsl.l + (i * 10), 0, 100);
            variations.push(`hsl(${hsl.h}, ${hsl.s}%, ${newL}%)`);
        }
        return variations;
    },

    /**
     * Check if color is light or dark
     */
    isColorLight: (hex) => {
        const rgb = ZeraHelpers.hexToRgb(hex);
        if (!rgb) return false;
        
        const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
        return brightness > 128;
    },

    // ===== VALIDATION UTILITIES =====

    /**
     * Validate email address
     */
    isValidEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    /**
     * Validate URL
     */
    isValidUrl: (url) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    },

    /**
     * Validate hex color
     */
    isValidHex: (hex) => {
        return /^#([0-9A-F]{3}){1,2}$/i.test(hex);
    },

    /**
     * Validate CSS unit
     */
    isValidCssUnit: (value) => {
        return /^-?\d*\.?\d+(px|em|rem|%|vh|vw|vmin|vmax|ch|ex)$/i.test(value);
    },

    /**
     * Sanitize string for use as CSS class name
     */
    sanitizeCssClass: (str) => {
        return str
            .replace(/[^a-zA-Z0-9-_]/g, '')
            .replace(/^[0-9-]+/, '')
            .toLowerCase();
    },

    // ===== OBJECT UTILITIES =====

    /**
     * Deep clone object
     */
    deepClone: (obj) => {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => ZeraHelpers.deepClone(item));
        if (typeof obj === 'object') {
            const cloned = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    cloned[key] = ZeraHelpers.deepClone(obj[key]);
                }
            }
            return cloned;
        }
    },

    /**
     * Deep merge objects
     */
    deepMerge: (target, source) => {
        const result = ZeraHelpers.deepClone(target);
        
        for (const key in source) {
            if (source.hasOwnProperty(key)) {
                if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                    result[key] = ZeraHelpers.deepMerge(result[key] || {}, source[key]);
                } else {
                    result[key] = source[key];
                }
            }
        }
        
        return result;
    },

    /**
     * Get nested object property safely
     */
    getNestedProperty: (obj, path, defaultValue = null) => {
        const keys = path.split('.');
        let current = obj;
        
        for (const key of keys) {
            if (current && typeof current === 'object' && key in current) {
                current = current[key];
            } else {
                return defaultValue;
            }
        }
        
        return current;
    },

    /**
     * Set nested object property
     */
    setNestedProperty: (obj, path, value) => {
        const keys = path.split('.');
        let current = obj;
        
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!(key in current) || typeof current[key] !== 'object') {
                current[key] = {};
            }
            current = current[key];
        }
        
        current[keys[keys.length - 1]] = value;
        return obj;
    },

    // ===== ARRAY UTILITIES =====

    /**
     * Remove duplicates from array
     */
    unique: (arr) => {
        return [...new Set(arr)];
    },

    /**
     * Group array items by property
     */
    groupBy: (arr, property) => {
        return arr.reduce((groups, item) => {
            const key = item[property];
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(item);
            return groups;
        }, {});
    },

    /**
     * Shuffle array
     */
    shuffle: (arr) => {
        const result = [...arr];
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    },

    /**
     * Chunk array into smaller arrays
     */
    chunk: (arr, size) => {
        const chunks = [];
        for (let i = 0; i < arr.length; i += size) {
            chunks.push(arr.slice(i, i + size));
        }
        return chunks;
    },

    // ===== DOM UTILITIES =====

    /**
     * Create element with attributes
     */
    createElement: (tag, attributes = {}, children = []) => {
        const element = document.createElement(tag);
        
        for (const [key, value] of Object.entries(attributes)) {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'textContent') {
                element.textContent = value;
            } else if (key === 'innerHTML') {
                element.innerHTML = value;
            } else {
                element.setAttribute(key, value);
            }
        }
        
        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else {
                element.appendChild(child);
            }
        });
        
        return element;
    },

    /**
     * Get element dimensions including margin
     */
    getElementDimensions: (element) => {
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        
        return {
            width: rect.width,
            height: rect.height,
            outerWidth: rect.width + 
                parseFloat(style.marginLeft) + 
                parseFloat(style.marginRight),
            outerHeight: rect.height + 
                parseFloat(style.marginTop) + 
                parseFloat(style.marginBottom)
        };
    },

    /**
     * Check if element is in viewport
     */
    isInViewport: (element, threshold = 0) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= -threshold &&
            rect.left >= -threshold &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + threshold &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth) + threshold
        );
    },

    // ===== PERFORMANCE UTILITIES =====

    /**
     * Debounce function
     */
    debounce: (func, wait, immediate = false) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    },

    /**
     * Throttle function
     */
    throttle: (func, limit) => {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * Measure function execution time
     */
    measureTime: (func, label = 'Function') => {
        return function(...args) {
            console.time(label);
            const result = func.apply(this, args);
            console.timeEnd(label);
            return result;
        };
    },

    /**
     * Create a simple cache
     */
    createCache: (maxSize = 100) => {
        const cache = new Map();
        
        return {
            get: (key) => cache.get(key),
            set: (key, value) => {
                if (cache.size >= maxSize) {
                    const firstKey = cache.keys().next().value;
                    cache.delete(firstKey);
                }
                cache.set(key, value);
            },
            has: (key) => cache.has(key),
            clear: () => cache.clear(),
            size: () => cache.size
        };
    },

    // ===== BROWSER UTILITIES =====

    /**
     * Detect browser and version
     */
    getBrowserInfo: () => {
        const ua = navigator.userAgent;
        let browser = 'Unknown';
        let version = 'Unknown';
        
        if (ua.indexOf('Chrome') > -1) {
            browser = 'Chrome';
            version = ua.match(/Chrome\/(\d+)/)?.[1] || 'Unknown';
        } else if (ua.indexOf('Firefox') > -1) {
            browser = 'Firefox';
            version = ua.match(/Firefox\/(\d+)/)?.[1] || 'Unknown';
        } else if (ua.indexOf('Safari') > -1) {
            browser = 'Safari';
            version = ua.match(/Version\/(\d+)/)?.[1] || 'Unknown';
        } else if (ua.indexOf('Edge') > -1) {
            browser = 'Edge';
            version = ua.match(/Edge\/(\d+)/)?.[1] || 'Unknown';
        }
        
        return { browser, version };
    },

    /**
     * Check if browser supports a feature
     */
    supportsFeature: (feature) => {
        const features = {
            clipboard: !!navigator.clipboard,
            webGL: !!window.WebGLRenderingContext,
            canvas: !!document.createElement('canvas').getContext,
            localStorage: (() => {
                try {
                    const test = 'test';
                    localStorage.setItem(test, test);
                    localStorage.removeItem(test);
                    return true;
                } catch {
                    return false;
                }
            })(),
            css: {
                grid: CSS.supports('display', 'grid'),
                flexbox: CSS.supports('display', 'flex'),
                customProperties: CSS.supports('--custom', 'property')
            }
        };
        
        return ZeraHelpers.getNestedProperty(features, feature, false);
    },

    // ===== DATE UTILITIES =====

    /**
     * Format date
     */
    formatDate: (date, format = 'YYYY-MM-DD') => {
        const d = new Date(date);
        const formats = {
            'YYYY': d.getFullYear(),
            'MM': String(d.getMonth() + 1).padStart(2, '0'),
            'DD': String(d.getDate()).padStart(2, '0'),
            'HH': String(d.getHours()).padStart(2, '0'),
            'mm': String(d.getMinutes()).padStart(2, '0'),
            'ss': String(d.getSeconds()).padStart(2, '0')
        };
        
        return format.replace(/YYYY|MM|DD|HH|mm|ss/g, match => formats[match]);
    },

    /**
     * Get relative time
     */
    getRelativeTime: (date) => {
        const now = new Date();
        const diff = now - new Date(date);
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        return 'Just now';
    },

    // ===== LOCAL STORAGE UTILITIES =====

    /**
     * Safe localStorage operations
     */
    storage: {
        get: (key, defaultValue = null) => {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch {
                return defaultValue;
            }
        },
        
        set: (key, value) => {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch {
                return false;
            }
        },
        
        remove: (key) => {
            try {
                localStorage.removeItem(key);
                return true;
            } catch {
                return false;
            }
        },
        
        clear: () => {
            try {
                localStorage.clear();
                return true;
            } catch {
                return false;
            }
        }
    },

    // ===== ERROR HANDLING =====

    /**
     * Safe function execution with error handling
     */
    safeExecute: (func, fallback = null, ...args) => {
        try {
            return func(...args);
        } catch (error) {
            console.error('Safe execution failed:', error);
            return typeof fallback === 'function' ? fallback(error) : fallback;
        }
    },

    /**
     * Create error with context
     */
    createError: (message, context = {}) => {
        const error = new Error(message);
        error.context = context;
        error.timestamp = new Date().toISOString();
        return error;
    }
};

// Make helpers globally available
window.ZeraHelpers = ZeraHelpers;

console.log('✅ ZERA Helpers loaded');