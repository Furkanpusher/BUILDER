/**
 * ZERA Form Builder - Dynamic Form Generation
 * FIXED VERSION - toggleSection global function düzeltildi
 */
class FormBuilder {
    constructor() {
        this.formContainer = null;
        this.currentTemplate = null;
        
        // ✅ Global function'ları hemen tanımla
        this.setupGlobalFunctions();
        
        console.log('🎨 Form Builder initialized');
    }

    /**
     * Initialize form builder
     */
    init() {
        this.formContainer = document.getElementById('formContainer');
        
        if (!this.formContainer) {
            console.warn('⚠️ Form container not found: #formContainer');
            return Promise.reject('Form container not found');
        }
        
        console.log('✅ Form Builder ready');
        return Promise.resolve();
    }

    /**
 * ✅ Setup global functions - FIXED VERSION
 */
setupGlobalFunctions() {
       window.updateImagePreview = function(input) {
        const preview = input.parentElement.querySelector('.image-preview');
        if (preview) {
            if (input.value) {
                preview.innerHTML = `<img src="${input.value}" alt="Preview" style="max-width: 100px; height: 60px; object-fit: cover; border-radius: 4px; border: 1px solid #ddd;">`;
            } else {
                preview.innerHTML = '<div style="width: 100px; height: 60px; background: #f8f9fa; border: 2px dashed #dee2e6; display: flex; align-items: center; justify-content: center; border-radius: 4px; color: #6c757d; font-size: 0.75rem;">No Image</div>';
            }
        }
    };
    
    
    window.toggleSection = function(header) {
    console.log('🔄 Toggle section clicked');
    
    const content = header.nextElementSibling;
    const arrow = header.querySelector('.form-section-arrow');
    const title = header.querySelector('.form-section-title');
    
    if (!content || !arrow) {
        console.error('❌ Content or arrow not found');
        return;
    }
    
    const isCurrentlyVisible = content.style.display !== 'none' && content.offsetHeight > 0;
    
    if (isCurrentlyVisible) {
        // ✅ CLOSE SECTION
        content.style.display = 'none';
        arrow.style.transform = 'rotate(-90deg)';
        arrow.style.color = '#666';
        header.classList.remove('active');
        header.style.borderLeftColor = 'transparent';
        
        console.log('📁 Section CLOSED:', title?.textContent);
    } else {
        // ✅ OPEN SECTION
        content.style.display = 'block';
        arrow.style.transform = 'rotate(0deg)';
        arrow.style.color = '#007bff';
        header.classList.add('active');
        header.style.borderLeftColor = '#007bff';
        
        console.log('📂 Section OPENED:', title?.textContent);
    }
    
    // ✅ TRIGGER CUSTOM EVENT
    header.dispatchEvent(new CustomEvent('sectionToggled', {
        detail: { isOpen: !isCurrentlyVisible, sectionTitle: title?.textContent }
    }));
};
    
    // ✅ ENHANCED range display
   window.updateRangeDisplay = function(input, unit) {
    const display = input.parentElement.querySelector('.range-value');
    if (display) {
        display.textContent = input.value + (unit || '');
    }
    
    // ✅ ADD VISUAL FEEDBACK
    input.style.background = `linear-gradient(to right, #007bff 0%, #007bff ${((input.value - input.min) / (input.max - input.min)) * 100}%, #ddd ${((input.value - input.min) / (input.max - input.min)) * 100}%, #ddd 100%)`;
};
    
    // ✅ ENHANCED color display
    window.updateColorDisplay = function(input) {
    const display = input.parentElement.querySelector('.color-display');
    if (display) {
        display.textContent = input.value.toUpperCase();
        display.style.background = input.value;
        display.style.color = input.value === '#000000' ? '#ffffff' : '#000000';
    }
};
    
    console.log('✅ FIXED global form functions defined');
}
generateInputField(key, config) {
    const value = this.settings[key] || config.default || '';
    const inputId = `input-${key}`;
    
    let inputHTML = '';
    
    switch (config.type) {
        case 'text':
            inputHTML = `
                <input type="text" 
                       id="${inputId}" 
                       class="form-control" 
                       value="${value}" 
                       placeholder="${config.placeholder || ''}"
                       onchange="window.templateCustomizer.updateSetting('${key}', this.value)">
            `;
            break;
            
        case 'textarea':
            inputHTML = `
                <textarea id="${inputId}" 
                         class="form-control textarea-input" 
                         placeholder="${config.placeholder || ''}"
                         onchange="window.templateCustomizer.updateSetting('${key}', this.value)">${value}</textarea>
            `;
            break;
            
        case 'color':
            inputHTML = `
                <div class="color-input-group">
                    <input type="color" 
                           id="${inputId}" 
                           class="form-color" 
                           value="${value}" 
                           onchange="window.templateCustomizer.updateSetting('${key}', this.value); updateColorDisplay(this)">
                    <span class="color-display">${value.toUpperCase()}</span>
                </div>
            `;
            break;
            
        case 'range':
            inputHTML = `
                <div class="range-input-group">
                    <input type="range" 
                           id="${inputId}" 
                           class="form-range" 
                           min="${config.min || 0}" 
                           max="${config.max || 100}" 
                           step="${config.step || 1}" 
                           value="${value}" 
                           onchange="window.templateCustomizer.updateSetting('${key}', this.value); updateRangeDisplay(this, '${config.unit || ''}')">
                    <span class="range-value">${value}${config.unit || ''}</span>
                </div>
            `;
            break;
            
        case 'select':
            let optionsHTML = '';
            if (config.options) {
                // ✅ FIX: Handle both array and object options correctly
                if (Array.isArray(config.options)) {
                    config.options.forEach(option => {
                        const selected = option.value === value ? 'selected' : '';
                        optionsHTML += `<option value="${option.value}" ${selected}>${option.label}</option>`;
                    });
                } else {
                    // ✅ FIX: Handle object options (your template format)
                    Object.entries(config.options).forEach(([optValue, optLabel]) => {
                        const selected = optValue === value ? 'selected' : '';
                        optionsHTML += `<option value="${optValue}" ${selected}>${optLabel}</option>`;
                    });
                }
            }
            inputHTML = `
                <select id="${inputId}" 
                        class="form-control select-input" 
                        onchange="window.templateCustomizer.updateSetting('${key}', this.value); if(window.updateImagePlacement && '${key}' === 'image_placement') window.updateImagePlacement(this.value);">
                    ${optionsHTML}
                </select>
            `;
            break;
            
        case 'checkbox':
            const checked = value ? 'checked' : '';
            inputHTML = `
                <div class="form-check">
                    <input type="checkbox" 
                           id="${inputId}" 
                           class="form-check-input" 
                           ${checked} 
                           onchange="window.templateCustomizer.updateSetting('${key}', this.checked)">
                    <label for="${inputId}" class="form-check-label">${config.label}</label>
                </div>
            `;
            break;
            
        case 'image':
            inputHTML = `
                <div class="image-input-group">
                    <input type="url" 
                           id="${inputId}" 
                           class="form-control image-input" 
                           value="${value}" 
                           placeholder="${config.placeholder || 'https://cdn.shopify.com/s/files/1/...'}"
                           onchange="window.templateCustomizer.updateSetting('${key}', this.value); updateImagePreview(this)">
                    <div class="image-preview" style="margin-top: 8px;">
                        ${value ? `<img src="${value}" alt="Preview" style="max-width: 100px; height: 60px; object-fit: cover; border-radius: 4px; border: 1px solid #ddd;">` : '<div style="width: 100px; height: 60px; background: #f8f9fa; border: 2px dashed #dee2e6; display: flex; align-items: center; justify-content: center; border-radius: 4px; color: #6c757d; font-size: 0.75rem;">No Image</div>'}
                    </div>
                </div>
            `;
            break;
            
        default:
            inputHTML = `
                <input type="text" 
                       id="${inputId}" 
                       class="form-control" 
                       value="${value}" 
                       onchange="window.templateCustomizer.updateSetting('${key}', this.value)">
            `;
    }
    
    return inputHTML;
}
    /**
     * Generate complete form HTML
     */
    generateForm(customization, sections, settings) {
        console.log('🔨 Generating form...', { customization, sections, settings });
        
        if (!customization) {
            return '<div class="form-placeholder">No customization options available</div>';
        }

        // Form CSS styles
        let formHTML = this.getFormStyles();
        
        // Form sections container
        formHTML += '<div class="form-sections">';
        
        let isFirstSection = true;
        
        // Generate sections from customization
        Object.entries(customization).forEach(([categoryName, fields]) => {
            const sectionTitle = this.formatCategoryName(categoryName);
            const isOpen = isFirstSection; // First section open by default
            
            formHTML += this.generateSectionHTML(sectionTitle, fields, settings, isOpen);
            isFirstSection = false;
        });
        
        formHTML += '</div>';
        
        // ❌ JavaScript'i burada ekleme - zaten global'de tanımlı
        // formHTML += this.getSectionToggleScript();
        
        return formHTML;
    }

    /**
     * Generate form styles
     */
    getFormStyles() {
        return `
            <style>
            .form-sections {
                max-width: 100%;
            }
            .form-section {
                margin-bottom: 15px;
            }
            .form-section-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 15px;
                background: #f8f9fa;
                border: 1px solid #dee2e6;
                border-radius: 6px;
                cursor: pointer;
                user-select: none;
                margin-bottom: 10px;
                transition: all 0.2s ease;
            }
            .form-section-header:hover {
                background: #e9ecef;
                transform: translateX(2px);
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .form-section-header.active {
                background: #e9ecef;
            }
            .form-section-title {
                margin: 0;
                font-size: 1.1rem;
                font-weight: 600;
                color: #495057;
            }
            .form-section-arrow {
                font-size: 0.8rem;
                color: #6c757d;
                transition: transform 0.3s ease;
            }
            .form-section-content {
                padding: 0 5px;
                margin-bottom: 20px;
            }
            .form-group {
                margin-bottom: 15px;
            }
            .form-label {
                display: block;
                margin-bottom: 5px;
                font-weight: 500;
                color: #495057;
            }
            .form-control {
                width: 100%;
                padding: 8px 12px;
                border: 1px solid #ced4da;
                border-radius: 4px;
                font-size: 14px;
                transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
            }
            .form-control:focus {
                border-color: #80bdff;
                outline: 0;
                box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
            }
            .range-input-group {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .form-range {
                flex: 1;
            }
            .range-value {
                min-width: 60px;
                text-align: center;
                font-weight: 500;
                color: #495057;
            }
            .color-input-group {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .form-color {
                width: 50px;
                height: 40px;
                border: 1px solid #ced4da;
                border-radius: 4px;
                cursor: pointer;
            }
            .color-display {
                font-family: monospace;
                font-weight: 500;
                color: #495057;
            }
            .form-check {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .form-check-input {
                width: auto;
            }
            </style>
        `;
    }

    /**
     * Generate section HTML
     */
    generateSectionHTML(title, fields, settings, isOpen = false) {
        const displayStyle = isOpen ? 'block' : 'none';
        const arrowTransform = isOpen ? 'rotate(0deg)' : 'rotate(-90deg)';
        const activeClass = isOpen ? 'active' : '';
        
        let html = `
            <div class="form-section">
                <div class="form-section-header ${activeClass}" onclick="toggleSection(this)">
                    <h3 class="form-section-title">${title}</h3>
                    <span class="form-section-arrow" style="transform: ${arrowTransform};">▼</span>                </div>
                <div class="form-section-content" style="display: ${displayStyle};">
        `;
        
        // Generate fields
        Object.entries(fields).forEach(([fieldName, fieldConfig]) => {
            const currentValue = settings[fieldName] || fieldConfig.default || '';
            html += this.generateFieldHTML(fieldName, fieldConfig, currentValue);
        });
        
        html += `
                </div>
            </div>
        `;
        
        return html;
    }

    /**
     * Generate field HTML based on type
     */
    generateFieldHTML(fieldName, fieldConfig, currentValue) {
        const { type, label, placeholder, min, max, step, unit, options, default: defaultValue } = fieldConfig;
        const value = currentValue !== undefined ? currentValue : defaultValue;
        
        let html = `<div class="form-group">`;
        html += `<label class="form-label" for="${fieldName}">${label || this.formatFieldName(fieldName)}</label>`;
        
        switch (type) {
            case 'text':
                html += `<input type="text" class="form-control" id="${fieldName}" name="${fieldName}" value="${value || ''}" placeholder="${placeholder || ''}">`;
                break;
                
            case 'textarea':
                html += `<textarea class="form-control" id="${fieldName}" name="${fieldName}" rows="3" placeholder="${placeholder || ''}">${value || ''}</textarea>`;
                break;
                
            case 'number':
                html += `<input type="number" class="form-control" id="${fieldName}" name="${fieldName}" value="${value || 0}" min="${min || 0}" max="${max || 100}" step="${step || 1}">`;
                break;
                
            case 'range':
                html += `
                    <div class="range-input-group">
                        <input type="range" class="form-control form-range" id="${fieldName}" name="${fieldName}" 
                               value="${value || min || 0}" min="${min || 0}" max="${max || 100}" step="${step || 1}"
                               oninput="updateRangeDisplay(this, '${unit || ''}')">
                        <span class="range-value">${value || min || 0}${unit || ''}</span>
                    </div>
                `;
                break;
                
            case 'color':
                html += `
                    <div class="color-input-group">
                        <input type="color" class="form-color" id="${fieldName}" name="${fieldName}" 
                               value="${value || '#000000'}" oninput="updateColorDisplay(this)">
                        <span class="color-display">${(value || '#000000').toUpperCase()}</span>
                    </div>
                `;
                break;
                
            case 'checkbox':
                const checked = value ? 'checked' : '';
                html += `
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="${fieldName}" name="${fieldName}" ${checked}>
                        <label class="form-check-label" for="${fieldName}">${label || this.formatFieldName(fieldName)}</label>
                    </div>
                `;
                break;
                
            case 'select':
                html += `<select class="form-control" id="${fieldName}" name="${fieldName}">`;
                
                if (options) {
                    const optionsArray = Array.isArray(options) ? options : Object.entries(options);
                    
                    optionsArray.forEach(([optValue, optLabel]) => {
                        const optionValue = typeof optValue === 'object' ? optValue.value : optValue;
                        const optionLabel = typeof optValue === 'object' ? optValue.label : (optLabel || optValue);
                        const selected = value === optionValue ? 'selected' : '';
                        
                        html += `<option value="${optionValue}" ${selected}>${optionLabel}</option>`;
                    });
                } else {
                    html += `<option>No options available</option>`;
                }
                
                html += `</select>`;
                break;
                
            case 'url':
                html += `<input type="url" class="form-control" id="${fieldName}" name="${fieldName}" value="${value || ''}" placeholder="${placeholder || 'https://example.com'}">`;
                break;
                
            default:
                html += `<input type="text" class="form-control" id="${fieldName}" name="${fieldName}" value="${value || ''}">`;
                console.warn(`⚠️ Unknown field type: ${type} for field: ${fieldName}`);
        }
        
        html += `</div>`;
        return html;
    }

    /**
     * ❌ SİLDİK - JavaScript artık generateForm()'da eklenmez
     * getSectionToggleScript() method'u kaldırıldı
     */

    /**
     * Get form data from inputs
     */
    getFormData() {
        if (!this.formContainer) {
            console.warn('⚠️ No form container found');
            return {};
        }
        
        const data = {};
        const inputs = this.formContainer.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            if (input.name) {
                if (input.type === 'checkbox') {
                    data[input.name] = input.checked;
                } else if (input.type === 'number' || input.type === 'range') {
                    data[input.name] = parseFloat(input.value) || 0;
                } else {
                    data[input.name] = input.value;
                }
            }
        });
        
        console.log('📊 Form data collected:', Object.keys(data).length, 'fields');
        return data;
    }

    /**
     * Set form data to inputs
     */
    setFormData(data) {
        if (!this.formContainer || !data) return;
        
        Object.entries(data).forEach(([name, value]) => {
            const input = this.formContainer.querySelector(`[name="${name}"]`);
            if (input) {
                if (input.type === 'checkbox') {
                    input.checked = Boolean(value);
                } else {
                    input.value = value;
                }
                
                // Update displays for special inputs
                if (input.type === 'range') {
                    const display = input.parentElement.querySelector('.range-value');
                    if (display) {
                        const unit = input.dataset.unit || '';
                        display.textContent = value + unit;
                    }
                } else if (input.type === 'color') {
                    const display = input.parentElement.querySelector('.color-display');
                    if (display) {
                        display.textContent = value.toUpperCase();
                    }
                }
            }
        });
        
        console.log('📝 Form data set:', Object.keys(data).length, 'fields');
    }

    /**
     * Clear form
     */
    clearForm() {
        if (this.formContainer) {
            this.formContainer.innerHTML = '';
            console.log('🗑️ Form cleared');
        }
    }

    /**
     * Show loading state
     */
    showLoading(message = 'Loading form...') {
        if (this.formContainer) {
            this.formContainer.innerHTML = `
                <div class="form-loading" style="text-align: center; padding: 40px; color: #6c757d;">
                    <div style="font-size: 24px; margin-bottom: 10px;">⏳</div>
                    <p>${message}</p>
                </div>
            `;
        }
    }

    /**
     * Show error state
     */
    showError(message) {
        if (this.formContainer) {
            this.formContainer.innerHTML = `
                <div class="form-error" style="text-align: center; padding: 40px; color: #dc3545;">
                    <div style="font-size: 24px; margin-bottom: 10px;">⚠️</div>
                    <p>${message}</p>
                </div>
            `;
        }
    }

    /**
     * Format category name for display
     */
    formatCategoryName(name) {
        return name.split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    /**
     * Format field name for display
     */
    formatFieldName(name) {
        return name.split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    /**
     * Validate form data
     */
    validateForm() {
        if (!this.formContainer) return { valid: false, errors: ['No form container'] };
        
        const errors = [];
        const requiredInputs = this.formContainer.querySelectorAll('input[required], select[required], textarea[required]');
        
        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                errors.push(`${input.name || 'Field'} is required`);
            }
        });
        
        const emailInputs = this.formContainer.querySelectorAll('input[type="email"]');
        emailInputs.forEach(input => {
            if (input.value && !this.isValidEmail(input.value)) {
                errors.push(`${input.name || 'Email'} is not valid`);
            }
        });
        
        const urlInputs = this.formContainer.querySelectorAll('input[type="url"]');
        urlInputs.forEach(input => {
            if (input.value && !this.isValidUrl(input.value)) {
                errors.push(`${input.name || 'URL'} is not valid`);
            }
        });
        
        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Utility: Check if email is valid
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Utility: Check if URL is valid
     */
    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Get form statistics
     */
    getFormStats() {
        if (!this.formContainer) return null;
        
        const inputs = this.formContainer.querySelectorAll('input, textarea, select');
        const sections = this.formContainer.querySelectorAll('.form-section');
        
        return {
            totalInputs: inputs.length,
            totalSections: sections.length,
            inputTypes: Array.from(inputs).reduce((acc, input) => {
                const type = input.type || input.tagName.toLowerCase();
                acc[type] = (acc[type] || 0) + 1;
                return acc;
            }, {})
        };
    }
}

// Export for global use
window.FormBuilder = FormBuilder;
console.log('✅ FormBuilder class loaded - FIXED GLOBAL FUNCTIONS');