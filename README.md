# ZERA Liquid Template Customizer 🎨

> **Create stunning Shopify sections with zero coding required**

A powerful visual editor for creating and customizing Shopify Liquid templates. Built with vanilla JavaScript, this tool provides an intuitive interface for designing responsive e-commerce sections without writing a single line of code.

![ZERA Preview](assets/preview-screenshot.png)

## ✨ Features

### 🎯 **Core Features**
- **Visual Template Editor** - Real-time WYSIWYG customization
- **Universal Template Engine** - Support for any Liquid template structure
- **Responsive Preview** - Desktop, tablet, and mobile previews
- **Code Generation** - Export ready-to-use Shopify sections
- **Auto-Save** - Never lose your work with automatic session persistence
- **Professional UI** - Clean, modern interface with keyboard shortcuts

### 🛠️ **Template Features**
- **Dynamic Forms** - Auto-generated forms based on template configuration
- **Live Preview** - See changes instantly as you type
- **Color Picker** - Visual color selection with hex/rgb support
- **Range Sliders** - Intuitive controls for numeric values
- **Image Upload** - Support for product images and backgrounds
- **Typography Controls** - Font families, sizes, weights, and spacing

### 📱 **Responsive Design**
- **Mobile-First** - Optimized for all screen sizes
- **Touch-Friendly** - Perfect for tablet editing
- **Keyboard Navigation** - Full accessibility support
- **Cross-Browser** - Works on Chrome, Firefox, Safari, Edge

## 🚀 Quick Start

### Prerequisites
- Web server (Apache, Nginx, or local development server)
- Modern web browser (Chrome 88+, Firefox 85+, Safari 14+)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/zera-team/liquid-template-customizer.git
   cd liquid-template-customizer
   ```

2. **Start a local server**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

### Using with XAMPP

1. **Copy to htdocs**
   ```bash
   cp -r liquid-template-customizer /path/to/xampp/htdocs/
   ```

2. **Access via browser**
   ```
   http://localhost/liquid-template-customizer
   ```

## 📖 Usage Guide

### Creating Your First Template

1. **Select a Template** - Choose from the dropdown in the sidebar
2. **Customize Settings** - Use the auto-generated form controls
3. **Preview Changes** - See real-time updates in the preview area
4. **Export Code** - Download ready-to-use Shopify section files

### Understanding Template Structure

```javascript
{
  "meta": {
    "name": "Template Name",
    "type": "liquid-template",
    "category": "category",
    "version": "1.0"
  },
  "liquid": {
    "html": "<!-- Liquid HTML template -->",
    "css": "/* CSS styles */",
    "javascript": "// Optional JavaScript"
  },
  "customization": {
    "basic": {
      "field_name": {
        "type": "text|color|range|select|checkbox",
        "label": "Display Name",
        "default": "default_value"
      }
    }
  },
  "settings": {
    // Default values for all customization fields
  }
}
```

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + 1` | Switch to Preview mode |
| `Ctrl + 2` | Switch to Code mode |
| `Ctrl + 3` | Switch to Export mode |
| `D` | Desktop preview |
| `T` | Tablet preview |
| `M` | Mobile preview |
| `Ctrl + S` | Save template |
| `Ctrl + R` | Refresh preview |
| `Ctrl + Z` | Reset form |
| `?` | Show keyboard shortcuts |

## 🏗️ Architecture

### Core Components

```
src/
├── core/
│   ├── universal-engine.js    # Template processing engine
│   ├── form-builder.js        # Dynamic form generation
│   ├── preview-renderer.js    # Live preview rendering
│   └── app.js                 # Main application controller
├── styles/
│   ├── main.css              # Main application styles
│   └── templates.css         # Template-specific styles
├── utils/
│   └── helpers.js            # Utility functions
└── templates/
    └── how-to-use/
        └── template.json     # Template configuration
```

### Component Responsibilities

#### **UniversalEngine**
- Processes Liquid templates with custom variables
- Generates HTML, CSS, and JavaScript code
- Creates Shopify-compatible section files

#### **FormBuilder** 
- Generates dynamic forms from template configuration
- Handles different input types (text, color, range, etc.)
- Manages form validation and default values

#### **PreviewRenderer**
- Renders live previews with current settings
- Manages responsive preview modes
- Handles error states and loading indicators

#### **App**
- Orchestrates all components
- Manages application state and events
- Handles auto-save and session restoration

## 🎨 Creating Custom Templates

### Template Configuration

Create a new template by adding a folder in `src/templates/`:

```
src/templates/my-template/
└── template.json
```

### Field Types

| Type | Description | Options |
|------|-------------|---------|
| `text` | Single line text input | `placeholder`, `required` |
| `textarea` | Multi-line text input | `rows`, `placeholder` |
| `color` | Color picker | `format` (hex, rgb, hsl) |
| `range` | Slider input | `min`, `max`, `step`, `unit` |
| `select` | Dropdown selection | `options` array |
| `checkbox` | Boolean toggle | `label` |
| `image` | Image URL input | `accept`, `multiple` |
| `number` | Numeric input | `min`, `max`, `step` |

### Example Field Configuration

```json
{
  "customization": {
    "design": {
      "primary_color": {
        "type": "color",
        "label": "Primary Color",
        "default": "#2A5D77",
        "format": "hex"
      },
      "container_width": {
        "type": "range",
        "label": "Container Width",
        "min": 800,
        "max": 1600,
        "step": 50,
        "unit": "px",
        "default": 1200
      },
      "layout_style": {
        "type": "select",
        "label": "Layout Style",
        "options": ["grid", "flex", "block"],
        "default": "grid"
      }
    }
  }
}
```

### Liquid Template Variables

Use `{{variable_name}}` in your HTML/CSS templates:

```html
<div class="container" style="max-width: {{container_width}}px;">
  <h1 style="color: {{primary_color}};">{{title}}</h1>
</div>
```

```css
.container {
  display: {{layout_style}};
  background: {{background_color}};
}
```

## 🔧 API Reference

### UniversalEngine Methods

```javascript
// Process template with settings
const processed = await engine.processTemplate(template, settings);

// Generate code for export
const { html, css, javascript } = engine.generateCode(template, settings);

// Create Shopify section
const shopifySection = engine.generateShopifySection(template, settings);
```

### FormBuilder Methods

```javascript
// Generate form HTML
const formHTML = formBuilder.generateForm(customization, sections, settings);

// Validate form data
const isValid = formBuilder.validateForm(formData, rules);
```

### PreviewRenderer Methods

```javascript
// Render live preview
const previewHTML = await renderer.render(template, settings);

// Set preview mode
renderer.setMode('desktop|tablet|mobile');
```

## 🚀 Deployment

### Production Build

1. **Minify Assets** (optional)
   ```bash
   # Minify CSS
   npx clean-css-cli src/styles/main.css -o dist/styles/main.min.css
   
   # Minify JavaScript
   npx terser src/core/*.js -o dist/core/app.min.js
   ```

2. **Configure Web Server**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /path/to/liquid-template-customizer;
       index index.html;
       
       location / {
           try_files $uri $uri/ =404;
       }
       
       # Cache static assets
       location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
           expires 1y;
           add_header Cache-Control "public";
       }
   }
   ```

### Environment Variables

```bash
# Optional configuration
ZERA_API_URL=https://api.zera.com
ZERA_CDN_URL=https://cdn.zera.com
ZERA_ENV=production
```

## 🐛 Troubleshooting

### Common Issues

#### **Templates Not Loading**
```
Error: Template not found: template-name
```
**Solution:** Ensure template.json exists in `src/templates/template-name/`

#### **Preview Not Updating**
**Symptoms:** Changes don't reflect in preview
**Solutions:**
- Check browser console for JavaScript errors
- Ensure template syntax is valid
- Try refreshing with `Ctrl + R`

#### **Form Fields Not Generating**
**Symptoms:** Sidebar shows empty form
**Solutions:**
- Validate template.json structure
- Check customization field definitions
- Ensure default values are provided

#### **Export Not Working**
**Symptoms:** Download button doesn't work
**Solutions:**
- Check browser permissions for downloads
- Ensure template is fully loaded
- Try using "Copy Code" instead

### Browser Compatibility

| Browser | Minimum Version | Notes |
|---------|----------------|-------|
| Chrome | 88+ | Recommended |
| Firefox | 85+ | Full support |
| Safari | 14+ | Limited file API |
| Edge | 88+ | Full support |

### Performance Tips

1. **Large Templates** - Break into smaller sections for better performance
2. **Image Assets** - Use optimized images and CDN when possible
3. **Browser Cache** - Enable caching for faster subsequent loads

## 🤝 Contributing

### Development Setup

1. **Fork the repository**
2. **Create feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make changes**
4. **Test thoroughly**
5. **Submit pull request**

### Code Style

- Use 4 spaces for indentation
- Follow JSDoc commenting conventions
- Use semantic commit messages
- Test on multiple browsers

### Adding New Field Types

1. **Update FormBuilder**
   ```javascript
   // In form-builder.js
   generateFieldHTML(field, value) {
       switch(field.type) {
           case 'your-new-type':
               return this.generateYourNewType(field, value);
       }
   }
   ```

2. **Add CSS Styles**
   ```css
   /* In main.css */
   .your-new-type-input {
       /* Styles for new field type */
   }
   ```

3. **Update Documentation**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Shopify** - For the amazing Liquid template engine
- **Font Awesome** - For beautiful icons
- **Google Fonts** - For typography
- **ZERA Team** - For making this project possible

## 📞 Support

- **Documentation**: [docs.zera.com](https://docs.zera.com)
- **Issues**: [GitHub Issues](https://github.com/zera-team/liquid-template-customizer/issues)
- **Email**: support@zera.com
- **Discord**: [ZERA Community](https://discord.gg/zera)

---

**Made with ❤️ by the ZERA Team**

*Transform your Shopify store with beautiful, custom sections - no coding required!*