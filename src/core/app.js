/**
 * ZERA Liquid Template Customizer - Main Application Controller
 * 
 * This class orchestrates all the core components and manages the application state.
 * It handles template loading, form generation, preview rendering, and user interactions.
 */
class App {
    constructor(universalEngine, formBuilder, previewRenderer) {
        this.universalEngine = universalEngine;
        this.formBuilder = formBuilder;
        this.previewRenderer = previewRenderer;
        
        // Application state
        this.currentTemplate = null;
        this.currentSettings = {};
        this.renderMode = 'preview'; // 'preview', 'code', 'export'
        this.previewMode = 'desktop'; // 'desktop', 'tablet', 'mobile'
        this.isAutoSaveEnabled = true;
        this.autoSaveInterval = null;
        
        // DOM references
        this.elements = {};
        
        // Event listeners storage for cleanup
        this.eventListeners = [];
        
        // Debounced functions
        this.debouncedRender = this.debounce(this.renderPreview.bind(this), 300);
        this.debouncedAutoSave = this.debounce(this.autoSave.bind(this), 2000);
        
        console.log('✅ App instance created');
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            console.log('🚀 Initializing ZERA Liquid Template Customizer...');
            
            // Cache DOM elements
            this.cacheElements();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Initialize components
            await this.initializeComponents();
            
            // Setup auto-save
            this.setupAutoSave();
            
            // Restore previous session if available
            this.restoreSession();
            
            console.log('✅ Application initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize application:', error);
            throw error;
        }
    }

    /**
     * Cache frequently used DOM elements
     */
    cacheElements() {
        this.elements = {
            // Sidebar
            templateSelector: document.getElementById('templateSelector'),
            formContainer: document.getElementById('formContainer'),
            loadingState: document.getElementById('loadingState'),
            templateNotFound: document.getElementById('templateNotFound'),
            
            // Toolbar
            toolbarTitle: document.getElementById('toolbarTitle'),
            previewModeButtons: document.querySelectorAll('.preview-mode-btn'),
            responsiveButtons: document.querySelectorAll('.responsive-btn'),
            refreshPreview: document.getElementById('refreshPreview'),
            resetForm: document.getElementById('resetForm'),
            saveTemplate: document.getElementById('saveTemplate'),
            
            // Preview area
            previewCanvas: document.getElementById('previewCanvas'),
            
            // Modals and overlays
            loadingOverlay: document.getElementById('loadingOverlay'),
            errorModal: document.getElementById('errorModal'),
            successToast: document.getElementById('successToast')
        };
        
        // Validation
        const missingElements = [];
        Object.entries(this.elements).forEach(([key, element]) => {
            if (!element || (NodeList.prototype.isPrototypeOf(element) && element.length === 0)) {
                missingElements.push(key);
            }
        });
        
        if (missingElements.length > 0) {
            console.warn('⚠️ Missing DOM elements:', missingElements);
        }
        
        console.log('✅ DOM elements cached');
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Template selector
        this.addEventListener(this.elements.templateSelector, 'change', this.handleTemplateChange.bind(this));
        
        // Preview mode buttons
        this.elements.previewModeButtons.forEach(btn => {
            this.addEventListener(btn, 'click', this.handleRenderModeChange.bind(this));
        });
        
        // Responsive buttons
        this.elements.responsiveButtons.forEach(btn => {
            this.addEventListener(btn, 'click', this.handlePreviewModeChange.bind(this));
        });
        
        // Toolbar actions
        this.addEventListener(this.elements.refreshPreview, 'click', this.handleRefreshPreview.bind(this));
        this.addEventListener(this.elements.resetForm, 'click', this.handleResetForm.bind(this));
        this.addEventListener(this.elements.saveTemplate, 'click', this.handleSaveTemplate.bind(this));
        
        // Window events
        this.addEventListener(window, 'beforeunload', this.handleBeforeUnload.bind(this));
        this.addEventListener(window, 'resize', this.debounce(this.handleWindowResize.bind(this), 250));
        
        console.log('✅ Event listeners setup complete');
    }

    /**
     * Add event listener and store reference for cleanup
     */
    addEventListener(element, event, handler) {
        if (element) {
            element.addEventListener(event, handler);
            this.eventListeners.push({ element, event, handler });
        }
    }

    /**
     * Initialize core components
     */
    async initializeComponents() {
        try {
            // Initialize Universal Engine
            await this.universalEngine.init();
            
            // Initialize Form Builder
            this.formBuilder.init();
            
            // Initialize Preview Renderer
            this.previewRenderer.init();
            
            console.log('✅ Core components initialized');
            
        } catch (error) {
            console.error('❌ Failed to initialize components:', error);
            throw error;
        }
    }

    /**
     * Handle template selection change
     */
    async handleTemplateChange() {
        const selectedTemplate = this.elements.templateSelector.value;
        
        if (!selectedTemplate) {
            this.clearTemplate();
            return;
        }

        try {
            console.log(`🔄 Loading template: ${selectedTemplate}`);
            
            // Show loading state
            this.showLoading('Loading template...');
            
            // Load template data
            const templateData = await this.universalEngine.loadTemplate(selectedTemplate);
            
            if (!templateData) {
                throw new Error(`Template not found: ${selectedTemplate}`);
            }
            
            // Store current template and settings
            this.currentTemplate = templateData;
            this.currentSettings = { ...templateData.settings };

            // Generate form using FormBuilder
            const formHTML = this.formBuilder.generateForm(
                templateData.customization,
                templateData.sections || {},
                this.currentSettings
            );
            
            // Update form container
            this.elements.formContainer.innerHTML = formHTML;
            
            // Hide loading state
            this.hideLoading();
            
            // Setup form listeners after DOM update
            setTimeout(() => {
                this.setupFormChangeDetection();
                console.log('✅ Form listeners setup complete');
            }, 100);
            
            // Update preview
            await this.renderPreview();
            
            // Update toolbar title
            this.updateToolbarTitle(`Preview - ${templateData.meta.name}`);
            
            console.log('✅ Template changed successfully');
            
        } catch (error) {
            console.error('❌ Template change failed:', error);
            this.showTemplateNotFound();
            this.showError('Template Load Error', error.message);
        }
    }


    /**
     * Setup form change detection
     */
    setupFormChangeDetection() {
        const formElements = this.elements.formContainer.querySelectorAll('input, select, textarea');
        
        formElements.forEach(element => {
            const handler = this.handleFormChange.bind(this);
            
            // Remove existing listeners
            element.removeEventListener('input', handler);
            element.removeEventListener('change', handler);
            
            // Add new listeners
            element.addEventListener('input', handler);
            element.addEventListener('change', handler);
            
            // Mobile-specific events
            if ('ontouchstart' in window) {
                element.addEventListener('touchend', handler);
            }
        });
        
        console.log(`✅ Form change detection setup for ${formElements.length} elements`);
    }

    /**
 * Handle form field changes - OPTIMIZED
 */
handleFormChange(event) {
    const { name, value, type, checked } = event.target;
    
    if (!name) return;
    
    // ✅ PREVENT CHANGES DURING MODE SWITCHING
    if (this.previewRenderer?.isChangingMode) {
        console.log('⏸️ Skipping form change during mode switch');
        return;
    }
    
    // Update settings based on input type
    if (type === 'checkbox') {
        this.currentSettings[name] = checked;
    } else if (type === 'number' || type === 'range') {
        this.currentSettings[name] = parseFloat(value) || 0;
    } else {
        this.currentSettings[name] = value;
    }
    
    // ✅ SINGLE OPTIMIZED RENDER (no auto-save during typing)
    this.debouncedRender();
    
    // ✅ LESS FREQUENT AUTO-SAVE (only on significant changes)
    if (this.isAutoSaveEnabled && (type === 'checkbox' || type === 'select-one')) {
        this.debouncedAutoSave();
    }
    
    // Update range displays
    if (type === 'range') {
        this.updateRangeDisplay(event.target);
    }
}
    /**
     * Update range input display
     */
    updateRangeDisplay(rangeInput) {
        const display = rangeInput.parentElement.querySelector('.range-value');
        if (display) {
            const unit = rangeInput.dataset.unit || '';
            display.textContent = rangeInput.value + unit;
        }
    }

    /**
     * Handle render mode change (preview/code/export)
     */
    handleRenderModeChange(event) {
        const mode = event.target.dataset.renderMode;
        if (!mode || mode === this.renderMode) return;
        
        // Update active state
        this.elements.previewModeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.renderMode === mode);
        });
        
        this.renderMode = mode;
        this.previewRenderer.setRenderMode(mode);
        
        console.log(`✅ Render mode changed to: ${mode}`);
    }

    /**
     * Handle preview mode change (desktop/tablet/mobile)
     */
    handlePreviewModeChange(event) {
        const mode = event.target.dataset.previewMode;
        if (!mode || mode === this.previewMode) return;
        
        // Update active state
        this.elements.responsiveButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.previewMode === mode);
        });
        
        this.previewMode = mode;
        this.previewRenderer.setPreviewMode(mode);
        
        console.log(`✅ Preview mode changed to: ${mode}`);
    }

    /**
     * Render preview based on current mode
     */
    async renderPreview() {
        try {
            if (!this.currentTemplate) {
                console.warn('⚠️ No template selected for preview');
                return;
            }

            // Validate settings
            let currentSettings = this.currentSettings || {};
            
            // Merge with template defaults
            if (this.currentTemplate.settings) {
                currentSettings = { ...this.currentTemplate.settings, ...currentSettings };
            }

            console.log('🔍 Rendering preview with settings:', currentSettings);

            await this.previewRenderer.render(this.currentTemplate, currentSettings);
            
        } catch (error) {
            console.error('❌ Preview render failed:', error);
            this.showError('Preview Error', error.message);
        }
    }

    /**
     * Clear current template
     */
    clearTemplate() {
        this.currentTemplate = null;
        this.currentSettings = {};
        this.elements.formContainer.innerHTML = '';
        this.previewRenderer.clearPreview();
        this.updateToolbarTitle('Preview');
        console.log('✅ Template cleared');
    }

    /**
     * Handle refresh preview
     */
    async handleRefreshPreview() {
        await this.renderPreview();
        this.showSuccess('Preview refreshed successfully!');
    }

    /**
     * Handle reset form
     */
    handleResetForm() {
        if (!this.currentTemplate) return;
        
        if (confirm('Are you sure you want to reset all settings to their default values?')) {
            this.currentSettings = { ...this.currentTemplate.settings };
            
            // Regenerate form
            const formHTML = this.formBuilder.generateForm(
                this.currentTemplate.customization,
                this.currentTemplate.sections || {},
                this.currentSettings
            );
            
            this.elements.formContainer.innerHTML = formHTML;
            
            // Setup listeners again
            setTimeout(() => {
                this.setupFormChangeDetection();
            }, 100);
            
            this.renderPreview();
            this.showSuccess('Form reset to default values!');
        }
    }

    /**
     * Handle save template
     */
    handleSaveTemplate() {
        if (!this.currentTemplate) {
            this.showError('Save Error', 'No template selected to save');
            return;
        }
        
        try {
            this.saveSession();
            this.showSuccess('Template saved successfully!');
        } catch (error) {
            this.showError('Save Error', error.message);
        }
    }

    /**
     * Setup auto-save functionality
     */
    setupAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }
        
        this.autoSaveInterval = setInterval(() => {
            if (this.currentTemplate && this.isAutoSaveEnabled) {
                this.autoSave();
            }
        }, 120000); // Auto-save every 30 seconds
    }

    /**
     * Auto-save current state
     */
    autoSave() {
        try {
            this.saveSession();
            console.log('💾 Auto-saved session');
        } catch (error) {
            console.error('❌ Auto-save failed:', error);
        }
    }

    /**
     * Save current session to localStorage
     */
    saveSession() {
        const sessionData = {
            templateId: this.elements.templateSelector.value,
            settings: this.currentSettings,
            renderMode: this.renderMode,
            previewMode: this.previewMode,
            timestamp: Date.now()
        };
        
        localStorage.setItem('zera_session', JSON.stringify(sessionData));
    }

    /**
     * Restore previous session
     */
    restoreSession() {
        try {
            const sessionData = localStorage.getItem('zera_session');
            if (!sessionData) return;
            
            const session = JSON.parse(sessionData);
            
            // Check if session is not too old (24 hours)
            if (Date.now() - session.timestamp > 24 * 60 * 60 * 1000) {
                localStorage.removeItem('zera_session');
                return;
            }
            
            // Restore template selection
            if (session.templateId) {
                this.elements.templateSelector.value = session.templateId;
                this.elements.templateSelector.dispatchEvent(new Event('change'));
            }
            
            // Restore modes
            if (session.renderMode) {
                this.renderMode = session.renderMode;
            }
            
            if (session.previewMode) {
                this.previewMode = session.previewMode;
            }
            
            console.log('✅ Session restored');
            
        } catch (error) {
            console.error('❌ Failed to restore session:', error);
            localStorage.removeItem('zera_session');
        }
    }

    /**
     * Handle window resize
     */
    handleWindowResize() {
    // ✅ SKIP DURING MODE CHANGES
    if (this.previewRenderer?.isChangingMode) {
        console.log('⏸️ Skipping form change during mode switch');

        return;
    }
    
    // ✅ ONLY UPDATE IFRAME DIMENSIONS, NOT FULL RENDER
    const iframe = this.elements.previewCanvas?.querySelector('iframe');
    if (iframe && this.previewRenderer?.updateIframeDimensions) {
        this.previewRenderer.updateIframeDimensions(iframe);
    }
    
    console.log('📐 Window resized - iframe dimensions updated');
}

    /**
     * Handle before unload (save state)
     */
    handleBeforeUnload(event) {
        if (this.currentTemplate) {
            this.saveSession();
        }
    }

    /**
     * Update toolbar title
     */
    updateToolbarTitle(title) {
        this.elements.toolbarTitle.innerHTML = `
            <i class="fas fa-eye"></i>
            ${title}
        `;
    }

    /**
     * Show loading state
     */
    showLoading(message = 'Loading...') {
        this.elements.loadingState.style.display = 'block';
        this.elements.formContainer.style.display = 'none';
        this.elements.templateNotFound.style.display = 'none';
    }

    /**
     * Hide loading state
     */
    hideLoading() {
        this.elements.loadingState.style.display = 'none';
        this.elements.formContainer.style.display = 'block';
        this.elements.templateNotFound.style.display = 'none';
    }

    /**
     * Show template not found
     */
    showTemplateNotFound() {
        this.elements.loadingState.style.display = 'none';
        this.elements.formContainer.style.display = 'none';
        this.elements.templateNotFound.style.display = 'block';
    }

    /**
     * Show success message
     */
    showSuccess(message) {
        const toast = this.elements.successToast;
        const messageEl = toast.querySelector('#successMessage');
        
        messageEl.textContent = message;
        toast.style.display = 'flex';
        
        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);
    }

    /**
     * Show error message
     */
    showError(title, message, stack = null) {
        const modal = this.elements.errorModal;
        const messageEl = modal.querySelector('#errorMessage');
        const stackEl = modal.querySelector('#errorStack');
        
        messageEl.textContent = message;
        if (stack && stackEl) {
            stackEl.textContent = stack;
        }
        
        modal.style.display = 'flex';
    }

    /**
     * Utility: Debounce function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Cleanup resources
     */
    destroy() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }
        
        this.eventListeners.forEach(({ element, event, handler }) => {
            if (element) {
                element.removeEventListener(event, handler);
            }
        });
        
        this.eventListeners = [];
        console.log('✅ App resources cleaned up');
    }
}

// Global functions for inline event handlers
window.copyToClipboard = function(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const text = element.textContent;
    navigator.clipboard.writeText(text).then(() => {
        app.showSuccess('Code copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        app.showError('Copy Error', 'Failed to copy code to clipboard');
    });
};

window.downloadShopifySection = function() {
    if (!app.currentTemplate) return;
    
    const shopifySection = app.universalEngine.generateShopifySection(
        app.currentTemplate,
        app.currentSettings
    );
    
    const blob = new Blob([shopifySection], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.href = url;
    a.download = `${app.currentTemplate.meta.name.toLowerCase().replace(/\s+/g, '-')}.liquid`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    app.showSuccess('Shopify section downloaded successfully!');
};

// Make app globally available
window.app = null;

console.log('✅ App class loaded');