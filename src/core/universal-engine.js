/**
 * ZERA Universal Template Engine
 * Processes any Liquid template with dynamic variables
 */
class UniversalEngine {
    constructor() {
        this.currentTemplate = null;
        this.formBuilder = null;
        this.previewRenderer = null;
        this.availableTemplates = [];
        
        console.log('🚀 Universal Engine initialized');
    }

    // ✅ INITIALIZE
    async init() {
        console.log('🚀 Universal Engine initializing...');
        await this.loadAvailableTemplates();
        return Promise.resolve();
    }

    // ✅ LOAD AVAILABLE TEMPLATES
    async loadAvailableTemplates() {
        try {
            // For now, hardcode available templates
            this.availableTemplates = [
                { id: 'how-to-use', name: 'How to Use Section', path: 'src/templates/how-to-use/template.json' }
            ];
            
            console.log('📂 Available templates loaded:', this.availableTemplates.length);
            return this.availableTemplates;
            
        } catch (error) {
            console.error('❌ Failed to load available templates:', error);
            return [];
        }
    }

    // ✅ LOAD TEMPLATE
    async loadTemplate(templateId) {
        try {
            const templatePath = `src/templates/${templateId}/template.json`;
            console.log(`📥 Loading template: ${templateId} from ${templatePath}`);
            
            const response = await fetch(templatePath);
            if (!response.ok) {
                throw new Error(`Template not found: ${templateId} (${response.status})`);
            }
            
            const templateData = await response.json();
            this.currentTemplate = templateData;
            
            console.log('✅ Template loaded successfully:', templateData.meta?.name);
            return templateData;
            
        } catch (error) {
            console.error(`❌ Failed to load template ${templateId}:`, error);
            throw error;
        }
    }

    // ✅ GENERATE OUTPUT (Ana metod)
    async generateOutput(templateData, settings = {}) {
    if (!templateData) {
        throw new Error('No template data provided');
    }
    
    try {
        // Merge template default settings with current settings
        const mergedSettings = { 
            ...templateData.settings, 
            ...settings 
        };
        
        console.log('🔄 Processing template with settings:', mergedSettings);
        
        // Process liquid template
        const processedHTML = this.processLiquidTemplate(templateData.liquid.html, mergedSettings);
        const processedCSS = this.processLiquidTemplate(templateData.liquid.css, mergedSettings);
        const processedJS = templateData.liquid.javascript || '';
        
        // ✅ YENİ: Temiz combined format
        let combinedCode = processedHTML;
        
        // CSS'i ayrı blok olarak ekle
        if (processedCSS.trim()) {
            combinedCode += '\n\n<style>\n' + processedCSS + '\n</style>';
        }
        
        // JavaScript'i ayrı blok olarak ekle
        if (processedJS.trim()) {
            combinedCode += '\n\n<script>\n' + processedJS + '\n</script>';
        }
        
        return {
            html: processedHTML,
            css: processedCSS,
            javascript: processedJS,
            combined: combinedCode  // ✅ Temiz format
        };
        
    } catch (error) {
        console.error('❌ Generate output error:', error);
        throw error;
    }
}

renderTemplate(template, settings) {
    try {
        let htmlContent = template.liquid.html;
        let cssContent = template.liquid.css || '';
        let jsContent = template.liquid.javascript || ''; // ✅ JavaScript support ekle

        // Replace all variables
        Object.keys(settings).forEach(key => {
            const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
            htmlContent = htmlContent.replace(regex, settings[key]);
            cssContent = cssContent.replace(regex, settings[key]);
        });

        // ✅ JavaScript'i de render et
        const result = `
            <style>${cssContent}</style>
            <div class="template-wrapper">
                ${htmlContent}
            </div>
            ${jsContent ? `<script>${jsContent}</script>` : ''}
        `;

        return result;
    } catch (error) {
        console.error('❌ Template rendering failed:', error);
        return `<div class="error">Template rendering failed: ${error.message}</div>`;
    }
}

    // ✅ PROCESS LIQUID TEMPLATE (Variable replacement)
    processLiquidTemplate(template, settings) {
        if (!template) return '';
        
        let processed = template;
        
        // Replace {{variable}} with actual values
        for (const [key, value] of Object.entries(settings)) {
            const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
            processed = processed.replace(regex, value);
        }
        
        console.log(`🔧 Processed template: ${Object.keys(settings).length} variables replaced`);
        return processed;
    }

    // ✅ GENERATE CODE (for code view)
    generateCode(template, settings) {
        return this.generateOutput(template, settings);
    }

    // ✅ GENERATE SHOPIFY SECTION (for export)
    generateShopifySection(template, settings) {
        const output = this.generateOutput(template, settings);
        
        return `{% comment %}
Generated by ZERA Liquid Template Customizer
Template: ${template.meta?.name || 'Unknown'}
{% endcomment %}

<div class="section-${template.meta?.name?.toLowerCase().replace(/\s+/g, '-') || 'custom'}">
${output.html}
</div>

<style>
${output.css}
</style>

${output.javascript ? `<script>${output.javascript}</script>` : ''}

{% schema %}
{
  "name": "${template.meta?.name || 'Custom Section'}",
  "settings": []
}
{% endschema %}`;
    }

    // ✅ EXPORT SHOPIFY CODE
    exportShopifyCode() {
        if (!this.currentTemplate) {
            return '/* No template selected */';
        }
        
        return this.generateShopifySection(this.currentTemplate, {});
    }

    // ✅ GET CURRENT TEMPLATE
    getCurrentTemplate() {
        return this.currentTemplate;
    }

    // ✅ SET CURRENT TEMPLATE
    setCurrentTemplate(templateData) {
        this.currentTemplate = templateData;
        console.log('📝 Current template set:', templateData.meta?.name);
    }

    // ✅ GET AVAILABLE TEMPLATES
    getAvailableTemplates() {
        return this.availableTemplates;
    }

    // ✅ VALIDATE TEMPLATE
    validateTemplate(templateData) {
        const required = ['meta', 'liquid', 'customization', 'settings'];
        const missing = required.filter(key => !templateData[key]);
        
        if (missing.length > 0) {
            throw new Error(`Template validation failed. Missing: ${missing.join(', ')}`);
        }
        
        console.log('✅ Template validation passed');
        return true;
    }

    // ✅ GET TEMPLATE CUSTOMIZATION
    getTemplateCustomization(templateData) {
        return templateData?.customization || {};
    }

    // ✅ GET TEMPLATE SETTINGS
    getTemplateSettings(templateData) {
        return templateData?.settings || {};
    }

    // ✅ RESET ENGINE
    reset() {
        this.currentTemplate = null;
        console.log('🔄 Engine reset');
    }
}

// ✅ EXPORT TO WINDOW
window.UniversalEngine = UniversalEngine;
console.log('✅ UniversalEngine class loaded')