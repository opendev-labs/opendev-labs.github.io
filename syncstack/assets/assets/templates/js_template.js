/**
 * {{PROJECT_NAME}} - JavaScript Module
 * Created with SyncStack Desktop
 * Modern ES6+ JavaScript Template
 */

// Configuration
const CONFIG = {
    appName: '{{PROJECT_NAME}}',
    version: '1.0.0',
    debug: true
};

// Utility Functions
const utils = {
    /**
     * Log messages to console if debug is enabled
     */
    log: (...args) => {
        if (CONFIG.debug) {
            console.log(`[${CONFIG.appName}]`, ...args);
        }
    },

    /**
     * Query selector helper
     */
    $(selector) {
        return document.querySelector(selector);
    },

    /**
     * Query selector all helper
     */
    $$(selector) {
        return document.querySelectorAll(selector);
    },

    /**
     * Fetch data from API
     */
    async fetchData(url, options = {}) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            utils.log('Fetch error:', error);
            throw error;
        }
    }
};

// Application Class
class App {
    constructor() {
        this.state = {
            initialized: false,
            data: null
        };

        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        utils.log('Initializing application...');

        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    /**
     * Setup event listeners and UI
     */
    setup() {
        utils.log('Setting up application...');

        this.setupEventListeners();
        this.state.initialized = true;

        utils.log('Application ready!');
        console.log(`%c${CONFIG.appName} v${CONFIG.version}`,
            'color: #00FF41; font-size: 20px; font-weight: bold;');
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Primary button
        const primaryBtn = utils.$('.btn-primary');
        if (primaryBtn) {
            primaryBtn.addEventListener('click', (e) => {
                this.handlePrimaryAction(e);
            });
        }

        // Secondary button
        const secondaryBtn = utils.$('.btn-secondary');
        if (secondaryBtn) {
            secondaryBtn.addEventListener('click', (e) => {
                this.handleSecondaryAction(e);
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyPress(e);
        });
    }

    /**
     * Handle primary button action
     */
    handlePrimaryAction(event) {
        utils.log('Primary action triggered');

        // Add your primary action logic here
        alert(`Welcome to ${CONFIG.appName}!`);
    }

    /**
     * Handle secondary button action
     */
    handleSecondaryAction(event) {
        utils.log('Secondary action triggered');

        // Add your secondary action logic here
        window.open('https://github.com/opendev-labs', '_blank');
    }

    /**
     * Handle keyboard shortcuts
     */
    handleKeyPress(event) {
        // Cmd/Ctrl + K for search (example)
        if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
            event.preventDefault();
            utils.log('Search shortcut triggered');
        }
    }

    /**
     * Update application state
     */
    setState(newState) {
        this.state = { ...this.state, ...newState };
        utils.log('State updated:', this.state);
    }

    /**
     * Load data from API (example)
     */
    async loadData() {
        try {
            const data = await utils.fetchData('https://api.example.com/data');
            this.setState({ data });
            return data;
        } catch (error) {
            utils.log('Error loading data:', error);
            return null;
        }
    }
}

// Initialize the application
const app = new App();

// Export for use in modules (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { app, utils, CONFIG };
}
