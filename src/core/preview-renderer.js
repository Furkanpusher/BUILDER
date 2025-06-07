/**
 * Preview Renderer - Handles template preview, code display, and export functionality
 * ENHANCED VERSION - Added sticky scroll sync feature
 */
class PreviewRenderer {
    constructor(universalEngine) {
        this.universalEngine = universalEngine;
        
        // DOM references
        this.previewContainer = null;
        this.sidebarContainer = null;
        
        // State
        this.currentTemplate = null;
        this.lastUsedSettings = {};
        this.previewMode = 'desktop'; // desktop, tablet, mobile
        this.renderMode = 'preview'; // preview, code, export
        
        // ✅ Scroll sync properties
        this.isScrollSyncEnabled = true;
        this.scrollSyncOffset = 100; // Offset from top
        
        console.log('👁️ Preview Renderer initialized with scroll sync');
    }

    /**
     * Initialize preview renderer
     */
    init() {
        this.previewContainer = document.getElementById('previewCanvas');
        this.sidebarContainer = document.querySelector('.sidebar');
        
        if (!this.previewContainer) {
            console.error('❌ Preview container not found: #previewCanvas');
            return Promise.reject('Preview container not found');
        }

        this.setupPreviewControls();
        
        // ✅ Setup scroll sync
        this.setupScrollSync();
        
        console.log('✅ Preview renderer ready with scroll sync');
        return Promise.resolve();
    }

    /**
     * ✅ Setup scroll synchronization between sidebar and preview
     */
    setupScrollSync() {
    if (!this.sidebarContainer) {
        console.warn('⚠️ Sidebar container not found for scroll sync');
        return;
    }

    // ✅ THROTTLE SCROLL EVENTS - PREVENT LAG
    let scrollTimeout;
    const throttledScrollHandler = (e) => {
        if (scrollTimeout) return;
        
        scrollTimeout = setTimeout(() => {
            if (this.isScrollSyncEnabled) {
                this.handleScrollSync(e);
            }
            scrollTimeout = null;
        }, 16); // ⬅️ ~60fps throttling
    };
    
    // ✅ PASSIVE EVENT LISTENERS - BETTER PERFORMANCE
    this.sidebarContainer.addEventListener('scroll', throttledScrollHandler, { passive: true });
    
    // ✅ DEBOUNCED WINDOW SCROLL
    let windowScrollTimeout;
    const throttledWindowScroll = () => {
        if (windowScrollTimeout) return;
        
        windowScrollTimeout = setTimeout(() => {
            if (this.isScrollSyncEnabled) {
                this.handleWindowScroll();
            }
            windowScrollTimeout = null;
        }, 32); // ⬅️ ~30fps for window scroll
    };
    
    window.addEventListener('scroll', throttledWindowScroll, { passive: true });
    
    console.log('✅ Optimized scroll sync setup complete');
}

    /**
     * ✅ Apply sticky positioning to preview container
     */
applyStickyPositioning() {
    // ✅ USE requestAnimationFrame FOR SMOOTH TRANSITION
    requestAnimationFrame(() => {
        const previewWrapper = this.previewContainer.closest('.preview-section') || 
                              this.previewContainer.parentElement;
        
        if (previewWrapper) {
            // ✅ BATCH STYLE UPDATES
            Object.assign(previewWrapper.style, {
                position: 'sticky',
                top: '80px',
                height: '85vh', // ⬅️ FIXED HEIGHT
                overflow: 'hidden',
                zIndex: '10',
                transition: 'transform 0.2s ease-out'
            });
            
            // ✅ ENSURE PREVIEW CANVAS FIXED HEIGHT
            Object.assign(this.previewContainer.style, {
                height: '100%',
                overflow: 'hidden'
            });
            
            console.log('✅ Optimized sticky positioning applied');
        }
    });
}
    /**
     * ✅ Handle scroll synchronization
     */
    handleScrollSync(event) {
        const sidebarScrollTop = event.target.scrollTop;
        const sidebarScrollHeight = event.target.scrollHeight;
        const sidebarClientHeight = event.target.clientHeight;
        
        // Calculate scroll percentage
        const scrollPercentage = sidebarScrollTop / (sidebarScrollHeight - sidebarClientHeight);
        
        // Get preview wrapper
        const previewWrapper = this.previewContainer.closest('.preview-section') || 
                              this.previewContainer.parentElement;
        
        if (previewWrapper) {
            // Calculate new position based on scroll percentage
            const maxOffset = Math.max(0, sidebarScrollTop - this.scrollSyncOffset);
            
            // Apply smooth transition
            previewWrapper.style.transform = `translateY(${maxOffset * 0.3}px)`;
            previewWrapper.style.transition = 'transform 0.1s ease-out';
        }
        
        // Debug info
        console.log(`📜 Scroll sync: ${Math.round(scrollPercentage * 100)}%`);
    }

    /**
     * ✅ Handle window scroll for better compatibility
     */
    handleWindowScroll() {
        // Get sidebar scroll info
        if (!this.sidebarContainer) return;
        
        const windowScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const previewWrapper = this.previewContainer.closest('.preview-section') || 
                              this.previewContainer.parentElement;
        
        if (previewWrapper && windowScrollTop > this.scrollSyncOffset) {
            // Keep preview visible when scrolling page
            const offset = Math.min(windowScrollTop - this.scrollSyncOffset, 200);
            previewWrapper.style.transform = `translateY(${offset * 0.2}px)`;
        }
    }

    /**
     * ✅ Toggle scroll sync on/off
     */
    toggleScrollSync(enabled = null) {
        if (enabled !== null) {
            this.isScrollSyncEnabled = enabled;
        } else {
            this.isScrollSyncEnabled = !this.isScrollSyncEnabled;
        }
        
        const previewWrapper = this.previewContainer.closest('.preview-section') || 
                              this.previewContainer.parentElement;
        
        if (!this.isScrollSyncEnabled && previewWrapper) {
            // Reset position when disabled
            previewWrapper.style.transform = 'translateY(0)';
            previewWrapper.style.position = 'static';
        } else if (this.isScrollSyncEnabled && previewWrapper) {
            // Re-apply sticky positioning
            this.applyStickyPositioning();
        }
        
        console.log(`📜 Scroll sync ${this.isScrollSyncEnabled ? 'enabled' : 'disabled'}`);
        return this.isScrollSyncEnabled;
    }

    /**
     * ✅ Add scroll sync control button to toolbar
     */
    addScrollSyncControl() {
        // Find toolbar
        const toolbar = document.querySelector('.toolbar-actions') || 
                       document.querySelector('.preview-toolbar');
        
        if (!toolbar) {
            console.warn('⚠️ Toolbar not found for scroll sync control');
            return;
        }
        
        // Create scroll sync toggle button
        const scrollSyncBtn = document.createElement('button');
        scrollSyncBtn.className = 'btn btn-outline-secondary';
        scrollSyncBtn.innerHTML = `
            <i class="fas fa-arrows-alt-v"></i>
            <span class="btn-text">Scroll Sync</span>
        `;
        scrollSyncBtn.title = 'Toggle preview scroll synchronization';
        
        // Style the button
        Object.assign(scrollSyncBtn.style, {
            marginLeft: '10px',
            padding: '8px 12px',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            background: this.isScrollSyncEnabled ? '#007bff' : 'white',
            color: this.isScrollSyncEnabled ? 'white' : '#495057',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.2s ease'
        });
        
        // Add click handler
        scrollSyncBtn.addEventListener('click', () => {
            const enabled = this.toggleScrollSync();
            
            // Update button appearance
            scrollSyncBtn.style.background = enabled ? '#007bff' : 'white';
            scrollSyncBtn.style.color = enabled ? 'white' : '#495057';
            scrollSyncBtn.title = enabled ? 'Disable scroll sync' : 'Enable scroll sync';
            
            // Show feedback
            this.showCopyFeedback(enabled ? '📜 Scroll sync enabled' : '📜 Scroll sync disabled');
        });
        
        // Add to toolbar
        toolbar.appendChild(scrollSyncBtn);
        
        console.log('✅ Scroll sync control added to toolbar');
    }

    /**
     * Enhanced render function - includes scroll sync setup
     */
    async render(template, settings = {}) {
        try {
            // Store current template and settings
            this.currentTemplate = template;
            this.lastUsedSettings = settings;
            
            console.log('🔍 Rendering template:', template?.meta?.name);
            console.log('🔍 With settings:', Object.keys(settings).length, 'variables');
            console.log('🔍 Render mode:', this.renderMode);
            
            // Get rendered content from Universal Engine
            const renderedContent = this.universalEngine.renderTemplate(template, settings);
            
            // Render based on current mode
            switch (this.renderMode) {
                case 'preview':
                    this.renderLivePreview(renderedContent);
                    break;
                case 'code':
                    this.renderCodePreview(renderedContent);
                    break;
                case 'export':
                    this.renderExportPreview(template, settings);
                    break;
                default:
                    this.renderLivePreview(renderedContent);
            }
            
            // ✅ Ensure scroll sync is applied after render
            setTimeout(() => {
                if (this.isScrollSyncEnabled) {
                    this.applyStickyPositioning();
                }
            }, 100);
            
            console.log('✅ Template rendered successfully with scroll sync');
            
        } catch (error) {
            console.error('❌ Preview rendering failed:', error);
            this.renderError(error);
        }
    }

    /**
 * Enhanced setup preview controls - FIX MULTIPLE EVENT LISTENERS
 */
setupPreviewControls() {
    // ✅ REMOVE EXISTING LISTENERS FIRST
    const responsiveControls = document.querySelectorAll('[data-preview-mode]');
    responsiveControls.forEach(control => {
        // ✅ Clone element to remove all event listeners
        const newControl = control.cloneNode(true);
        control.parentNode.replaceChild(newControl, control);
        
        // ✅ Add single event listener
        newControl.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const mode = e.target.getAttribute('data-preview-mode');
            if (mode && !this.isChangingMode) {
                this.setPreviewMode(mode);
            }
        }, { once: false, passive: false });
    });
    
    // ✅ SAME FOR RENDER CONTROLS
    const renderControls = document.querySelectorAll('[data-render-mode]');
    renderControls.forEach(control => {
        // ✅ Clone element to remove all event listeners
        const newControl = control.cloneNode(true);
        control.parentNode.replaceChild(newControl, control);
        
        // ✅ Add single event listener
        newControl.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const mode = e.target.getAttribute('data-render-mode');
            if (mode) {
                this.setRenderMode(mode);
            }
        }, { once: false, passive: false });
    });
    
    console.log('✅ Preview controls setup with clean event listeners');
    
    // ✅ Add scroll sync control after a delay (let DOM settle)
    setTimeout(() => {
        this.addScrollSyncControl();
    }, 500);
}

    // ✅ Enhanced window resize handler
    handleWindowResize() {
        if (this.isScrollSyncEnabled) {
            // Recalculate sticky positioning on resize
            setTimeout(() => {
                this.applyStickyPositioning();
            }, 100);
        }
    }

    // [REST OF THE EXISTING METHODS REMAIN THE SAME...]
    // renderLivePreview, renderCodePreview, etc. - unchanged

    /**
 * Render live preview - OPTIMIZED VERSION (No iframe recreation)
 */
renderLivePreview(renderedContent) {
    console.log('📱 renderLivePreview called - OPTIMIZED VERSION');
    
    // ✅ TRY TO REUSE EXISTING IFRAME
    let iframe = this.previewContainer.querySelector('iframe');
    
    if (!iframe) {
        // ✅ CREATE IFRAME ONLY ONCE
        console.log('🆕 Creating new iframe (first time only)');
        iframe = document.createElement('iframe');
        iframe.style.cssText = `
            width: 100%;
            height: 80vh;
            border: none;
            border-radius: 8px;
            background: white;
            transition: max-width 0.3s ease;
            display: block;
        `;
        
        // ✅ CLEAR CONTAINER AND ADD IFRAME
        this.previewContainer.innerHTML = '';
        this.previewContainer.appendChild(iframe);
        
        // ✅ ADD RESIZE OBSERVER FOR RESPONSIVE
        if (window.ResizeObserver) {
            const resizeObserver = new ResizeObserver(() => {
                this.updateIframeDimensions(iframe);
            });
            resizeObserver.observe(this.previewContainer);
        }
    } else {
        console.log('♻️ Reusing existing iframe (no recreation)');
    }
    
    // ✅ UPDATE IFRAME DIMENSIONS
    this.updateIframeDimensions(iframe);
    
    // ✅ UPDATE CONTENT WITHOUT RECREATING IFRAME
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    
    if (!iframeDoc) {
        console.error('❌ Cannot access iframe document');
        return;
    }
    
    // ✅ OPTIMIZED HTML TEMPLATE
    const optimizedHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Preview</title>
            <style>
                * { box-sizing: border-box; }
                body { 
                    margin: 0; 
                    padding: 20px; 
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
                    background: #fff;
                    line-height: 1.5;
                    min-height: 100vh;
                    overflow-x: hidden;
                    overflow-y: auto;
                }
                
                @media (max-width: 768px) {
                    body { 
                        padding: 15px; 
                        font-size: 14px; 
                    }
                }
                
                @media (max-width: 480px) {
                    body { 
                        padding: 10px; 
                        font-size: 13px;
                    }
                }
            </style>
        </head>
        <body>
            ${renderedContent}
        </body>
        </html>
    `;
    
    // ✅ USE requestAnimationFrame FOR SMOOTH UPDATE
    requestAnimationFrame(() => {
        try {
            iframeDoc.open();
            iframeDoc.write(optimizedHTML);
            iframeDoc.close();
            console.log('✅ Iframe content updated successfully');
        } catch (error) {
            console.error('❌ Failed to update iframe content:', error);
        }
    });
}

updateIframeDimensions(iframe) {
    if (!iframe) return;
    
    const dimensions = this.getPreviewDimensions();
    
    // ✅ SMOOTH DIMENSION UPDATE
    Object.assign(iframe.style, {
        maxWidth: dimensions.width,
        width: '100%',
        height: dimensions.height || '80vh',
        margin: '0 auto',
        display: 'block',
        transition: 'max-width 0.3s ease'
    });
    
    console.log(`📐 Iframe dimensions updated: ${dimensions.width} x ${dimensions.height}`);
}


    /**
     * Get preview dimensions - ORIGINAL WORKING VERSION
     */
  getPreviewDimensions() {
    // ✅ CACHE DIMENSIONS TO AVOID RECALCULATION
    if (!this.dimensionsCache) {
        this.dimensionsCache = {
            desktop: { width: '100%', height: '90vh' }, // ⬅️ FIXED HEIGHT
            tablet: { width: '768px', height: '90vh' },  // ⬅️ FIXED HEIGHT
            mobile: { width: '375px', height: '90vh' }   // ⬅️ FIXED HEIGHT
        };
    }
    
    return this.dimensionsCache[this.previewMode] || this.dimensionsCache.desktop;
}

    /**
     * Set preview mode - ORIGINAL WORKING VERSION + FIX
     */
    setPreviewMode(mode) {
    if (['desktop', 'tablet', 'mobile'].includes(mode)) {
        // ✅ PREVENT MULTIPLE RAPID CALLS
        if (this.isChangingMode) return;
        this.isChangingMode = true;
        
        console.log(`📱 Changing preview mode to: ${mode}`);
        
        this.previewMode = mode;
        
        // ✅ BATCH DOM UPDATES
        requestAnimationFrame(() => {
            // Update active button
            document.querySelectorAll('[data-preview-mode]').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelector(`[data-preview-mode="${mode}"]`)?.classList.add('active');
            
            // ✅ DEBOUNCED RENDER - avoid rapid re-renders
            if (this.renderTimeout) {
                clearTimeout(this.renderTimeout);
            }
            
            this.renderTimeout = setTimeout(() => {
                if (this.currentTemplate) {
                    this.render(this.currentTemplate, this.lastUsedSettings);
                }
                this.isChangingMode = false;
            }, 150); // ⬅️ 150ms debounce
            
            console.log(`✅ Preview mode changed to: ${mode}`);
        });
    }
}

    /**
     * Set render mode - ORIGINAL WORKING VERSION + FIX
     */
    setRenderMode(mode) {
        if (['preview', 'code', 'export'].includes(mode)) {
            console.log(`👁️ Changing render mode to: ${mode}`);
            
            this.renderMode = mode;
            
            // Update active button
            document.querySelectorAll('[data-render-mode]').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelector(`[data-render-mode="${mode}"]`)?.classList.add('active');
            
            // Re-render if template exists with current settings
            if (this.currentTemplate) {
                this.render(this.currentTemplate, this.lastUsedSettings);
            }
            
            console.log(`✅ Render mode changed to: ${mode}`);
        }
    }

    // [ALL OTHER EXISTING METHODS REMAIN UNCHANGED...]
    // Copy/paste all the existing methods: renderCodePreview, renderExportPreview,
    // createCodeSection, createCodeActions, createExportControls, copyToClipboard,
    // downloadLiquidFile, downloadShopifySection, showCopyFeedback, renderError,
    // clearPreview, refreshPreview, getPreviewMode, getRenderMode

    /**
     * Render code preview - ORIGINAL WORKING VERSION
     */
    renderCodePreview(renderedContent) {
        this.previewContainer.innerHTML = '';
        
        const codeWrapper = document.createElement('div');
        codeWrapper.className = 'code-preview-wrapper';
        codeWrapper.style.cssText = `
            padding: 20px;
            background: white;
            height: 100%;
            overflow: auto;
        `;
        
        // Create code section
        const codeSection = this.createCodeSection('Custom Liquid Code', renderedContent);
        codeWrapper.appendChild(codeSection);
        
        // Create action buttons
        const actionControls = this.createCodeActions(renderedContent);
        codeWrapper.appendChild(actionControls);
        
        this.previewContainer.appendChild(codeWrapper);
        
        console.log('✅ Code preview rendered');
    }

    /**
     * Render export preview - ORIGINAL WORKING VERSION
     */
    renderExportPreview(template, settings) {
        this.previewContainer.innerHTML = '';
        
        const exportWrapper = document.createElement('div');
        exportWrapper.className = 'export-preview-wrapper';
        exportWrapper.style.cssText = `
            padding: 20px;
            background: white;
            height: 100%;
            overflow: auto;
        `;
        
        // Generate Shopify code
        const shopifyCode = this.universalEngine.generateShopifySection(template, settings);
        
        // Create sections
        const codeSection = this.createCodeSection('Shopify Liquid Section', shopifyCode);
        const exportControls = this.createExportControls(shopifyCode);
        
        exportWrapper.appendChild(codeSection);
        exportWrapper.appendChild(exportControls);
        this.previewContainer.appendChild(exportWrapper);
        
        console.log('✅ Export preview rendered');
    }

    /**
     * Create code section - ORIGINAL WORKING VERSION
     */
    createCodeSection(title, code) {
        const section = document.createElement('div');
        section.className = 'code-section';
        section.style.cssText = `
            margin-bottom: 20px;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            overflow: hidden;
        `;
        
        // Header
        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 16px;
            background: #f8f9fa;
            border-bottom: 1px solid #dee2e6;
        `;
        
        const titleElement = document.createElement('h4');
        titleElement.textContent = title;
        titleElement.style.cssText = `
            margin: 0;
            font-size: 16px;
            font-weight: 600;
            color: #333;
        `;
        
        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy';
        copyButton.style.cssText = `
            padding: 6px 12px;
            background: #6c757d;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        `;
        copyButton.addEventListener('click', () => this.copyToClipboard(code));
        
        header.appendChild(titleElement);
        header.appendChild(copyButton);
        
        // Code content
        const codeElement = document.createElement('pre');
        codeElement.style.cssText = `
            margin: 0;
            padding: 16px;
            background: #f8f9fa;
            overflow: auto;
            max-height: 400px;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 13px;
            line-height: 1.4;
            color: #333;
        `;
        
        const codeContent = document.createElement('code');
        codeContent.textContent = code;
        codeElement.appendChild(codeContent);
        
        section.appendChild(header);
        section.appendChild(codeElement);
        
        return section;
    }

    /**
     * Create code action buttons - ORIGINAL WORKING VERSION
     */
    createCodeActions(code) {
        const wrapper = document.createElement('div');
        wrapper.style.cssText = `
            padding: 20px;
            text-align: center;
            background: #f8f9fa;
            border-radius: 6px;
        `;
        
        // Info text
        const info = document.createElement('p');
        info.innerHTML = '💡 <strong>Ready to use:</strong> Copy this code and paste it into your Shopify Custom Liquid section.';
        info.style.cssText = `
            margin-bottom: 15px;
            color: #495057;
            font-size: 14px;
        `;
        
        // Copy button
        const copyBtn = document.createElement('button');
        copyBtn.innerHTML = '📋 Copy All Code';
        copyBtn.style.cssText = `
            margin: 0 5px;
            padding: 10px 20px;
            background: #6c757d;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        `;
        copyBtn.addEventListener('click', () => this.copyToClipboard(code));
        
        // Download button
        const downloadBtn = document.createElement('button');
        downloadBtn.innerHTML = '💾 Download as .liquid';
        downloadBtn.style.cssText = `
            margin: 0 5px;
            padding: 10px 20px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        `;
        downloadBtn.addEventListener('click', () => this.downloadLiquidFile(code));
        
        wrapper.appendChild(info);
        wrapper.appendChild(copyBtn);
        wrapper.appendChild(downloadBtn);
        
        return wrapper;
    }

    /**
     * Create export controls - ORIGINAL WORKING VERSION
     */
    createExportControls(code) {
        const wrapper = document.createElement('div');
        wrapper.style.cssText = `
            padding: 20px;
            text-align: center;
            background: #f8f9fa;
            border-radius: 6px;
        `;
        
        const downloadBtn = document.createElement('button');
        downloadBtn.innerHTML = '💾 Download Section File';
        downloadBtn.style.cssText = `
            margin: 0 5px;
            padding: 10px 20px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        `;
        downloadBtn.addEventListener('click', () => this.downloadShopifySection(code));
        
        const copyBtn = document.createElement('button');
        copyBtn.innerHTML = '📋 Copy All Code';
        copyBtn.style.cssText = `
            margin: 0 5px;
            padding: 10px 20px;
            background: #6c757d;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        `;
        copyBtn.addEventListener('click', () => this.copyToClipboard(code));
        
        wrapper.appendChild(downloadBtn);
        wrapper.appendChild(copyBtn);
        
        return wrapper;
    }

    /**
     * Copy to clipboard - ORIGINAL WORKING VERSION
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showCopyFeedback('✅ Copied to clipboard!');
        } catch (error) {
            console.error('Copy failed:', error);
            
            // Fallback method
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            this.showCopyFeedback('✅ Copied to clipboard!');
        }
    }

    /**
     * Download liquid file - ORIGINAL WORKING VERSION
     */
    downloadLiquidFile(code) {
        const fileName = `${this.currentTemplate?.meta?.name || 'custom-section'}.liquid`
            .toLowerCase()
            .replace(/\s+/g, '-');
        
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
        
        this.showCopyFeedback(`💾 Downloaded: ${fileName}`);
        console.log(`💾 Downloaded liquid file: ${fileName}`);
    }

    /**
     * Download Shopify section - ORIGINAL WORKING VERSION
     */
    downloadShopifySection(code) {
        const fileName = `${this.currentTemplate?.meta?.name || 'section'}.liquid`
            .toLowerCase()
            .replace(/\s+/g, '-');
        
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
        
        this.showCopyFeedback(`💾 Downloaded: ${fileName}`);
        console.log(`💾 Downloaded: ${fileName}`);
    }

    /**
     * Show copy feedback - ORIGINAL WORKING VERSION
     */
    showCopyFeedback(message) {
        // Remove existing feedback
        const existing = document.querySelector('.copy-feedback');
        if (existing) existing.remove();
        
        // Create feedback element
        const feedback = document.createElement('div');
        feedback.className = 'copy-feedback';
        feedback.textContent = message;
        
        // Style and position
        Object.assign(feedback.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: '#4CAF50',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '6px',
            zIndex: '10000',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        });
        
        document.body.appendChild(feedback);
        
        // Remove after 2 seconds
        setTimeout(() => {
            feedback.remove();
        }, 2000);
    }

    /**
     * Render error - ORIGINAL WORKING VERSION
     */
    renderError(error) {
        this.previewContainer.innerHTML = `
            <div class="preview-error" style="
                text-align: center;
                padding: 40px 20px;
                background: #f8f9fa;
                border: 2px dashed #dc3545;
                border-radius: 8px;
                margin: 20px;
                color: #721c24;
            ">
                <div class="error-icon" style="font-size: 48px; margin-bottom: 16px;">⚠️</div>
                <h3 style="color: #721c24; margin-bottom: 12px;">Template Render Error</h3>
                <p style="margin-bottom: 12px;"><strong>Error:</strong> ${error.message}</p>
                <pre style="
                    background: #f5c6cb;
                    padding: 12px;
                    border-radius: 4px;
                    text-align: left;
                    font-size: 12px;
                    overflow: auto;
                    max-height: 200px;
                    margin-bottom: 16px;
                ">${error.stack || 'No stack trace available'}</pre>
                <button onclick="location.reload()" style="
                    padding: 10px 20px;
                    background: #007bff;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                ">
                    Reload Page
                </button>
            </div>
        `;
    }

    /**
     * Clear preview - ORIGINAL WORKING VERSION
     */
    clearPreview() {
        if (this.previewContainer) {
            this.previewContainer.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #6c757d;">
                    Select a template to see preview
                </div>
            `;
        }
    }

    /**
     * Refresh preview - ORIGINAL WORKING VERSION
     */
    refreshPreview() {
        if (this.currentTemplate) {
            this.render(this.currentTemplate, this.lastUsedSettings);
            console.log('🔄 Preview refreshed');
        }
    }

    // Getters - ORIGINAL WORKING VERSION
    getPreviewMode() {
        return this.previewMode;
    }

    getRenderMode() {
        return this.renderMode;
    }
}

// Export for use in other modules
window.PreviewRenderer = PreviewRenderer;
console.log('✅ PreviewRenderer class loaded - WITH SCROLL SYNC FEATURE');